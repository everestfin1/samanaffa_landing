"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { objectives } from "@/components/data/objectives";
import {
  NATTUKAAY_AMOUNT_MAX,
  NATTUKAAY_AMOUNT_MIN,
  NATTUKAAY_AMOUNT_STEP,
  NATTUKAAY_DUREE_MAX,
  NATTUKAAY_DUREE_MIN,
  NATTUKAAY_PROJECTS,
  type NattukaaySlug,
} from "@/components/data/nattukaay-projects";
import { useSelection } from "@/lib/selection-context";
import {
  calculerCapitalFinal,
  tauxParDuree,
} from "@/lib/savings-simulation";

function formatAmountInput(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function parseAmountInput(raw: string): number {
  const digits = raw.replace(/\s/g, "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function formatResultAmount(amount: number): string {
  return `${formatAmountInput(Math.round(amount))} FCFA`;
}

export default function NattukaaySimulator() {
  const router = useRouter();
  const { setSelectionData } = useSelection();

  const [selectedSlug, setSelectedSlug] = useState<NattukaaySlug>("business");
  const [mensualite, setMensualite] = useState(50_000);
  const [duree, setDuree] = useState(120);
  const [amountDraft, setAmountDraft] = useState(formatAmountInput(50_000));

  const selected = useMemo(
    () => NATTUKAAY_PROJECTS.find((p) => p.slug === selectedSlug) ?? NATTUKAAY_PROJECTS[2],
    [selectedSlug],
  );

  const selectedObjective = useMemo(
    () => objectives.find((o) => o.id === selected.objectiveId),
    [selected],
  );

  useEffect(() => {
    setAmountDraft(formatAmountInput(mensualite));
  }, [mensualite]);

  const taux = tauxParDuree(duree);
  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const totalVerse = mensualite * duree;

  const amountFill =
    ((mensualite - NATTUKAAY_AMOUNT_MIN) / (NATTUKAAY_AMOUNT_MAX - NATTUKAAY_AMOUNT_MIN)) *
    100;
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

  const handleStart = () => {
    const name =
      selected.label || selectedObjective?.name || "Plan personnalisé";

    setSelectionData({
      type: "sama-naffa",
      objective: name,
      monthlyAmount: mensualite,
      duration: Math.round((duree / 12) * 10) / 10,
      projectedAmount: Math.round(capitalFinal),
      simulationMode: "objective",
      selectedObjective: selected.objectiveId,
    });

    router.push("/onboarding");
  };

  return (
    <div className="e0-nattukaay">
      <div className="e0-nattukaay-card">
        <h1 className="e0-nattukaay-title">Mesure ton projet, à ton rythme</h1>

        <ul className="e0-nattukaay-projects" role="list">
          {NATTUKAAY_PROJECTS.map((project) => {
            const isActive = project.slug === selectedSlug;
            return (
              <li key={project.slug}>
                <button
                  type="button"
                  className={`e0-nattukaay-project ${isActive ? "is-active" : ""}`}
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

        <div className="e0-nattukaay-controls">
          <div className="e0-nattukaay-field">
            <label htmlFor="mensualite" className="e0-nattukaay-label">
              Montant mensuel
            </label>
            <input
              id="mensualite"
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
              aria-describedby="mensualite-range"
            />
            <input
              id="mensualite-range"
              type="range"
              min={NATTUKAAY_AMOUNT_MIN}
              max={NATTUKAAY_AMOUNT_MAX}
              step={NATTUKAAY_AMOUNT_STEP}
              value={mensualite}
              onChange={(e) => setMensualite(Number(e.target.value))}
              className="e0-nattukaay-slider"
              style={{
                background: `linear-gradient(to right, #2e4620 0%, #2e4620 ${amountFill}%, #eae7dc ${amountFill}%, #eae7dc 100%)`,
              }}
            />
            <div className="e0-nattukaay-slider-labels">
              <span>Montant</span>
              <span>2 000 000 FCFA</span>
            </div>
          </div>

          <div className="e0-nattukaay-field">
            <label htmlFor="duree" className="e0-nattukaay-label">
              Durée d&apos;épargne
            </label>
            <input
              id="duree"
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
              aria-describedby="duree-range"
            />
            <input
              id="duree-range"
              type="range"
              min={NATTUKAAY_DUREE_MIN}
              max={NATTUKAAY_DUREE_MAX}
              step={1}
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
              className="e0-nattukaay-slider"
              style={{
                background: `linear-gradient(to right, #2e4620 0%, #2e4620 ${dureeFill}%, #eae7dc ${dureeFill}%, #eae7dc 100%)`,
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
            Rendement escompté* :{" "}
            <strong>{taux.toFixed(1).replace(".", ",")}% / an</strong>
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
            <p className="e0-nattukaay-result-value e0-nattukaay-result-value--xs">
              {formatResultAmount(interets)}
            </p>
          </div>
        </div>

      </div>

      <button type="button" className="e0-nattukaay-cta" onClick={handleStart}>
        Je fais mon premier pas
      </button>
    </div>
  );
}
