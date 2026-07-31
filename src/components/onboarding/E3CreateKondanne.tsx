'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import RiskDisclaimer from '@/components/compliance/RiskDisclaimer';
import { objectives } from '@/components/data/objectives';
import {
  NATTUKAAY_AMOUNT_MAX,
  NATTUKAAY_AMOUNT_MIN,
  NATTUKAAY_AMOUNT_STEP,
  NATTUKAAY_DUREE_MAX,
  NATTUKAAY_DUREE_MIN,
  NATTUKAAY_NAME_MAX,
  NATTUKAAY_PROJECTS,
  type NattukaaySlug,
} from '@/components/data/nattukaay-projects';
import { type ProjectId, type T0Result } from '@/components/onboarding/T0Simulator';
import {
  calculerCapitalFinal,
  tauxParDuree,
} from '@/lib/savings-simulation';

export type E3CreateResult = T0Result & {
  kondanneName: string;
};

interface E3CreateKondanneProps {
  firstName?: string | null;
  initial?: Partial<E3CreateResult> | null;
  onSuccess: (result: E3CreateResult) => void | Promise<void>;
  onBack?: () => void;
}

function formatAmountInput(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function parseAmountInput(raw: string): number {
  const digits = raw.replace(/\s/g, '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function formatResultAmount(amount: number): string {
  return `${formatAmountInput(Math.round(amount))} FCFA`;
}

function slugFromProject(project: ProjectId | string | undefined): NattukaaySlug {
  const match = NATTUKAAY_PROJECTS.find((p) => p.slug === project);
  return match?.slug ?? 'business';
}

export default function E3CreateKondanne({
  firstName,
  initial,
  onSuccess,
  onBack,
}: E3CreateKondanneProps) {
  const [selectedSlug, setSelectedSlug] = useState<NattukaaySlug>(
    slugFromProject(initial?.project),
  );
  const [kondanneName, setKondanneName] = useState('');
  const [mensualite, setMensualite] = useState(
    initial?.monthlyAmount && initial.monthlyAmount >= NATTUKAAY_AMOUNT_MIN
      ? initial.monthlyAmount
      : 50_000,
  );
  const [duree, setDuree] = useState(
    initial?.durationMonths && initial.durationMonths >= NATTUKAAY_DUREE_MIN
      ? initial.durationMonths
      : 120,
  );
  const [amountDraft, setAmountDraft] = useState(formatAmountInput(mensualite));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => NATTUKAAY_PROJECTS.find((p) => p.slug === selectedSlug) ?? NATTUKAAY_PROJECTS[2],
    [selectedSlug],
  );

  useEffect(() => {
    setAmountDraft(formatAmountInput(mensualite));
  }, [mensualite]);

  const taux = tauxParDuree(duree);
  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const totalVerse = mensualite * duree;

  const amountFill =
    ((mensualite - NATTUKAAY_AMOUNT_MIN) / (NATTUKAAY_AMOUNT_MAX - NATTUKAAY_AMOUNT_MIN)) * 100;
  const dureeFill =
    ((duree - NATTUKAAY_DUREE_MIN) / (NATTUKAAY_DUREE_MAX - NATTUKAAY_DUREE_MIN)) * 100;

  const handleSelectProject = (slug: NattukaaySlug) => {
    const project = NATTUKAAY_PROJECTS.find((p) => p.slug === slug);
    if (!project) return;
    const objective = objectives.find((o) => o.id === project.objectiveId);
    setSelectedSlug(slug);
    if (objective) {
      setMensualite(Math.min(NATTUKAAY_AMOUNT_MAX, objective.mensualite));
      setDuree(Math.min(NATTUKAAY_DUREE_MAX, objective.duree));
    }
  };

  const canSubmit = kondanneName.trim().length > 0 && mensualite >= NATTUKAAY_AMOUNT_MIN;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await onSuccess({
        project: selected.slug as ProjectId,
        monthlyAmount: mensualite,
        durationMonths: duree,
        kondanneName: kondanneName.trim(),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const titleName = firstName?.trim() || 'toi';

  return (
    <div className="e0-nattukaay e3-create">
      {onBack && (
        <button type="button" onClick={onBack} className="e1-back e3-create-back">
          ← Retour
        </button>
      )}

      <div className="e0-nattukaay-card">
        <h1 className="e0-nattukaay-title">
          {titleName}, crée ton Kondanné
        </h1>

        <ul className="e0-nattukaay-projects" role="list">
          {NATTUKAAY_PROJECTS.map((project) => {
            const isActive = project.slug === selectedSlug;
            return (
              <li key={project.slug}>
                <button
                  type="button"
                  className={`e0-nattukaay-project ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectProject(project.slug)}
                  aria-pressed={isActive}
                >
                  <span className="e0-nattukaay-project-icon" aria-hidden>
                    <Image
                      src={project.icon}
                      alt=""
                      width={216}
                      height={216}
                      sizes="72px"
                      quality={100}
                      unoptimized
                      className="relative z-[1] h-[72px] w-[72px] object-contain"
                    />
                  </span>
                  <span className="e0-nattukaay-project-label">{project.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="e0-nattukaay-field">
          <label htmlFor="e3-kondanne-name" className="e0-nattukaay-label">
            Nom du Kondanné
          </label>
          <input
            id="e3-kondanne-name"
            type="text"
            maxLength={NATTUKAAY_NAME_MAX}
            value={kondanneName}
            onChange={(e) => setKondanneName(e.target.value.slice(0, NATTUKAAY_NAME_MAX))}
            placeholder="Ex. Voyage, Voiture..."
            className="e0-nattukaay-input e0-nattukaay-input--name"
            autoComplete="off"
            name="kondanne-custom-name"
          />
          <p className="e0-nattukaay-hint">
            {kondanneName.length} / {NATTUKAAY_NAME_MAX} caractères
          </p>
        </div>

        <div className="e0-nattukaay-controls">
          <div className="e0-nattukaay-field">
            <label htmlFor="e3-mensualite" className="e0-nattukaay-label">
              Montant mensuel
            </label>
            <input
              id="e3-mensualite"
              type="text"
              inputMode="numeric"
              value={amountDraft}
              onChange={(e) => {
                const next = parseAmountInput(e.target.value);
                setAmountDraft(formatAmountInput(next || 0));
                if (next >= NATTUKAAY_AMOUNT_MIN && next <= NATTUKAAY_AMOUNT_MAX) {
                  setMensualite(
                    Math.round(next / NATTUKAAY_AMOUNT_STEP) * NATTUKAAY_AMOUNT_STEP,
                  );
                }
              }}
              onBlur={() => {
                const clamped = Math.min(
                  NATTUKAAY_AMOUNT_MAX,
                  Math.max(NATTUKAAY_AMOUNT_MIN, mensualite || NATTUKAAY_AMOUNT_MIN),
                );
                const stepped =
                  Math.round(clamped / NATTUKAAY_AMOUNT_STEP) * NATTUKAAY_AMOUNT_STEP;
                setMensualite(stepped);
                setAmountDraft(formatAmountInput(stepped));
              }}
              className="e0-nattukaay-input"
              aria-describedby="e3-mensualite-range"
            />
            <input
              id="e3-mensualite-range"
              type="range"
              min={NATTUKAAY_AMOUNT_MIN}
              max={NATTUKAAY_AMOUNT_MAX}
              step={NATTUKAAY_AMOUNT_STEP}
              value={mensualite}
              onChange={(e) => setMensualite(Number(e.target.value))}
              className="e0-nattukaay-slider"
              style={{
                background: `linear-gradient(to right, var(--sama-forest) 0%, var(--sama-forest) ${amountFill}%, #e8ebe3 ${amountFill}%, #e8ebe3 100%)`,
              }}
            />
            <div className="e0-nattukaay-slider-labels">
              <span>Montant</span>
              <span>2 000 000 FCFA</span>
            </div>
          </div>

          <div className="e0-nattukaay-field">
            <label htmlFor="e3-duree" className="e0-nattukaay-label">
              Durée d&apos;épargne
            </label>
            <input
              id="e3-duree"
              type="number"
              min={NATTUKAAY_DUREE_MIN}
              max={NATTUKAAY_DUREE_MAX}
              step={1}
              value={duree}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (!Number.isNaN(next)) {
                  setDuree(
                    Math.min(NATTUKAAY_DUREE_MAX, Math.max(NATTUKAAY_DUREE_MIN, next)),
                  );
                }
              }}
              className="e0-nattukaay-input"
              aria-describedby="e3-duree-range"
            />
            <input
              id="e3-duree-range"
              type="range"
              min={NATTUKAAY_DUREE_MIN}
              max={NATTUKAAY_DUREE_MAX}
              step={1}
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
              className="e0-nattukaay-slider"
              style={{
                background: `linear-gradient(to right, var(--sama-forest) 0%, var(--sama-forest) ${dureeFill}%, #e8ebe3 ${dureeFill}%, #e8ebe3 100%)`,
              }}
            />
            <div className="e0-nattukaay-slider-labels">
              <span>Durée</span>
              <span>20 ans</span>
            </div>
          </div>
        </div>

        <div className="e0-nattukaay-rate" role="status">
          <span>
            Rendement escompté* :{' '}
            <strong>{taux.toFixed(1).replace('.', ',')}% / an</strong>
          </span>
        </div>

        <div className="e0-nattukaay-results">
          <div className="e0-nattukaay-result e0-nattukaay-result--primary">
            <p className="e0-nattukaay-result-label">Montant escompté*</p>
            <p className="e0-nattukaay-result-value">
              {formatResultAmount(capitalFinal)}
            </p>
          </div>
          <div className="e0-nattukaay-result">
            <p className="e0-nattukaay-result-label">Total versé</p>
            <p className="e0-nattukaay-result-value e0-nattukaay-result-value--sm">
              {formatResultAmount(totalVerse)}
            </p>
          </div>
          <div className="e0-nattukaay-result">
            <p className="e0-nattukaay-result-label">Total versement</p>
            <p className="e0-nattukaay-result-value e0-nattukaay-result-value--sm">
              {formatResultAmount(interets)}
            </p>
          </div>
        </div>

        <RiskDisclaimer variant="simulator" className="mt-6 text-center text-xs" />

        {error && <p className="e1-error mt-3">{error}</p>}
      </div>

      <button
        type="button"
        className="e0-nattukaay-cta"
        onClick={() => void handleCreate()}
        disabled={loading || !canSubmit}
      >
        {loading ? 'Création…' : 'Je crée mon Kondanné'}
      </button>
    </div>
  );
}
