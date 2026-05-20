import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { prisma } from './prisma';
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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { investorProfile: true },
  });
  if (!user) {
    throw new Error('User not found');
  }

  const investorProfile = mergeInvestorProfile(user.investorProfile, {
    onboarding: {
      postSignupJti: jti,
      postSignupExpires: expiresAt.toISOString(),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { investorProfile },
  });

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

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { investorProfile: true },
    });
    if (!user) {
      return null;
    }

    const meta = readPostSignupMeta(user.investorProfile);
    if (!meta.postSignupJti || meta.postSignupJti !== payload.jti) {
      return null;
    }
    if (!meta.postSignupExpires || new Date(meta.postSignupExpires) < new Date()) {
      return null;
    }

    const accounts = await prisma.userAccount.findMany({
      where: { userId: payload.sub },
    });
    if (accounts.length < 2) {
      return null;
    }

    const investorProfile = mergeInvestorProfile(user.investorProfile, {
      onboarding: {
        postSignupJti: undefined,
        postSignupExpires: undefined,
      },
    });

    await prisma.user.update({
      where: { id: payload.sub },
      data: { investorProfile },
    });

    return payload.sub;
  } catch {
    return null;
  }
}
