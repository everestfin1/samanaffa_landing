'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { SponsorCodeStatus } from '@/hooks/useSponsorCodeVerification';

interface SponsorCodeFieldProps {
  hasCode: boolean | null;
  onHasCodeChange: (value: boolean) => void;
  code: string;
  onCodeChange: (value: string) => void;
  status: SponsorCodeStatus;
  message: string;
  disabled?: boolean;
}

export default function SponsorCodeField({
  hasCode,
  onHasCodeChange,
  code,
  onCodeChange,
  status,
  message,
  disabled = false,
}: SponsorCodeFieldProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-timberwolf/30">
      <p className="text-sm font-medium text-night">Avez-vous un code de parrainage ?</p>
      <div className="flex gap-2">
        {(
          [
            { value: false, label: 'Non' },
            { value: true, label: 'Oui' },
          ] as const
        ).map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled}
            onClick={() => onHasCodeChange(opt.value)}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              hasCode === opt.value
                ? 'border-[#435933] bg-gradient-to-r from-[#e8f5e8] to-[#d4f4d4] text-[#435933]'
                : 'border-timberwolf/30 bg-white text-night hover:border-[#435933]/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {hasCode === true && (
        <div>
          <label htmlFor="onboarding-referral-code" className="sr-only">
            Code de parrainage
          </label>
          <div className="relative">
            <input
              id="onboarding-referral-code"
              type="text"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              disabled={disabled}
              placeholder="Entrez votre code"
              autoComplete="off"
              className={`w-full px-4 py-3 pr-12 border-2 rounded-xl font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors ${
                status === 'valid'
                  ? 'border-green-500'
                  : status === 'invalid'
                    ? 'border-red-500'
                    : 'border-timberwolf/40'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {status === 'verifying' && (
                <svg
                  className="animate-spin h-5 w-5 text-night/40"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {status === 'valid' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
              {status === 'invalid' && <XCircleIcon className="h-5 w-5 text-red-600" />}
            </div>
          </div>
          {message ? (
            <p
              className={`mt-1.5 text-xs ${
                status === 'valid' ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-night/50">
              Si quelqu&apos;un vous a recommandé Sama Naffa, entrez son code ici.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
