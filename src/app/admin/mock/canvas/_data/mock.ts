// Mock data layer for the Canvas admin prototype.
// Deterministic (seeded) so server and client render identically before any API wiring.

export type TxStatus = 'completed' | 'pending' | 'processing' | 'failed';
export type TxType = 'deposit' | 'investment' | 'withdrawal';

export interface MockTransaction {
  id: string;
  ref: string;
  user: string;
  email: string;
  type: TxType;
  amount: number;
  status: TxStatus;
  method: string;
  date: string; // ISO
}

export type KycStatus = 'approved' | 'pending' | 'under_review' | 'rejected';

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kyc: KycStatus;
  balance: number;
  transactions: number;
  joined: string; // ISO
  tier: 'Standard' | 'Premium' | 'VIP';
}

export interface MockKycCase {
  id: string;
  user: string;
  docType: string;
  submitted: string; // ISO
  priority: 'urgent' | 'normal';
  status: KycStatus;
  idNumber: string;
  dob: string;
}

const FIRST = ['Mamadou', 'Awa', 'Ibrahima', 'Fatou', 'Cheikh', 'Aïssatou', 'Ousmane', 'Mariama', 'Modou', 'Khady', 'Abdoulaye', 'Ndeye'];
const LAST = ['Diallo', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Gueye', 'Diop', 'Sarr', 'Cissé', 'Faye', 'Mbaye', 'Sy'];
const METHODS = ['Wave', 'Orange Money', 'Free Money', 'Virement bancaire'];

// Simple seeded PRNG (mulberry32) for stable values.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = rng(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
const daysAgo = (n: number) => new Date(Date.UTC(2026, 4, 28) - n * 86400000).toISOString();

const TX_STATUSES: TxStatus[] = ['completed', 'completed', 'completed', 'pending', 'processing', 'failed'];
const TX_TYPES: TxType[] = ['deposit', 'investment', 'deposit', 'withdrawal'];

export const transactions: MockTransaction[] = Array.from({ length: 28 }).map((_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: `tx_${i}`,
    ref: `TRX-${(80432 + i * 7).toString()}`,
    user: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    type: TX_TYPES[Math.floor(r() * TX_TYPES.length)],
    amount: (Math.floor(r() * 480) + 20) * 5000,
    status: TX_STATUSES[Math.floor(r() * TX_STATUSES.length)],
    method: pick(METHODS),
    date: daysAgo(Math.floor(r() * 30)),
  };
});

const KYC_STATUSES: KycStatus[] = ['approved', 'pending', 'under_review', 'rejected'];
const TIERS: MockUser['tier'][] = ['Standard', 'Standard', 'Premium', 'VIP'];

export const users: MockUser[] = Array.from({ length: 18 }).map((_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: `usr_${i}`,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    phone: `+221 7${Math.floor(r() * 9)} ${Math.floor(100 + r() * 899)} ${Math.floor(10 + r() * 89)} ${Math.floor(10 + r() * 89)}`,
    kyc: KYC_STATUSES[Math.floor(r() * KYC_STATUSES.length)],
    balance: Math.floor(r() * 4_800_000) + 50_000,
    transactions: Math.floor(r() * 40) + 1,
    joined: daysAgo(Math.floor(r() * 365)),
    tier: TIERS[Math.floor(r() * TIERS.length)],
  };
});

export const kycQueue: MockKycCase[] = Array.from({ length: 9 }).map((_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  return {
    id: `kyc_${i}`,
    user: `${first} ${last}`,
    docType: r() > 0.5 ? "Carte d'identité nationale" : 'Passeport',
    submitted: daysAgo(Math.floor(r() * 5)),
    priority: i < 2 ? 'urgent' : 'normal',
    status: i < 6 ? 'under_review' : 'pending',
    idNumber: `SN-${Math.floor(1_000_000_000 + r() * 8_999_999_999)}`,
    dob: `${Math.floor(1 + r() * 27)}/0${Math.floor(1 + r() * 9)}/19${Math.floor(80 + r() * 19)}`,
  };
});

// Aggregates
export const metrics = {
  aum: transactions
    .filter((t) => t.status === 'completed' && t.type !== 'withdrawal')
    .reduce((s, t) => s + t.amount, 0),
  deposits: transactions.filter((t) => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
  investments: transactions.filter((t) => t.type === 'investment' && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
  totalUsers: 1284,
  newUsers: 42,
  pendingKyc: kycQueue.length,
  pendingTx: transactions.filter((t) => t.status === 'pending').length,
};

// 14-point trend series for sparklines (seeded)
const sr = rng(7);
export const aumTrend: number[] = Array.from({ length: 16 }).map((_, i) => 40 + i * 3 + Math.floor(sr() * 22));
export const depositTrend: number[] = Array.from({ length: 16 }).map(() => 20 + Math.floor(sr() * 60));

export const fmtFCFA = (n: number) => n.toLocaleString('fr-SN');
export const fmtCompact = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
};
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-SN', { day: '2-digit', month: 'short', year: 'numeric' });
export const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export const txTypeLabel: Record<TxType, string> = {
  deposit: 'Dépôt',
  investment: 'Investissement',
  withdrawal: 'Retrait',
};

export const txStatusLabel: Record<TxStatus, string> = {
  completed: 'Complété',
  pending: 'En attente',
  processing: 'En cours',
  failed: 'Échoué',
};

export const kycStatusLabel: Record<KycStatus, string> = {
  approved: 'Approuvé',
  pending: 'En attente',
  under_review: 'En révision',
  rejected: 'Rejeté',
};
