'use client';

import Link from 'next/link';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

/**
 * Shown when Emprunt obligataire is deprecated (`NEXT_PUBLIC_APE_DEPRECATED=true`).
 */
export default function ApeDeprecatedNotice() {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-timberwolf/20 p-8 text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-gold-metallic/10 flex items-center justify-center">
        <BuildingLibraryIcon className="w-8 h-8 text-gold-metallic" />
      </div>
      <h1 className="text-2xl font-bold text-night">Emprunt obligataire</h1>
      <p className="text-sm text-night/70 leading-relaxed">
        Les nouvelles souscriptions à l&apos;Emprunt obligataire ne sont plus proposées sur
        Sama Naffa. Votre épargne et vos services restent disponibles sur Sama Naffa.
      </p>
      <p className="text-xs text-night/50">
        Pour toute question sur un investissement existant, contactez le support.
      </p>
      <Link
        href="/portal/sama-naffa"
        className="inline-block w-full py-3 px-4 bg-gold-metallic text-white font-semibold rounded-xl hover:bg-gold-dark transition-colors"
      >
        Aller à Sama Naffa
      </Link>
      <Link
        href="/portal/dashboard"
        className="inline-block text-sm text-night/60 hover:text-night"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}
