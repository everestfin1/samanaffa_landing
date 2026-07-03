import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { fieldAgents } from '@/lib/db/schema';

/** Referral codes share the sponsor-code normalization (trim + uppercase). */
export function normalizeAgentCode(code: string): string {
  return code.trim().toUpperCase();
}

export type AgentCodeVerificationResult =
  | { valid: true; agentId: string; code: string; name: string; message: string }
  | { valid: false; error: string };

/** Validates a Sama Naffa referral code against `field_agents`. */
export async function verifyAgentCode(
  rawCode: string,
): Promise<AgentCodeVerificationResult> {
  if (!rawCode || typeof rawCode !== 'string' || rawCode.trim().length < 3) {
    return { valid: false, error: 'Code de parrainage invalide' };
  }

  const code = normalizeAgentCode(rawCode);

  const [agent] = await db
    .select()
    .from(fieldAgents)
    .where(eq(fieldAgents.code, code))
    .limit(1);

  if (!agent) {
    return { valid: false, error: 'Code de parrainage non reconnu' };
  }

  if (agent.status !== 'ACTIVE') {
    return {
      valid: false,
      error:
        agent.status === 'EXPIRED'
          ? 'Ce code de parrainage a expiré'
          : "Ce code de parrainage n'est plus actif",
    };
  }

  if (agent.expiresAt && new Date(agent.expiresAt) < new Date()) {
    await db
      .update(fieldAgents)
      .set({ status: 'EXPIRED', updatedAt: new Date() })
      .where(eq(fieldAgents.id, agent.id));
    return { valid: false, error: 'Ce code de parrainage a expiré' };
  }

  if (agent.maxUsage !== null && agent.usageCount >= agent.maxUsage) {
    return { valid: false, error: "Ce code de parrainage a atteint sa limite d'utilisation" };
  }

  return {
    valid: true,
    agentId: agent.id,
    code: agent.code,
    name: agent.name,
    message: 'Code de parrainage valide',
  };
}

/** Increments usage when a validated code is attributed to a new signup. */
export async function recordAgentCodeUsage(code: string): Promise<void> {
  const normalizedCode = normalizeAgentCode(code);
  const [agent] = await db
    .select()
    .from(fieldAgents)
    .where(eq(fieldAgents.code, normalizedCode))
    .limit(1);

  if (!agent || agent.status !== 'ACTIVE') return;

  await db
    .update(fieldAgents)
    .set({ usageCount: agent.usageCount + 1, updatedAt: new Date() })
    .where(eq(fieldAgents.id, agent.id));
}

/** Resolves a raw referral code to its id, or null when invalid/inactive. */
export async function resolveAgentId(rawCode: string | null | undefined): Promise<string | null> {
  if (!rawCode) return null;
  const result = await verifyAgentCode(rawCode);
  return result.valid ? result.agentId : null;
}
