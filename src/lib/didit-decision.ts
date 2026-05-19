/**
 * Didit session decision fetch + safe identity extraction for KYC sync.
 * @see https://docs.didit.me/sessions-api/retrieve-session
 */

const DIDIT_BASE = 'https://verification.didit.me/v3';

export interface DiditIdVerification {
  status?: string;
  document_type?: string;
  issuing_country?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  document_number?: string;
  expiry_date?: string;
  gender?: string;
  nationality?: string;
}

export interface DiditWarning {
  feature?: string;
  risk?: string;
  log_type?: string;
  short_description?: string;
  long_description?: string;
}

export interface DiditDecision {
  session_id?: string;
  status?: string;
  features?: string[];
  id_verifications?: DiditIdVerification[];
  liveness_checks?: Array<{ status?: string; score?: number }>;
  face_matches?: Array<{ status?: string; score?: number }>;
  aml_screenings?: unknown[];
  warnings?: DiditWarning[];
}

export interface ParsedDiditIdentity {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  nationality?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  idExpiryDate?: Date;
  placeOfBirth?: string;
  documentType?: string;
}

const ISO_COUNTRY_NAMES: Record<string, string> = {
  SEN: 'Sénégal',
  SN: 'Sénégal',
  FRA: 'France',
  FR: 'France',
  USA: 'États-Unis',
  US: 'États-Unis',
  CIV: "Côte d'Ivoire",
  MLI: 'Mali',
  BFA: 'Burkina Faso',
  GMB: 'Gambie',
  GIN: 'Guinée',
  MRT: 'Mauritanie',
};

export async function fetchDiditDecision(sessionId: string): Promise<DiditDecision | null> {
  const apiKey = process.env.DIDIT_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`${DIDIT_BASE}/session/${sessionId}/decision/`, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('[didit-decision] fetch failed:', res.status);
    return null;
  }

  return (await res.json()) as DiditDecision;
}

function primaryIdVerification(decision: DiditDecision): DiditIdVerification | undefined {
  const list = decision.id_verifications ?? [];
  return list.find((v) => v.status === 'Approved') ?? list[0];
}

export function parseDiditIdentity(decision: DiditDecision): ParsedDiditIdentity | null {
  const id = primaryIdVerification(decision);
  if (!id) return null;

  const parsed: ParsedDiditIdentity = {};

  if (id.first_name?.trim()) parsed.firstName = id.first_name.trim();
  if (id.last_name?.trim()) parsed.lastName = id.last_name.trim();
  if (id.date_of_birth) {
    const dob = new Date(id.date_of_birth);
    if (!Number.isNaN(dob.getTime())) parsed.dateOfBirth = dob;
  }
  if (id.nationality?.trim()) parsed.nationality = id.nationality.trim();
  if (id.document_type) parsed.documentType = id.document_type;
  if (id.document_number) parsed.idNumber = id.document_number;
  if (id.expiry_date) {
    const exp = new Date(id.expiry_date);
    if (!Number.isNaN(exp.getTime())) parsed.idExpiryDate = exp;
  }

  const issuing = id.issuing_country?.trim().toUpperCase();
  if (issuing) {
    parsed.country = ISO_COUNTRY_NAMES[issuing] ?? issuing;
  } else if (parsed.nationality) {
    parsed.country = ISO_COUNTRY_NAMES[parsed.nationality.toUpperCase()] ?? parsed.nationality;
  }

  if (id.document_type) {
    parsed.idType = id.document_type.replace(/_/g, ' ');
  }

  return parsed;
}

/** User-facing decline hints (French). */
export function getDiditDeclineMessages(decision: DiditDecision): string[] {
  const warnings = decision.warnings ?? [];
  const fromWarnings = warnings
    .map((w) => w.long_description || w.short_description)
    .filter((m): m is string => !!m?.trim());

  if (fromWarnings.length > 0) return fromWarnings.slice(0, 4);

  const id = primaryIdVerification(decision);
  if (id?.status === 'Declined') {
    return ['Le document d\'identité n\'a pas pu être validé. Vérifiez la netteté et l\'éclairage.'];
  }

  return ['La vérification n\'a pas abouti. Réessayez avec un document valide et un selfie net.'];
}

/** Store only non-sensitive audit fields. */
export function buildRedactedDecisionPayload(decision: DiditDecision): Record<string, unknown> {
  const id = primaryIdVerification(decision);
  return {
    session_id: decision.session_id,
    status: decision.status,
    features: decision.features,
    id_summary: id
      ? {
          status: id.status,
          document_type: id.document_type,
          issuing_country: id.issuing_country,
          first_name: id.first_name,
          last_name: id.last_name,
          date_of_birth: id.date_of_birth,
          nationality: id.nationality,
          document_number_last4: id.document_number
            ? id.document_number.slice(-4)
            : undefined,
        }
      : null,
    liveness: (decision.liveness_checks ?? []).map((c) => ({
      status: c.status,
      score: c.score,
    })),
    face_match: (decision.face_matches ?? []).map((c) => ({
      status: c.status,
      score: c.score,
    })),
    warning_count: decision.warnings?.length ?? 0,
    fetched_at: new Date().toISOString(),
  };
}

const PLACEHOLDER_LAST_NAMES = new Set(['membre', 'member']);

export function buildUserPatchFromDiditIdentity(
  current: {
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    nationality?: string | null;
    country?: string | null;
    address?: string | null;
    city?: string | null;
    idType?: string | null;
    idNumber?: string | null;
    idExpiryDate?: Date | null;
    placeOfBirth?: string | null;
  },
  identity: ParsedDiditIdentity,
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  if (!current.firstName?.trim() && identity.firstName) {
    patch.firstName = identity.firstName;
  }

  const last = current.lastName?.trim().toLowerCase();
  if ((!last || PLACEHOLDER_LAST_NAMES.has(last)) && identity.lastName) {
    patch.lastName = identity.lastName;
  }

  if (!current.dateOfBirth && identity.dateOfBirth) {
    patch.dateOfBirth = identity.dateOfBirth;
  }
  if (!current.nationality?.trim() && identity.nationality) {
    patch.nationality = identity.nationality;
  }
  if (!current.country?.trim() && identity.country) {
    patch.country = identity.country;
  }
  if (!current.idType?.trim() && identity.idType) {
    patch.idType = identity.idType;
  }
  if (!current.idNumber?.trim() && identity.idNumber) {
    patch.idNumber = identity.idNumber;
  }
  if (!current.idExpiryDate && identity.idExpiryDate) {
    patch.idExpiryDate = identity.idExpiryDate;
  }
  if (!current.placeOfBirth?.trim() && identity.placeOfBirth) {
    patch.placeOfBirth = identity.placeOfBirth;
  }

  return patch;
}
