'use client';

import { useSessionTimeout, useSessionTimeoutWarning, formatTimeRemaining } from '@/hooks/useSessionTimeout';

/** Idle timeout + warning banner for authenticated portal pages (AUTH-010). */
export default function PortalSessionShell() {
  const { showWarning, timeRemaining, onWarning, onDismiss } = useSessionTimeoutWarning();

  useSessionTimeout({
    enabled: true,
    onWarning,
  });

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 shadow-lg flex items-start justify-between gap-3">
        <p className="text-sm text-amber-900">
          Votre session expire dans {formatTimeRemaining(timeRemaining)} par inactivité.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-medium text-amber-800 hover:text-amber-950 shrink-0"
        >
          Rester connecté
        </button>
      </div>
    </div>
  );
}
