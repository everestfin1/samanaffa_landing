'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PEEK_HEIGHT = 46;
const STACK_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

export interface NaffaStackAccount {
  id: string;
  accountNumber: string;
  productName?: string | null;
  balance: number;
  status: string;
  interestRate?: number | null;
}

interface NaffaCardStackProps {
  accounts: NaffaStackAccount[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
  showBalance: boolean;
  onToggleBalance: () => void;
  getThemeByIndex: (index: number) => string;
}

function CardNoise({ opacity = 'opacity-30' }: { opacity?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${opacity} z-10`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}
    />
  );
}

function formatBalance(amount: number, visible: boolean) {
  if (!visible) return '••••••••';
  return `${Number(amount).toLocaleString('fr-FR')} FCFA`;
}

interface StackPeekProps {
  account: NaffaStackAccount;
  index: number;
  theme: string;
  showBalance: boolean;
  onSelect: () => void;
}

function StackPeek({ account, index, theme, showBalance, onSelect }: StackPeekProps) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      aria-label={`Afficher ${account.productName || 'Naffa'}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, top: index * PEEK_HEIGHT, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={STACK_TRANSITION}
      className="absolute left-0 right-0 w-full overflow-hidden rounded-t-2xl border border-white/15 shadow-md transition-shadow duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-metallic focus-visible:ring-offset-2"
      style={{
        height: PEEK_HEIGHT + 12,
        zIndex: index + 1,
      }}
    >
      <div className={`relative h-full w-full bg-gradient-to-r ${theme} px-4 py-3 text-left text-white sm:px-6`}>
        <CardNoise opacity="opacity-20" />
        <div className="relative z-20 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-white/40" />
            <p className="truncate text-sm font-semibold">{account.productName || 'Naffa personnalisé'}</p>
          </div>
          <p className="shrink-0 text-xs font-medium text-white/90 tabular-nums sm:text-sm">
            {formatBalance(account.balance, showBalance)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

interface StackFrontCardProps {
  account: NaffaStackAccount;
  theme: string;
  showBalance: boolean;
  onToggleBalance: () => void;
  stackIndex: number;
  stackTotal: number;
}

function StackFrontCard({
  account,
  theme,
  showBalance,
  onToggleBalance,
  stackIndex,
  stackTotal,
}: StackFrontCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl ring-2 ring-gold-metallic/40 ring-offset-2 ring-offset-white">
      <div className={`relative w-full bg-gradient-to-br ${theme} p-6 text-white sm:p-8`}>
        <CardNoise opacity="opacity-80" />

        <div className="absolute top-4 right-4 z-30 h-32 w-32 rounded-full border border-white/10" />
        <div className="absolute top-8 right-8 z-30 h-24 w-24 rounded-full border border-white/10" />
        <div className="absolute -top-4 -right-4 z-30 h-16 w-16 rounded-full border border-white/10" />

        <div className="absolute top-4 right-4 z-30 sm:top-6 sm:right-6">
          <Image
            src="/sama_naffa_logo.png"
            alt="Sama Naffa Logo"
            className="h-10 w-auto sm:h-12"
            width={100}
            height={48}
          />
        </div>

        <div className="relative z-20 space-y-6">
          <div className="flex items-start justify-between gap-4 pr-16 sm:pr-20">
            <div className="min-w-0">
              <p className="mb-1 text-sm text-white/70">Compte d&apos;épargne</p>
              <h4 className="text-xl font-bold sm:text-2xl">{account.productName || 'Naffa personnalisé'}</h4>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
              {stackIndex + 1}/{stackTotal}
            </span>
          </div>

          <div className="border-y border-white/10 py-4">
            <p className="mb-2 text-sm text-white/70">Solde disponible</p>
            <div className="flex items-center justify-center gap-3">
              <motion.p
                key={showBalance ? 'visible' : 'hidden'}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl tabular-nums"
              >
                {formatBalance(account.balance, showBalance)}
              </motion.p>
              <button
                type="button"
                onClick={onToggleBalance}
                className="cursor-pointer rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label={showBalance ? 'Masquer le solde' : 'Afficher le solde'}
              >
                {showBalance ? (
                  <EyeSlashIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-white/60">N° Compte</p>
              <p className="font-mono text-sm font-medium">{account.accountNumber}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-white/60">Statut</p>
              <p className="text-sm font-semibold capitalize">{account.status.toLowerCase()}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs uppercase tracking-wide text-white/60">Taux</p>
              <p className="text-sm font-semibold">{account.interestRate ?? 4.5}% annuel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NaffaCardStack({
  accounts,
  selectedAccountId,
  onSelectAccount,
  showBalance,
  onToggleBalance,
  getThemeByIndex,
}: NaffaCardStackProps) {
  const selectedIndex = accounts.findIndex((acc) => acc.id === selectedAccountId);
  const selectedAccount = selectedIndex >= 0 ? accounts[selectedIndex] : accounts[0];
  const peekAccounts = accounts.filter((acc) => acc.id !== selectedAccount.id);
  const stackOffset = peekAccounts.length * PEEK_HEIGHT;
  const frontTheme = getThemeByIndex(selectedIndex);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-night/60">
          {peekAccounts.length > 0
            ? 'Sélectionnez une carte au-dessus pour changer de compte'
            : 'Votre compte actif'}
        </p>
        <span className="rounded-full bg-gold-metallic/10 px-2.5 py-1 text-xs font-medium text-gold-metallic">
          {accounts.length} comptes
        </span>
      </div>

      <motion.div
        className="relative w-full"
        animate={{ paddingTop: stackOffset }}
        transition={STACK_TRANSITION}
      >
        <AnimatePresence initial={false}>
          {peekAccounts.map((account) => {
            const accountIndex = accounts.findIndex((acc) => acc.id === account.id);
            const peekOrder = peekAccounts.findIndex((acc) => acc.id === account.id);

            return (
              <StackPeek
                key={account.id}
                account={account}
                index={peekOrder}
                theme={getThemeByIndex(accountIndex)}
                showBalance={showBalance}
                onSelect={() => onSelectAccount(account.id)}
              />
            );
          })}
        </AnimatePresence>

        <div className="relative z-50 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAccount.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={STACK_TRANSITION}
              className="w-full"
            >
              <StackFrontCard
                account={selectedAccount}
                theme={frontTheme}
                showBalance={showBalance}
                onToggleBalance={onToggleBalance}
                stackIndex={selectedIndex}
                stackTotal={accounts.length}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
