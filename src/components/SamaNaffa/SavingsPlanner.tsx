import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "../../lib/utils";
import { personas, objectives } from "../data";
import Image from "next/image";

// --- HELPER FUNCTIONS ---
const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

const calculerCapitalFinal = (
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number,
): { capitalFinal: number; interets: number } => {
  const dureeAnnee = dureeMois / 12;
  const capitalVerse = mensuel * dureeMois;
  const interets = capitalVerse * (tauxAnnuel / 100) * dureeAnnee;
  return {
    capitalFinal: capitalVerse + interets,
    interets,
  };
};

// --- PROPS ---
interface FormSubmissionData {
    objective: string;
    monthlyAmount: number;
    duration: number;
    projectedAmount: number;
    simulationMode: 'objective' | 'persona';
    selectedPersona?: string;
    selectedObjective?: number;
}
interface SavingsPlannerProps {
  onShowForm: (data: FormSubmissionData) => void;
}

export const SavingsPlanner: React.FC<SavingsPlannerProps> = ({
  onShowForm,
}) => {
  // --- STATE MANAGEMENT ---
  const [simulationMode, setSimulationMode] = useState<"objective" | "persona" | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [duree, setDuree] = useState(12);
  const [mensualite, setMensualite] = useState(25000);
  const [taux, setTaux] = useState(tauxParDuree(12));

  // --- DERIVED STATE & EFFECTS ---
  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const currentObjective = objectives.find((obj) => obj.id === selectedObjective) || null;
  const selectedPersonaData = personas.find((p) => p.id === selectedPersona) || null;

  useEffect(() => {
    setTaux(tauxParDuree(duree));
  }, [duree]);

  // Update simulator when objective changes
  useEffect(() => {
    if (simulationMode === 'objective' && currentObjective) {
      setDuree(currentObjective.duree);
      setMensualite(currentObjective.mensualite);
    }
  }, [selectedObjective, simulationMode, currentObjective]);

  // Update simulator when persona changes
  useEffect(() => {
    if (simulationMode === 'persona' && selectedPersonaData) {
      setDuree(selectedPersonaData.duration);
      setMensualite(selectedPersonaData.amount);
    }
  }, [selectedPersona, simulationMode, selectedPersonaData]);


  // --- HANDLERS ---
  const handleModeSelect = (mode: "objective" | "persona") => {
    setSimulationMode(mode);
    setSelectedObjective(null);
    setSelectedPersona("");
    if (mode === 'objective') {
        const firstObjective = objectives[0];
        if(firstObjective) {
            setSelectedObjective(firstObjective.id);
        }
    }
  };

  const handleObjectiveClick = (objectiveId: number) => {
    setSelectedObjective(objectiveId);
  };
  
  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleStartSaving = () => {
    const objectiveName = (simulationMode === 'objective' && currentObjective?.name) 
        ? currentObjective.name
        : (simulationMode === 'persona' && selectedPersonaData?.name)
            ? selectedPersonaData.name
            : "Plan personnalisé";

    onShowForm({
        objective: objectiveName,
        monthlyAmount: mensualite,
        duration: Math.round((duree / 12) * 10) / 10, // in years
        projectedAmount: Math.round(capitalFinal),
        simulationMode: simulationMode || 'objective',
        selectedPersona: selectedPersona || undefined,
        selectedObjective: selectedObjective || undefined,
    });
  }

  // --- RENDER LOGIC ---

  // Initial choice prompt
  if (!simulationMode) {
    return (
      <section className="text-center py-12 lg:py-20 px-4 rounded-2xl p-8 bg-[#435933]/10">
        <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight mb-4">
          Comment veux-tu commencer ?
        </h2>
        <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
          Choisis un objectif précis ou laisse-nous te guider avec un profil qui te ressemble pour créer ton plan d'épargne.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-8">
          <button
            onClick={() => handleModeSelect("objective")}
            className="group flex-1 max-w-sm px-8 py-6 bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] rounded-2xl text-[#435933] font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-[#435933]/50"
          >
            Choisir un objectif
            <span className="block text-sm font-normal text-gray-600 mt-1">Idéal si tu as un but précis en tête.</span>
          </button>
          <button
            onClick={() => handleModeSelect("persona")}
            className="group flex-1 max-w-sm px-8 py-6 bg-white rounded-2xl text-[#01081b] font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-[#435933]/50"
          >
            Trouver mon profil
             <span className="block text-sm font-normal text-gray-600 mt-1">Laisse-nous te suggérer un point de départ.</span>
          </button>
        </div>
      </section>
    );
  }

  // Main planner UI
  return (
    <section id="savings-planner" className="relative w-full pt-12 lg:pt-[76px] px-4 lg:px-[148px] rounded-2xl p-8 bg-white mb-16">
      {/* Back to choice button */}
      <div className="text-center mb-8">
        <button onClick={() => setSimulationMode(null)} className="text-sm text-gray-600 hover:text-[#435933] underline">
            Changer ma méthode de simulation
        </button>
      </div>

      {/* Mode-specific selector */}
      {simulationMode === 'objective' && (
        <>
            <div className="text-center mb-8 lg:mb-12 flex flex-col items-center justify-center">
                <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight lg:leading-7 animate-fade-in">
                    Choisis ton objectif
                </h2>
                <p
                    className="text-gray-600 text-base lg:text-lg mt-3 lg:mt-4 animate-fade-in px-4"
                    style={{ animationDelay: "0.2s" }}
                >
                    Sélectionnez ce qui vous motive le plus à épargner
                </p>
            </div>
            <div className="flex justify-center mb-12 lg:mb-16">
                <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-8 max-w-4xl">
                    {objectives.map((objective, index) => (
                        <div
                            key={objective.id}
                            className={`group flex flex-col items-center cursor-pointer transition-all duration-500 hover:scale-105 ${selectedObjective === objective.id
                                    ? "opacity-100"
                                    : "opacity-70 hover:opacity-90"
                                }`}
                            onClick={() => handleObjectiveClick(objective.id)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`w-[120px] h-[120px] lg:w-[162px] lg:h-[162px] rounded-full relative mb-3 lg:mb-4 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2 ${selectedObjective === objective.id
                                        ? "bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-xl scale-110"
                                        : "bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#f0f8f0] group-hover:to-[#e8f5e8]"
                                    }`}
                            >
                                <Image
                                    className="absolute w-[64px] h-[64px] lg:w-[86px] lg:h-[86px] top-[28px] lg:top-[38px] left-[28px] lg:left-[38px] object-cover transition-transform duration-500 group-hover:scale-110"
                                    alt={objective.name}
                                    src={objective.icon}
                                    width={86}
                                    height={86}
                                />
                                {selectedObjective === objective.id && (
                                    <div className="absolute inset-0 rounded-full bg-[#435933]/10 animate-subtle-pulse"></div>
                                )}
                            </div>
                            <span
                                className={`font-medium text-lg lg:text-[26px] transition-all duration-300 text-center mb-1 lg:mb-2 ${selectedObjective === objective.id
                                        ? "text-[#435933] font-bold"
                                        : "text-[#060606] group-hover:text-[#435933]"
                                    }`}
                            >
                                {objective.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}

      {/* --- SIMULATOR --- */}
       <div className="flex justify-center mb-8 lg:mb-10 px-4">
            <Card className="w-full max-w-[900px] rounded-2xl lg:rounded-[35px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-4 lg:p-8">
                    <div className="space-y-4 lg:space-y-6">
                        {/* Objectif sélectionné avec message personnalisé - Responsive */}
                        <div className="text-center p-3 lg:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                            <h3 className="text-lg lg:text-xl font-bold text-[#435933] mb-2">
                                {simulationMode === 'persona' && selectedPersonaData 
                                    ? selectedPersonaData.personalizedMessage.split("\n")[0]
                                    : currentObjective?.titre || "Définis ton plan"}
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600 mb-2 lg:mb-4">
                               {simulationMode === 'persona' && selectedPersonaData 
                                    ? selectedPersonaData.personalizedMessage.split("\n")[1]
                                    : currentObjective?.description || "Ajuste les curseurs pour simuler ton épargne"}
                            </p>
                        </div>
                        
                        {simulationMode === 'persona' && (
                            <div className="space-y-2 lg:space-y-3">
                                <label className="block text-base lg:text-lg font-medium text-[#060606]">
                                    Je me reconnais dans ce profil :
                                </label>
                                <select
                                    value={selectedPersona}
                                    onChange={(e) => handlePersonaChange(e.target.value)}
                                    className="w-full p-3 lg:p-4 border-2 border-[#435933]/20 rounded-xl text-sm lg:text-base focus:border-[#435933] focus:outline-none transition-colors bg-[#e9f0e9] text-[#116237]"
                                >
                                    <option value="">
                                        -- Choisissez votre profil --
                                    </option>
                                    {personas.map((persona) => (
                                        <option key={persona.id} value={persona.id}>
                                            {persona.emoji} {persona.shortName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Contrôles de montant et durée - Responsive */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Montant mensuel - Responsive */}
                            <div className="space-y-2 lg:space-y-3">
                                <label className="block text-base lg:text-lg font-medium text-[#060606]">
                                    Montant mensuel d'épargne :{" "}
                                    <span className="text-[#C38D1C] font-bold text-sm lg:text-base">
                                        {formatCurrency(mensualite)}
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="1000"
                                    max="500000"
                                    step="1000"
                                    value={mensualite}
                                    onChange={(e) => setMensualite(Number(e.target.value))}
                                    className="w-full h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #435933 0%, #435933 ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb 100%)`,
                                    }}
                                />
                                <div className="flex justify-between text-xs lg:text-sm text-gray-500">
                                    <span>1 000 FCFA</span>
                                    <span>500 000 FCFA</span>
                                </div>
                            </div>

                            {/* Durée - Responsive */}
                            <div className="space-y-2 lg:space-y-3">
                                <label className="block text-base lg:text-lg font-medium text-[#060606]">
                                    Durée d'épargne :{" "}
                                    <span className="text-[#435933] font-bold text-sm lg:text-base">
                                        {duree} mois
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="6"
                                    max="180"
                                    step="1"
                                    value={duree}
                                    onChange={(e) => setDuree(Number(e.target.value))}
                                    className="w-full h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #435933 0%, #435933 ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb 100%)`,
                                    }}
                                />
                                <div className="flex justify-between text-xs lg:text-sm text-gray-500">
                                    <span>6 mois</span>
                                    <span>180 mois (15 ans)</span>
                                </div>
                            </div>
                        </div>

                        {/* Indicateur de taux - Responsive */}
                        <div className="p-3 lg:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0">
                                <span className="text-[#435933] font-medium text-base lg:text-lg text-center lg:text-left">
                                    Taux d'intérêt :{" "}
                                    <span className="font-bold text-lg lg:text-xl">
                                        {taux.toFixed(1)}%
                                    </span>{" "}
                                    par an
                                </span>
                                <div className="text-xs lg:text-sm text-gray-600">
                                    {duree <= 6 && "💡 Très court terme"}
                                    {duree > 6 && duree <= 12 && "📈 Court terme"}
                                    {duree > 12 && duree <= 36 && "🚀 Moyen terme"}
                                    {duree > 36 && duree <= 60 && "💎 Long terme"}
                                    {duree > 60 && "🏆 Très long terme"}
                                </div>
                            </div>
                        </div>

                        {/* Résultats - Responsive */}
                        <div className="text-center space-y-3 lg:space-y-4 p-4 lg:p-6 bg-gradient-to-br from-[#F2F8F4] to-white rounded-xl">
                            <h4 className="font-normal text-[#060606] text-lg lg:text-[24px] mb-2">
                                Capital final estimé
                            </h4>
                            <div className="font-bold text-[#435933] text-2xl lg:text-[36px] mb-2">
                                {formatCurrency(Math.round(capitalFinal))}
                            </div>
                            <div className="font-normal text-[#969696] text-sm lg:text-base mb-3 lg:mb-4">
                                Plan {Math.round((duree / 12) * 10) / 10} ans - Rendement{" "}
                                {taux.toFixed(1)}% - {formatCurrency(mensualite)}/mois
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-center">
                                    <div className="text-xs lg:text-sm text-gray-600 mb-1">
                                        Total versé
                                    </div>
                                    <div className="font-medium text-[#C38D1C] text-base lg:text-lg">
                                        {formatCurrency(mensualite * duree)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs lg:text-sm text-gray-600 mb-1">
                                        Intérêts gagnés
                                    </div>
                                    <div className="font-bold text-[#435933] text-base lg:text-lg">
                                        +{formatCurrency(Math.round(interets))}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs lg:text-sm text-gray-800 font-medium mb-1">
                                        Total final
                                    </div>
                                    <div className="font-bold text-[#435933] text-lg lg:text-xl">
                                        {formatCurrency(Math.round(capitalFinal))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      {/* Bouton centré - Responsive */}
      <div className="flex justify-center mb-12 lg:mb-16 px-4">
          <button
              onClick={handleStartSaving}
              className="group relative px-6 lg:px-8 h-[50px] lg:h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-sm"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <span className="relative z-10">Je commence à épargner</span>
              <svg
                  width="20"
                  height="6"
                  viewBox="0 0 24 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
              >
                  <path
                      d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                      fill="currentColor"
                  />
              </svg>
          </button>
      </div>
    </section>
  );
};
