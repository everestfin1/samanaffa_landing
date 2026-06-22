import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userAccounts, users } from '@/lib/db/schema';
import { mergeInvestorProfile, readOnboardingProgress } from './onboarding-progress';

const PURPOSE = 'post_signup';
const TTL_MS = 5 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required for post-signup tokens');
  }
  return secret;
}

type PostSignupMeta = {
  postSignupJti?: string;
  postSignupExpires?: string;
};

function readPostSignupMeta(raw: unknown): PostSignupMeta {
  const onboarding = readOnboardingProgress(raw);
  return {
    postSignupJti: onboarding.postSignupJti as string | undefined,
    postSignupExpires: onboarding.postSignupExpires as string | undefined,
  };
}

/** Issue a one-time token after successful onboarding account creation (≤5 min). */
export async function issuePostSignupToken(userId: string): Promise<string> {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + TTL_MS);

  const [user] = await db
    .select({ investorProfile: users.investorProfile })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  const investorProfile = mergeInvestorProfile(user.investorProfile, {
    onboarding: {
      postSignupJti: jti,
      postSignupExpires: expiresAt.toISOString(),
    },
  });

  await db
    .update(users)
    .set({ investorProfile, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return jwt.sign({ sub: userId, purpose: PURPOSE, jti }, getSecret(), { expiresIn: '5m' });
}

/** Verify and consume token; returns userId or null if invalid/already used. */
export async function consumePostSignupToken(token: string): Promise<string | null> {
  try {
    const payload = jwt.verify(token, getSecret()) as {
      sub?: string;
      purpose?: string;
      jti?: string;
    };

    if (payload.purpose !== PURPOSE || !payload.sub || !payload.jti) {
      return null;
    }

    const userId = payload.sub;
    const jti = payload.jti;

    return await db.transaction(async (tx) => {
      const [user] = await tx
        .select({ investorProfile: users.investorProfile })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return null;
      }

      const meta = readPostSignupMeta(user.investorProfile);
      if (!meta.postSignupJti || meta.postSignupJti !== jti) {
        return null;
      }
      if (!meta.postSignupExpires || new Date(meta.postSignupExpires) < new Date()) {
        return null;
      }

      const accounts = await tx
        .select({ id: userAccounts.id })
        .from(userAccounts)
        .where(eq(userAccounts.userId, userId));

      if (accounts.length < 2) {
        return null;
      }

      const investorProfile = mergeInvestorProfile(user.investorProfile, {
        onboarding: {
          postSignupJti: undefined,
          postSignupExpires: undefined,
        },
      });

      const [cleared] = await tx
        .update(users)
        .set({ investorProfile, updatedAt: new Date() })
        .where(
          and(
            eq(users.id, userId),
            sql`${users.investorProfile}->'onboarding'->>'postSignupJti' = ${jti}`,
          ),
        )
        .returning({ id: users.id });

      if (!cleared) {
        return null;
      }

      return userId;
    });
  } catch {
    return null;
  }
}
