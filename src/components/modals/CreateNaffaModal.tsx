'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  XMarkIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { naffaTypes, NaffaType } from '../data/naffaTypes';

const cardStyle = {
  gradient:
    'from-sama-secondary-green-dark via-sama-secondary-green to-sama-primary-green-dark',
  chip: 'bg-white/15 text-white',
};

const getCardStyle = () => cardStyle;

const getNaffaIcon = (naffaId: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'etudes-enfant': AcademicCapIcon,
    business: BriefcaseIcon,
    diaspora: HomeIcon,
    serenite: ShieldCheckIcon,
    communautaire: UserGroupIcon,
    liberte: PaperAirplaneIcon,
    prestige: SparklesIcon,
  };

  return iconMap[naffaId] || BriefcaseIcon;
};

interface CreateNaffaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNaffa: (naffaType: NaffaType) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export default function CreateNaffaModal({
  isOpen,
  onClose,
  onSelectNaffa,
  isSubmitting = false,
  errorMessage = null,
}: CreateNaffaModalProps) {
  const [selectedNaffa, setSelectedNaffa] = useState<NaffaType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidePadding, setSidePadding] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollDetectionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getClampedIndex = useCallback(
    (index: number) => Math.max(0, Math.min(index, naffaTypes.length - 1)),
    [],
  );

  const updateSelection = useCallback(
    (index: number) => {
      const clamped = getClampedIndex(index);
      setCurrentIndex(clamped);
      setSelectedNaffa(naffaTypes[clamped]);
    },
    [getClampedIndex],
  );

  const scrollToCard = useCallback(
    (index: number, smooth = true) => {
      const container = sliderRef.current;
      if (!container) return;

      const clamped = getClampedIndex(index);
      const target = container.children[clamped] as HTMLElement | undefined;
      if (!target) return;

      const offset = target.offsetLeft - (container.offsetWidth - target.offsetWidth) / 2;

      container.scrollTo({
        left: offset,
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [getClampedIndex],
  );

  const goToIndex = useCallback(
    (index: number, smooth = true) => {
      updateSelection(index);
      scrollToCard(index, smooth);
    },
    [scrollToCard, updateSelection],
  );

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return;
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= naffaTypes.length - 1) return;
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const handleScroll = useCallback(() => {
    if (scrollDetectionTimeout.current) {
      clearTimeout(scrollDetectionTimeout.current);
    }

    scrollDetectionTimeout.current = setTimeout(() => {
      const container = sliderRef.current;
      if (!container) return;

      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      const containerCenter = container.scrollLeft + container.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(childCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      updateSelection(closestIndex);
    }, 120);
  }, [updateSelection]);

  const handleSelectNaffa = useCallback(
    (index: number) => {
      goToIndex(index);
    },
    [goToIndex],
  );

  const handleConfirm = () => {
    if (!selectedNaffa || isSubmitting) return;
    onSelectNaffa(selectedNaffa);
    handleClose();
  };

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setSelectedNaffa(null);
    setCurrentIndex(0);
    setSidePadding(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
    onClose();
  }, [onClose, isSubmitting]);

  const computeSidePadding = useCallback(() => {
    const container = sliderRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>('[data-naffa-card]');
    if (!firstCard) return;

    const padding = Math.max(0, (container.offsetWidth - firstCard.offsetWidth) / 2);
    setSidePadding(padding);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollDetectionTimeout.current) {
        clearTimeout(scrollDetectionTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedNaffa(null);
      setCurrentIndex(0);
      setSidePadding(0);
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }
      return;
    }

    const defaultIndex = 0;
    updateSelection(defaultIndex);

    const handleResize = () => computeSidePadding();

    requestAnimationFrame(() => {
      computeSidePadding();
      scrollToCard(defaultIndex, false);
    });

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, computeSidePadding, scrollToCard, updateSelection]);

  useEffect(() => {
    if (!isOpen) return;
    scrollToCard(currentIndex, false);
  }, [sidePadding, currentIndex, isOpen, scrollToCard]);

  if (!isOpen) return null;

  const isAtBeginning = currentIndex === 0;
  const isAtEnd = currentIndex === naffaTypes.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-timberwolf/20 p-6">
          <div>
            <h2 className="text-2xl font-bold text-night">Créer un nouveau Naffa</h2>
            <p className="mt-1 text-night/70">
              Choisissez le type de Naffa qui correspond à vos objectifs
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-night/50 transition-colors hover:bg-timberwolf/10 hover:text-night disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Fermer la fenêtre de sélection"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 pt-6">
          <div className="relative">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isAtBeginning}
              className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-white/80 p-2 shadow-md backdrop-blur-sm transition ${
                isAtBeginning ? 'cursor-not-allowed opacity-40' : 'hover:bg-white'
              }`}
              aria-label="Voir le Naffa précédent"
            >
              <ChevronLeftIcon className="h-5 w-5 text-night" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isAtEnd}
              className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-white/80 p-2 shadow-md backdrop-blur-sm transition ${
                isAtEnd ? 'cursor-not-allowed opacity-40' : 'hover:bg-white'
              }`}
              aria-label="Voir le Naffa suivant"
            >
              <ChevronRightIcon className="h-5 w-5 text-night" />
            </button>

            <div
              ref={sliderRef}
              onScroll={handleScroll}
              style={{ paddingLeft: sidePadding, paddingRight: sidePadding }}
              className="flex gap-6 overflow-x-auto overflow-y-visible py-6 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {naffaTypes.map((naffa, index) => {
                const isSelected = selectedNaffa?.id === naffa.id;
                const { gradient } = getCardStyle();

                const IconComponent = getNaffaIcon(naffa.id);

                return (
                  <button
                    key={naffa.id}
                    type="button"
                    onClick={() => handleSelectNaffa(index)}
                    className="snap-center shrink-0 basis-[260px] focus:outline-none sm:basis-[320px] lg:basis-[360px]"
                    data-naffa-card
                    aria-label={`Sélectionner ${naffa.name}`}
                    disabled={isSubmitting}
                  >
                    <div
                      className={`relative flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br px-6 py-6 text-white shadow-lg transition-all duration-500 ease-out ${gradient} ${
                        isSelected ? 'scale-[1.02] shadow-xl' : 'opacity-80 hover:-translate-y-1 hover:opacity-100'
                      } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full bg-white/20 p-2 backdrop-blur-sm">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{naffa.name}</h3>
                            <p className="text-xs text-white/70">{naffa.persona}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center justify-center rounded-full bg-gold-metallic p-2 text-white">
                            <CheckIcon className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <p className="mb-4 text-sm leading-relaxed text-white/80">{naffa.description}</p>

                      <div className="mt-auto space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Montant</span>
                          <span className="font-medium">{naffa.defaultAmount.toLocaleString()} FCFA/mois</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Durée</span>
                          <span className="font-medium">{naffa.duration} ans</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-2 pb-4">
            {naffaTypes.map((naffa, index) => (
              <button
                key={naffa.id}
                type="button"
                onClick={() => handleSelectNaffa(index)}
                disabled={isSubmitting}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'w-6 bg-gold-metallic' : 'w-2.5 bg-timberwolf/50 hover:bg-timberwolf/80'
                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
                aria-label={`Aller au plan ${naffa.name}`}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-timberwolf/20 bg-timberwolf/5 p-6 space-y-3">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              {selectedNaffa ? (
                <>
                  <p className="text-sm font-semibold text-night">Sélectionné : {selectedNaffa.name}</p>
                  <p className="mt-1 text-xs text-night/60">{selectedNaffa.objective}</p>
                </>
              ) : (
                <p className="text-sm text-night/70">
                  Faites glisser les cartes pour découvrir les différents Naffa.
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-timberwolf/30 px-6 py-2 font-medium text-night transition-colors hover:bg-timberwolf/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedNaffa || isSubmitting}
                className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                  selectedNaffa && !isSubmitting
                    ? 'bg-gold-metallic text-white hover:bg-gold-dark'
                    : 'cursor-not-allowed bg-timberwolf/30 text-night/50'
                }`}
              >
                {isSubmitting ? 'Création...' : 'Créer ce Naffa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
