import jwt from 'jsonwebtoken';

const PURPOSE = 'email_verify';
const TTL = '24h';

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required for email verification tokens');
  }
  return secret;
}

/**
 * Token proving control of a mailbox. Single use is enforced by the confirm
 * route, which requires the address to still be the user's pendingEmail.
 */
export function issueEmailVerificationToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email, purpose: PURPOSE }, getSecret(), { expiresIn: TTL });
}

export function readEmailVerificationToken(
  token: string,
): { userId: string; email: string } | null {
  try {
    const payload = jwt.verify(token, getSecret()) as {
      sub?: string;
      email?: string;
      purpose?: string;
    };
    if (payload.purpose !== PURPOSE || !payload.sub || !payload.email) return null;
    return { userId: payload.sub, email: payload.email.toLowerCase() };
  } catch {
    return null;
  }
}
