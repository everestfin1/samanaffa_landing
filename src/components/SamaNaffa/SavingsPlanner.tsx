import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  calculerCapitalFinal,
  tauxParDuree,
  validateDuree,
  validateMensualite,
} from '@/lib/savings-simulation';
import { personas, objectives } from "../data";
import SavingsSimulatorControls from '@/components/SamaNaffa/SavingsSimulatorControls';
import { RefreshCw } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSelection } from '@/lib/selection-context';
import { getProjectIconScaleClasses, isAutresProject } from '@/lib/project-icon-display';

// --- PROPS ---
interface SavingsPlannerProps {
  redirectTo?: 'register' | 'sama-naffa';
}

export const SavingsPlanner: React.FC<SavingsPlannerProps> = ({ redirectTo = 'register' }) => {
  // --- ROUTER & CONTEXT ---
  const router = useRouter();
  const { setSelectionData } = useSelection();

  // --- STATE MANAGEMENT ---
  const [simulationMode, setSimulationMode] = useState<"objective" | "persona" | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [duree, setDuree] = useState(12);
  const [mensualite, setMensualite] = useState(25000);
  const [taux, setTaux] = useState(tauxParDuree(12));
  
  // Input validation and feedback states
  const [mensualiteError, setMensualiteError] = useState<string | null>(null);
  const [dureeError, setDureeError] = useState<string | null>(null);
  const [mensualiteTouched, setMensualiteTouched] = useState(false);
  const [dureeTouched, setDureeTouched] = useState(false);

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

  const handleMensualiteChange = (value: number) => {
    setMensualite(value);
    setMensualiteError(validateMensualite(value));
  };

  const handleDureeChange = (value: number) => {
    setDuree(value);
    setDureeError(validateDuree(value));
  };

  const handleMensualiteBlur = () => {
    setMensualiteTouched(true);
    setMensualiteError(validateMensualite(mensualite));
  };

  const handleDureeBlur = () => {
    setDureeTouched(true);
    setDureeError(validateDuree(duree));
  };

  const handleStartSaving = () => {
    const objectiveName = (simulationMode === 'objective' && currentObjective?.name) 
        ? currentObjective.name
        : (simulationMode === 'persona' && selectedPersonaData?.name)
            ? selectedPersonaData.name
            : "Plan personnalisé";

    // Store selection data in context and localStorage
    setSelectionData({
      type: 'sama-naffa',
      objective: objectiveName,
      monthlyAmount: mensualite,
      duration: Math.round((duree / 12) * 10) / 10, // in years
      projectedAmount: Math.round(capitalFinal),
      simulationMode: simulationMode!,
      selectedPersona: simulationMode === 'persona' ? selectedPersona : undefined,
      selectedObjective: simulationMode === 'objective' ? selectedObjective || undefined : undefined,
    });

    // Navigate based on the redirectTo prop
    if (redirectTo === 'sama-naffa') {
      router.push('/portal/sama-naffa');
    } else {
      router.push('/onboarding');
    }
  }

  // --- RENDER LOGIC ---

  // Initial choice prompt
  if (!simulationMode) {
    return (
      <section className="text-center pb-12 lg:pb-20 px-4 bg-white">
        <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight mb-4">
          Comment veux-tu commencer ?
        </h2>
        <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
          Choisis un objectif précis ou laisse-nous te guider avec un profil qui te ressemble pour créer ton plan d'épargne.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-8">
          <button
            onClick={() => handleModeSelect("objective")}
            className="group flex-1 max-w-sm px-8 py-6 bg-gradient-to-r from-[#30461f] to-[#435933] hover:from-[#243318] hover:to-[#364529] text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent"
          >
            Choisir un objectif
            <span className="block text-sm font-normal text-white/80 mt-1">Idéal si tu as un but précis en tête.</span>
          </button>
          <button
            onClick={() => handleModeSelect("persona")}
            className="group flex-1 max-w-sm px-8 py-6 bg-[#C38D1C] hover:bg-[#b3830f] text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent"
          >
            Trouver mon profil
             <span className="block text-sm font-normal text-white/80 mt-1">Laisse-nous te suggérer un point de départ.</span>
          </button>
        </div>
      </section>
    );
  }

  // Main planner UI
  return (
    <section id="savings-planner" className="relative w-full px-4 sm:px-6 lg:px-[148px] bg-white overflow-hidden">
      {/* Back to choice button */}
      <div className="text-center mb-6 lg:mb-8">
        <button
          onClick={() => setSimulationMode(null)}
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-[#e8f5e8] text-[#30461f] font-semibold text-xs sm:text-sm shadow hover:bg-[#cbead0] hover:text-[#243318] transition-all duration-200 border border-[#bfe2c2]"
        >
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Changer ma méthode de simulation</span>
          <span className="inline sm:hidden">Changer</span>
        </button>
      </div>

      {/* --- SIMULATOR --- */}
       <div className="flex justify-center mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-4">
            <Card className="w-full max-w-[900px] rounded-xl sm:rounded-2xl lg:rounded-[35px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-3 sm:p-4 lg:p-8">
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        {/* Mode-specific selector */}
                        {simulationMode === 'objective' && (
                            <div className="space-y-3 animate-fade-in flex flex-col items-center justify-center w-full">
                                <p className="text-center text-gray-600 mb-3">Sélectionnez ce qui vous motive le plus à épargner.</p>
                                <div className="w-full flex items-center gap-1 sm:gap-2">
                                    <button
                                        type="button"
                                        aria-label="Précédent"
                                        className="p-1 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                        onClick={() => {
                                            const container = document.getElementById('objectives-scroll');
                                            if (container) container.scrollBy({ left: -120, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#435933]" />
                                    </button>
                                    <div 
                                        id="objectives-scroll"
                                        className="flex items-center py-2 gap-2 sm:gap-3 lg:gap-4 px-1 overflow-x-auto w-full"
                                        style={{ 
                                            scrollbarWidth: 'none', 
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        <style jsx>{`
                                            #objectives-scroll::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}</style>
                                        {objectives.map((objective, index) => (
                                            <div
                                                key={objective.id}
                                                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 flex-shrink-0 w-28 sm:w-32 ${selectedObjective === objective.id
                                                        ? "opacity-100"
                                                        : "opacity-70 hover:opacity-100"
                                                    }`}
                                                onClick={() => handleObjectiveClick(objective.id)}
                                                style={{ animationDelay: `${index * 0.05}s` }}
                                            >
                                                <div
                                                    className={`w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full relative mb-2 transition-all duration-300 group-hover:shadow-lg ${selectedObjective === objective.id
                                                            ? "bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-xl scale-110"
                                                            : "bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#f0f8f0] group-hover:to-[#e8f5e8]"
                                                        }`}
                                                >
                                                    <Image
                                                        width={86}
                                                        height={86}
                                                        className={`absolute w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-300 ${getProjectIconScaleClasses(isAutresProject(objective.slug))}`}
                                                        alt={objective.name}
                                                        src={objective.icon}
                                                    />
                                                    {selectedObjective === objective.id && (
                                                        <div className="absolute inset-0 rounded-full bg-[#435933]/10 animate-subtle-pulse"></div>
                                                    )}
                                                </div>
                                                <span
                                                    className={`font-medium text-xs sm:text-sm lg:text-base transition-all duration-300 text-center ${selectedObjective === objective.id
                                                            ? "text-[#435933] font-bold"
                                                            : "text-gray-800 group-hover:text-[#435933]"
                                                        }`}
                                                >
                                                    {objective.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Suivant"
                                        className="p-1 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                        onClick={() => {
                                            const container = document.getElementById('objectives-scroll');
                                            if (container) container.scrollBy({ left: 120, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#435933]" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Objectif sélectionné avec message personnalisé - Responsive */}
                        <div className="text-center p-3 sm:p-3 lg:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-lg sm:rounded-xl border border-[#435933]/20">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#435933] mb-1 sm:mb-2">
                                {simulationMode === 'persona' && selectedPersonaData 
                                    ? selectedPersonaData.personalizedMessage.split("\n")[0]
                                    : currentObjective?.titre || "Définis ton plan"}
                            </h3>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                               {simulationMode === 'persona' && selectedPersonaData 
                                    ? selectedPersonaData.personalizedMessage.split("\n")[1]
                                    : currentObjective?.description || "Ajuste les curseurs pour simuler ton épargne"}
                            </p>
                        </div>
                        
                        {simulationMode === 'persona' && (
                            <div className="space-y-2 sm:space-y-2 lg:space-y-3">
                                <label className="block text-sm sm:text-base lg:text-lg font-medium text-[#060606] px-1">
                                    Je me reconnais dans ce profil :
                                </label>
                                <div className="w-full flex items-center gap-1 sm:gap-2">
                                    <button
                                        type="button"
                                        aria-label="Précédent"
                                        className="p-1 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                        onClick={() => {
                                            const container = document.getElementById('personas-scroll');
                                            if (container) container.scrollBy({ left: -120, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#435933]" />
                                    </button>
                                    <div 
                                        id="personas-scroll" 
                                        className="flex items-center py-2 gap-2 sm:gap-3 lg:gap-4 px-1 overflow-x-auto w-full"
                                        style={{ 
                                            scrollbarWidth: 'none', 
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        <style jsx>{`
                                            #personas-scroll::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}</style>
                                        {personas.map((persona) => (
                                            <button
                                                key={persona.id}
                                                type="button"
                                                onClick={() => handlePersonaChange(persona.id)}
                                                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${selectedPersona === persona.id ? 'opacity-100' : 'opacity-80'} flex-shrink-0`}
                                                aria-pressed={selectedPersona === persona.id}
                                                style={{ minWidth: '70px', maxWidth: '90px' }}
                                            >
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={persona.icon}
                                                    alt={persona.name}
                                                    className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] rounded-full mb-1 sm:mb-2 lg:mb-3 transition-all duration-300 border border-solid ${selectedPersona === persona.id ? 'bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] border-[#B48310] border-[2px] sm:border-[2.5px]' : 'bg-[#F2F8F4] border-gray-200 border-[1px] group-hover:border-[#C38D1C]/30'}`}
                                                    style={{objectFit: 'contain'}}
                                                />
                                                {(() => {
                                                    let [prenom, qualification] = persona.shortName.split(",");
                                                    // Cas spécial pour 'Profil personnalisé'
                                                    if (persona.id === 'custom') {
                                                        prenom = 'Profil';
                                                        qualification = 'personnalisé';
                                                    }
                                                    return (
                                                        <>
                                                            <span className={`font-medium text-[10px] sm:text-xs lg:text-sm transition-all duration-300 text-center w-full block leading-tight ${selectedPersona === persona.id ? 'text-[#435933] font-bold' : 'text-[#060606] group-hover:text-[#435933]'}`}>
                                                                {prenom}
                                                            </span>
                                                            {qualification && (
                                                                <span className="block text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 text-center w-full mt-0.5 leading-tight">
                                                                    {qualification.trim()}
                                                                </span>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Suivant"
                                        className="p-1 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                        onClick={() => {
                                            const container = document.getElementById('personas-scroll');
                                            if (container) container.scrollBy({ left: 120, behavior: 'smooth' });
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#435933]" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <SavingsSimulatorControls
                            mensualite={mensualite}
                            duree={duree}
                            onMensualiteChange={handleMensualiteChange}
                            onDureeChange={handleDureeChange}
                            mensualiteError={mensualiteTouched ? mensualiteError : null}
                            dureeError={dureeTouched ? dureeError : null}
                            onMensualiteBlur={handleMensualiteBlur}
                            onDureeBlur={handleDureeBlur}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

      {/* Bouton centré - Responsive */}
      <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16 px-4">
          <button
              onClick={handleStartSaving}
              className="group relative px-5 sm:px-6 lg:px-8 h-[48px] sm:h-[52px] lg:h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-lg sm:rounded-xl lg:rounded-2xl text-white text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-md"
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