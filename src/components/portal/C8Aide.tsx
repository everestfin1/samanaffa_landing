'use client';

import { useRouter } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const SUPPORT_PHONE = '+221 33 822 87 00';
const SUPPORT_PHONE_TEL = '+221338228700';
const WHATSAPP_PHONE = '221770993382';
const CLAIM_EMAIL = 'samanaffa@everestfin.com';

export default function C8Aide() {
  const router = useRouter();

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      'Bonjour, j’ai besoin d’aide concernant mon compte Sama Naffa.',
    );
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const openClaim = () => {
    const subject = encodeURIComponent('Réclamation Sama Naffa');
    const body = encodeURIComponent(
      'Bonjour,\n\nJe souhaite déposer une réclamation concernant :\n\n- Compte / Kondanné :\n- Description :\n- Date des faits :\n\nCordialement,',
    );
    window.location.href = `mailto:${CLAIM_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="c8-shell">
      <button type="button" className="c2-back c8-back" onClick={() => router.back()}>
        ← Retour
      </button>

      <h1 className="c8-title">Aide & réclamations</h1>

      <div className="c8-cards">
        <button type="button" className="c8-card" onClick={openWhatsApp}>
          <span className="c8-card-icon c8-card-icon--wa" aria-hidden>
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </span>
          <span className="c8-card-title">Agent WhatsApp</span>
          <span className="c8-card-sub">Réponse rapide en journée</span>
        </button>

        <a className="c8-card" href={`tel:${SUPPORT_PHONE_TEL}`}>
          <span className="c8-card-icon c8-card-icon--phone" aria-hidden>
            <PhoneIcon className="h-6 w-6" />
          </span>
          <span className="c8-card-title">Service client (SAV)</span>
          <span className="c8-card-sub">{SUPPORT_PHONE}</span>
        </a>

        <button type="button" className="c8-card" onClick={openClaim}>
          <span className="c8-card-icon c8-card-icon--claim" aria-hidden>
            <DocumentTextIcon className="h-6 w-6" />
          </span>
          <span className="c8-card-title">Dépose une réclamation</span>
          <span className="c8-card-sub">Suivi sous 48 h ouvrées</span>
        </button>
      </div>

      <aside className="c8-banner" role="note">
        L’assistance ne communique aucun chiffre de rendement. Pour toute question de performance
        ou d’ordre institutionnel, tu seras orienté vers le support EVEREST Finance.
      </aside>
    </div>
  );
}
