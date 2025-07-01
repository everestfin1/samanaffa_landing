import React, { useEffect } from 'react';

interface ExplainerModalProps {
  show: boolean;
  onClose: () => void;
}

export const ExplainerModal: React.FC<ExplainerModalProps> = ({ show, onClose }) => {
  // Empêcher le scroll de l'arrière-plan lorsque le modal est ouvert
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full relative overflow-hidden animate-fade-in">
        {/* Bouton fermer */}
        <button
          aria-label="Fermer"
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="p-6 pt-12 sm:pt-10 sm:p-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#30461f]">
            Pourquoi épargner dans Sama Naffa&nbsp;?
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-prose mx-auto">
            Sama Naffa simplifie votre parcours d'épargne&nbsp;: définissez votre objectif, choisissez un montant
            mensuel et laissez votre capital fructifier grâce à nos partenaires financiers sécurisés. Suivez vos gains
            en temps réel et atteignez vos projets plus rapidement.
          </p>

          <video
            src="/explainer.mp4"
            className="w-full rounded-lg mt-4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
}; 