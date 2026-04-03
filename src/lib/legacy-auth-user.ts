import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import type { User } from '@/lib/db/schema'

type AuthLookup = {
  id?: string
  email?: string
  phone?: string
}

function normalizeLegacyRow(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    passwordHash: (row.passwordHash as string | null) ?? null,
    firstName: String(row.firstName ?? row.name ?? ''),
    lastName: String(row.lastName ?? ''),
    dateOfBirth: (row.dateOfBirth as Date | null) ?? null,
    nationality: (row.nationality as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    preferredLanguage: String(row.preferredLanguage ?? 'fr'),
    emailVerified: Boolean(row.emailVerified ?? false),
    phoneVerified: Boolean(row.phoneVerified ?? false),
    otpVerifiedAt: (row.otpVerifiedAt as Date | null) ?? null,
    kycStatus: (row.kycStatus as User['kycStatus']) ?? 'PENDING',
    createdAt: (row.createdAt as Date) ?? new Date(),
    updatedAt: (row.updatedAt as Date) ?? new Date(),
    civilite: (row.civilite as string | null) ?? null,
    country: (row.country as string | null) ?? null,
    region: (row.region as string | null) ?? null,
    department: (row.department as string | null) ?? null,
    arrondissement: (row.arrondissement as string | null) ?? null,
    district: (row.district as string | null) ?? null,
    domaineActivite: (row.domaineActivite as string | null) ?? null,
    idExpiryDate: (row.idExpiryDate as Date | null) ?? null,
    idIssueDate: (row.idIssueDate as Date | null) ?? null,
    idNumber: (row.idNumber as string | null) ?? null,
    idType: (row.idType as string | null) ?? null,
    marketingAccepted: Boolean(row.marketingAccepted ?? false),
    metiers: (row.metiers as string | null) ?? null,
    placeOfBirth: (row.placeOfBirth as string | null) ?? null,
    privacyAccepted: Boolean(row.privacyAccepted ?? false),
    signature: (row.signature as string | null) ?? null,
    statutEmploi: (row.statutEmploi as string | null) ?? null,
    termsAccepted: Boolean(row.termsAccepted ?? false),
    failedAttempts: Number(row.failedAttempts ?? 0),
    lockedUntil: (row.lockedUntil as Date | null) ?? null,
  }
}

export async function findLegacyAuthUser(where: AuthLookup): Promise<User | null> {
  let result
  if (where.id) {
    result = await db.execute(sql`select * from "user" where id = ${where.id} limit 1`)
  } else if (where.email) {
    result = await db.execute(sql`select * from "user" where lower(email) = lower(${where.email}) limit 1`)
  } else if (where.phone) {
    result = await db.execute(sql`select * from "user" where phone = ${where.phone} limit 1`)
  } else {
    return null
  }

  const row = (result as { rows?: Record<string, unknown>[] }).rows?.[0]
  return row ? normalizeLegacyRow(row) : null
}

export async function updateLegacyAuthUserPassword(userId: string, passwordHash: string): Promise<void> {
  // Legacy NextAuth stores credentials in the "account" table
  // The password column stores: "salt:bcryptHash" where hash is bcrypt
  // We need to create a salt and store the result in this format for NextAuth to compare

  // Generate a salt and create the stored password format
  const salt = await bcrypt.genSalt(12)
  const storedPassword = `${salt}:${passwordHash}`

  await db.execute(sql`
    update "account"
    set "password" = ${storedPassword}
    where "user_id" = ${userId} and "provider_id" = 'credential'
  `)
}

export async function updateLegacyAuthLockState(
  userId: string,
  failedAttempts: number,
  lockedUntil: Date | null
): Promise<void> {
  await db.execute(sql`
    update "user"
    set "failedAttempts" = ${failedAttempts}, "lockedUntil" = ${lockedUntil}, "updatedAt" = now()
    where id = ${userId}
  `)
}

export async function resetLegacyAuthLockState(userId: string): Promise<void> {
  await db.execute(sql`
    update "user"
    set "failedAttempts" = 0, "lockedUntil" = null, "updatedAt" = now()
    where id = ${userId}
  `)
}
