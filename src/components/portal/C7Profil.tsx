'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface C7ProfileUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string | null;
  country?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycStatus: KYCStatus;
  marketingAccepted?: boolean;
}

interface C7ProfilProps {
  user: C7ProfileUser;
  onToggleMarketing?: (enabled: boolean) => Promise<void>;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('221')) {
    return `+221 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

export default function C7Profil({ user, onToggleMarketing }: C7ProfilProps) {
  const router = useRouter();
  const [smsOn, setSmsOn] = useState(Boolean(user.marketingAccepted ?? true));
  const [emailNotifOn, setEmailNotifOn] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const initials = useMemo(() => {
    const a = user.firstName?.charAt(0) || '';
    const b = user.lastName?.charAt(0) || '';
    return `${a}${b}`.toUpperCase() || 'SN';
  }, [user.firstName, user.lastName]);

  const fullName = `${user.firstName} ${user.lastName}`.trim() || 'Client Sama Naffa';
  const location = [user.city, user.country || 'Sénégal'].filter(Boolean).join(', ');
  const contactLine = [formatPhone(user.phone), location].filter(Boolean).join(' · ');

  const handleSmsToggle = async () => {
    const next = !smsOn;
    setSmsOn(next);
    if (!onToggleMarketing) return;
    setSaving(true);
    setMessage(null);
    try {
      await onToggleMarketing(next);
    } catch (e) {
      setSmsOn(!next);
      setMessage(e instanceof Error ? e.message : 'Impossible d’enregistrer la préférence');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="c7-shell">
      <button type="button" className="c2-back c7-back" onClick={() => router.back()}>
        ← Retour
      </button>

      <h1 className="c7-title">Profil & sécurité</h1>

      <section className="c7-hero" aria-label="Profil">
        <div className="c7-avatar" aria-hidden>
          {initials}
        </div>
        <div className="c7-hero-text">
          <p className="c7-name">{fullName}</p>
          <p className="c7-contact">{contactLine}</p>
        </div>
      </section>

      <div className="c7-grid">
        <section className="c7-card" aria-label="Paramètres du compte">
          <p className="c7-card-eyebrow">Paramètres du compte</p>
          <ul className="c7-rows">
            <li className="c7-row">
              <div className="c7-row-main">
                <span className="c7-row-label">Notifications email</span>
                <span className="c7-row-meta">{user.email || '—'}</span>
              </div>
              <button
                type="button"
                className="c7-link"
                onClick={() => setEmailNotifOn((v) => !v)}
              >
                {emailNotifOn ? 'Désactiver' : 'Activer'}
              </button>
            </li>
            <li className="c7-row">
              <span className="c7-row-label">Notifications SMS</span>
              <button
                type="button"
                className={`c7-toggle${smsOn ? ' is-on' : ''}`}
                role="switch"
                aria-checked={smsOn}
                disabled={saving}
                onClick={() => void handleSmsToggle()}
              >
                <span className="c7-toggle-knob" />
              </button>
            </li>
            <li className="c7-row">
              <div className="c7-row-main">
                <span className="c7-row-label">Authentification à deux facteurs</span>
                <span className="c7-row-meta">Connexion par OTP SMS active</span>
              </div>
              <button
                type="button"
                className="c7-toggle is-on"
                role="switch"
                aria-checked
                disabled
                title="La connexion Sama Naffa utilise déjà un code OTP par SMS"
              >
                <span className="c7-toggle-knob" />
              </button>
            </li>
          </ul>
        </section>

        <section className="c7-card" aria-label="Sécurité">
          <p className="c7-card-eyebrow">Sécurité</p>
          <ul className="c7-rows">
            <li>
              <button
                type="button"
                className="c7-row c7-row--action"
                onClick={() => router.push('/forgot-password')}
              >
                <span className="c7-row-label">Changer le mot de passe</span>
                <span className="c7-chevron" aria-hidden>
                  ›
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="c7-row c7-row--action"
                onClick={() =>
                  setMessage(
                    'Session actuelle sur cet appareil. La gestion multi-appareils arrive bientôt.',
                  )
                }
              >
                <div className="c7-row-main">
                  <span className="c7-row-label">Sessions actives</span>
                  <span className="c7-row-meta">1 appareil · cet appareil</span>
                </div>
                <span className="c7-chevron" aria-hidden>
                  ›
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      {message && (
        <p className="c7-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
