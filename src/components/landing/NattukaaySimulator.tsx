"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import RiskDisclaimer from "@/components/compliance/RiskDisclaimer";
import { objectives } from "@/components/data/objectives";
import { useSelection } from "@/lib/selection-context";
import {
  calculerCapitalFinal,
  tauxParDuree,
} from "@/lib/savings-simulation";

const NAME_MAX = 30;
const AMOUNT_MIN = 1_000;
const AMOUNT_MAX = 2_000_000;
const AMOUNT_STEP = 1_000;
const DUREE_MIN = 6;
const DUREE_MAX = 240; // 20 ans — matches Nattukaay screenshot

/** Five projects shown on E0 Nattukaay Yéené (Momar chest icons). */
const NATTUKAAY_PROJECTS = [
  {
    slug: "maison",
    label: "Maison",
    objectiveId: 1,
    icon: "/figma/e0/nattukaay/maison.png",
  },
  {
    slug: "etudes",
    label: "Education",
    objectiveId: 2,
    icon: "/figma/e0/nattukaay/education.png",
  },
  {
    slug: "business",
    label: "Business",
    objectiveId: 4,
    icon: "/figma/e0/nattukaay/business.png",
  },
  {
    slug: "voyage",
    label: "Voyage",
    objectiveId: 3,
    icon: "/figma/e0/nattukaay/voyage.png",
  },
  {
    slug: "autres",
    label: "Ton rêve",
    objectiveId: 7,
    icon: "/figma/e0/nattukaay/ton-reve.png",
  },
] as const;

type NattukaaySlug = (typeof NATTUKAAY_PROJECTS)[number]["slug"];

function formatAmountInput(value: number): string {
  // Avoid Intl narrow/no-break spaces — they can differ between Node and browser
  // and cause React hydration mismatches on controlled inputs.
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
  const [kondanneName, setKondanneName] = useState("");
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
    ((mensualite - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100;
  const dureeFill = ((duree - DUREE_MIN) / (DUREE_MAX - DUREE_MIN)) * 100;

  const handleSelectProject = (slug: NattukaaySlug) => {
    const project = NATTUKAAY_PROJECTS.find((p) => p.slug === slug);
    if (!project) return;
    const objective = objectives.find((o) => o.id === project.objectiveId);
    setSelectedSlug(slug);
    if (objective) {
      const nextAmount = Math.min(AMOUNT_MAX, objective.mensualite);
      const nextDuree = Math.min(DUREE_MAX, objective.duree);
      setMensualite(nextAmount);
      setDuree(nextDuree);
    }
  };

  const handleStart = () => {
    const name =
      kondanneName.trim() ||
      selected.label ||
      selectedObjective?.name ||
      "Plan personnalisé";

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
                      width={96}
                      height={96}
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
          <label htmlFor="kondanne-name" className="e0-nattukaay-label">
            Nom du Kondanné
          </label>
          <input
            id="kondanne-name"
            type="text"
            maxLength={NAME_MAX}
            value={kondanneName}
            onChange={(e) => setKondanneName(e.target.value.slice(0, NAME_MAX))}
            placeholder="Ex. Voyage, Voiture..."
            className="e0-nattukaay-input"
            autoComplete="off"
          />
          <p className="e0-nattukaay-hint">
            {kondanneName.length} / {NAME_MAX} caractères
          </p>
        </div>

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
                if (next >= AMOUNT_MIN && next <= AMOUNT_MAX) {
                  setMensualite(Math.round(next / AMOUNT_STEP) * AMOUNT_STEP);
                }
              }}
              onBlur={() => {
                const clamped = Math.min(
                  AMOUNT_MAX,
                  Math.max(AMOUNT_MIN, mensualite || AMOUNT_MIN),
                );
                const stepped = Math.round(clamped / AMOUNT_STEP) * AMOUNT_STEP;
                setMensualite(stepped);
                setAmountDraft(formatAmountInput(stepped));
              }}
              className="e0-nattukaay-input"
              aria-describedby="mensualite-range"
            />
            <input
              id="mensualite-range"
              type="range"
              min={AMOUNT_MIN}
              max={AMOUNT_MAX}
              step={AMOUNT_STEP}
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
            <label htmlFor="duree" className="e0-nattukaay-label">
              Durée d&apos;épargne
            </label>
            <input
              id="duree"
              type="number"
              min={DUREE_MIN}
              max={DUREE_MAX}
              step={1}
              value={duree}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (!Number.isNaN(next)) {
                  setDuree(Math.min(DUREE_MAX, Math.max(DUREE_MIN, next)));
                }
              }}
              className="e0-nattukaay-input"
              aria-describedby="duree-range"
            />
            <input
              id="duree-range"
              type="range"
              min={DUREE_MIN}
              max={DUREE_MAX}
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
            <p className="e0-nattukaay-result-value e0-nattukaay-result-value--sm">
              {formatResultAmount(interets)}
            </p>
          </div>
        </div>

        <RiskDisclaimer variant="simulator" className="mt-4 text-center text-xs" />
      </div>

      <button type="button" className="e0-nattukaay-cta" onClick={handleStart}>
        Je fais mon premier pas
      </button>
    </div>
  );
}
