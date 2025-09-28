'use client';

import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { naffaTypes, NaffaType } from '../data/naffaTypes';

interface CreateNaffaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNaffa: (naffaType: NaffaType) => void;
}

export default function CreateNaffaModal({ isOpen, onClose, onSelectNaffa }: CreateNaffaModalProps) {
  const [selectedNaffa, setSelectedNaffa] = useState<NaffaType | null>(null);

  const handleSelectNaffa = (naffa: NaffaType) => {
    setSelectedNaffa(naffa);
  };

  const handleConfirm = () => {
    if (selectedNaffa) {
      onSelectNaffa(selectedNaffa);
      setSelectedNaffa(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedNaffa(null);
    onClose();
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getSelectedColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 border-blue-400 text-blue-900',
      green: 'bg-green-100 border-green-400 text-green-900',
      purple: 'bg-purple-100 border-purple-400 text-purple-900',
      gray: 'bg-gray-100 border-gray-400 text-gray-900',
      orange: 'bg-orange-100 border-orange-400 text-orange-900',
      yellow: 'bg-yellow-100 border-yellow-400 text-yellow-900',
      red: 'bg-red-100 border-red-400 text-red-900'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 border-gray-400 text-gray-900';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-timberwolf/20">
          <div>
            <h2 className="text-2xl font-bold text-night">Créer un nouveau Naffa</h2>
            <p className="text-night/70 mt-1">Choisissez le type de Naffa qui correspond à vos objectifs</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-night/50 hover:text-night hover:bg-timberwolf/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {naffaTypes.map((naffa) => (
              <div
                key={naffa.id}
                onClick={() => handleSelectNaffa(naffa)}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedNaffa?.id === naffa.id
                    ? getSelectedColorClasses(naffa.color)
                    : getColorClasses(naffa.color)
                }`}
              >
                {/* Selection indicator */}
                {selectedNaffa?.id === naffa.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gold-metallic rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Icon and title */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="text-3xl">{naffa.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{naffa.name}</h3>
                    <p className="text-sm opacity-80">{naffa.persona}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 opacity-90">{naffa.description}</p>

                {/* Key details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Montant par défaut:</span>
                    <span className="font-semibold">{naffa.defaultAmount.toLocaleString()} FCFA/mois</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Durée:</span>
                    <span className="font-semibold">{naffa.duration} ans</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">Objectif:</span>
                    <span className="font-semibold text-right max-w-[60%]">{naffa.objective}</span>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-sm font-medium italic">"{naffa.message}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-timberwolf/20 bg-timberwolf/5">
          <div className="text-sm text-night/70">
            {selectedNaffa ? `Sélectionné: ${selectedNaffa.name}` : 'Aucun Naffa sélectionné'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-night/70 hover:text-night hover:bg-timberwolf/20 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedNaffa}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedNaffa
                  ? 'bg-gold-metallic text-white hover:bg-gold-dark'
                  : 'bg-timberwolf/30 text-night/50 cursor-not-allowed'
              }`}
            >
              Créer ce Naffa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
