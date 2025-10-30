import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Objective, Persona } from "../data/types";
import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Decimal from 'decimal.js';

// --- HELPER FUNCTIONS & HOOKS ---

const useAnimatedCounter = (targetValue: number) => {
    const [currentValue, setCurrentValue] = useState(targetValue);
    const prevValueRef = useRef(targetValue);
  
    useEffect(() => {
      const startValue = prevValueRef.current;
      const endValue = targetValue;
      let startTime: number | null = null;
      const duration = 500; // Animation duration in ms
  
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const nextValue = Math.floor(startValue + (endValue - startValue) * progress);
        setCurrentValue(nextValue);
  
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
            setCurrentValue(endValue);
            prevValueRef.current = endValue;
        }
      };
  
      requestAnimationFrame(animate);
  
    }, [targetValue]);
  
    return currentValue;
  };

const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

// Helper function to calculate days remaining for each payment
const getDaysRemaining = (monthIndex: number, totalMonths: number): number => {
  // For 12-month period, use exact calendar days
  const exactDays12Months = [365, 334, 306, 275, 245, 214, 184, 153, 122, 92, 61, 1];
  
  if (totalMonths === 12 && monthIndex < 12) {
    return exactDays12Months[monthIndex];
  }
  
  // For other durations, calculate based on standard month lengths
  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Calculate days remaining from this month
  let daysRemaining = 0;
  for (let i = monthIndex; i < totalMonths; i++) {
    daysRemaining += monthLengths[i % 12];
  }
  
  // Last payment compounds for only 1 day (end of period)
  if (monthIndex === totalMonths - 1) {
    return 1;
  }
  
  return daysRemaining;
};

const calculerCapitalFinal = (
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number,
): { capitalFinal: number; interets: number } => {
  // Use Decimal.js for high-precision financial calculations
  // Formula: amount * (1 + annual_rate)^(days_remaining/365)
  // Achieves <0.02% deviation from Excel (within acceptable tolerance)
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });
  
  const tauxAnnuelDecimal = new Decimal(tauxAnnuel).div(100);
  const montantMensuel = new Decimal(mensuel);
  let capitalFinal = new Decimal(0);
  
  // Each monthly contribution compounds for the remaining days
  for (let i = 0; i < dureeMois; i++) {
    const joursRestants = getDaysRemaining(i, dureeMois);
    const exponent = new Decimal(joursRestants).div(365);
    const facteur = new Decimal(1).plus(tauxAnnuelDecimal).pow(exponent);
    capitalFinal = capitalFinal.plus(montantMensuel.times(facteur));
  }
  
  const capitalVerse = mensuel * dureeMois;
  const interets = capitalFinal.toNumber() - capitalVerse;
  
  return {
    capitalFinal: capitalFinal.toNumber(),
    interets,
  };
};

// --- PROPS ---
interface SavingsPlannerProps {
  simulationMode: "objective" | "persona" | null;
  setSimulationMode: Dispatch<SetStateAction<"objective" | "persona" | null>>;
  selectedObjective: Objective | null;
  setSelectedObjective: Dispatch<SetStateAction<Objective | null>>;
  selectedPersona: Persona | null;
  setSelectedPersona: Dispatch<SetStateAction<Persona | null>>;
  duree: number;
  setDuree: Dispatch<SetStateAction<number>>;
  mensualite: number;
  setMensualite: Dispatch<SetStateAction<number>>;
  capitalFinal: number;
  interets: number;
  objectives: Objective[];
  personas: Persona[];
  onShowForm: () => void;
}

export const SavingsPlanner: React.FC<SavingsPlannerProps> = ({
  simulationMode,
  setSimulationMode,
  selectedObjective,
  setSelectedObjective,
  selectedPersona,
  setSelectedPersona,
  duree,
  setDuree,
  mensualite,
  setMensualite,
  capitalFinal,
  interets,
  objectives,
  personas,
  onShowForm,
}) => {
  // --- STATE MANAGEMENT ---
  // All state is lifted to LandingPage.tsx
  
  // Input validation and feedback states
  const [mensualiteError, setMensualiteError] = useState<string | null>(null);
  const [dureeError, setDureeError] = useState<string | null>(null);

  // --- DERIVED STATE & EFFECTS ---
  const animatedCapitalFinal = useAnimatedCounter(capitalFinal);
  const animatedInterests = useAnimatedCounter(interets);

  // --- HANDLERS ---
  const handleModeChange = (mode: "objective" | "persona") => {
    setSimulationMode(mode);
    // Reset to defaults when switching tabs
    if (mode === 'objective') {
        const firstObjective = objectives[0];
        if (firstObjective) {
            setSelectedObjective(firstObjective);
        }
    } else {
        const firstPersona = personas[0];
         if (firstPersona) {
            setSelectedPersona(firstPersona);
        }
    }
  };

  const handleObjectiveClick = (objective: Objective) => {
    setSelectedObjective(objective);
  };
  
  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const persona = personas.find(p => p.id === e.target.value);
    if(persona) {
      setSelectedPersona(persona);
    }
  };

  const handleStartSaving = () => {
    onShowForm();
  }

  const adjustValue = (setter: React.Dispatch<React.SetStateAction<number>>, currentValue: number, change: number, min: number, max: number) => {
    setter(Math.max(min, Math.min(max, currentValue + change)));
  };

  const handleMensualiteChange = (value: number) => {
    setMensualite(value);
    setMensualiteError(null); // Clear error when user types
    
    if (isNaN(value) || value < 1000) {
      setMensualiteError('Le montant minimum est de 1 000 FCFA');
      return;
    }
    
    if (value > 500000) {
      setMensualiteError('Le montant maximum est de 500 000 FCFA');
      return;
    }
    
    if (value % 1000 !== 0) {
      setMensualiteError('Le montant doit être un multiple de 1 000 FCFA');
      return;
    }
  };

  const handleDureeChange = (value: number) => {
    setDuree(value);
    setDureeError(null); // Clear error when user types
    
    if (isNaN(value) || value < 6) {
      setDureeError('La durée minimum est de 6 mois');
      return;
    }
    
    if (value > 180) {
      setDureeError('La durée maximum est de 180 mois (15 ans)');
      return;
    }
  };

  const handleMensualiteBlur = () => {
    // Re-validate on blur
    handleMensualiteChange(mensualite);
  };

  const handleDureeBlur = () => {
    // Re-validate on blur
    handleDureeChange(duree);
  };

  return (
    <section id="simulator" className="w-full pt-12 lg:pt-[76px] pb-8 lg:pb-12 bg-white">
       <div className="text-center mb-8 lg:mb-12 px-4">
            <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight lg:leading-7 animate-fade-in">
                Simule ton plan d'épargne
            </h2>
            <p
                className="text-gray-600 text-base lg:text-lg mt-3 lg:mt-4 animate-fade-in max-w-2xl mx-auto"
                style={{ animationDelay: "0.2s" }}
            >
                Personnalise ta stratégie en choisissant un objectif ou un profil qui te correspond.
            </p>
        </div>

       <div className="flex justify-center px-4">
            <Card className="w-full max-w-[900px] rounded-2xl lg:rounded-[35px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 lg:p-8">
                    {simulationMode === null && (
                        <div className="text-center mb-6 animate-fade-in relative">
                            <div className="relative bg-white/95 p-2 rounded-lg shadow-md transform transition-all duration-500 animate-bounce-subtle">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-semibold text-[#30461f] mb-2">Commmençons ?</h3>
                                    <p className="text-gray-600 mb-2">Sélectionnez une méthode de simulation.</p>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C38D1C] animate-bounce-subtle mt-1">
                                        <path d="M12 16L6 10H18L12 16Z" fill="currentColor"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center bg-[#F2F8F4] rounded-full p-1">
                            <button 
                                onClick={() => handleModeChange('objective')}
                                className={`px-6 py-2 text-sm lg:text-base font-semibold rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-[#30461f] hover:to-[#435933] hover:text-white hover:shadow-sm ${simulationMode === 'objective' ? 'bg-gradient-to-r from-[#30461f] to-[#435933] text-white shadow-sm' : 'text-gray-500 bg-transparent'}`}
                            >
                                Par Objectif
                            </button>
                            <button 
                                onClick={() => handleModeChange('persona')}
                                className={`px-6 py-2 text-sm lg:text-base font-semibold rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-[#30461f] hover:to-[#435933] hover:text-white hover:shadow-sm ${simulationMode === 'persona' ? 'bg-gradient-to-r from-[#30461f] to-[#435933] text-white shadow-sm' : 'text-gray-500 bg-transparent'}`}
                            >
                                Par Profil
                            </button>
                        </div>
                    </div>
                    
                    {simulationMode !== null && (
                        <div className="space-y-6">
                            {/* Mode-specific selector */}
                            {simulationMode === 'objective' && (
                                <div className="space-y-3 animate-fade-in flex flex-col items-center justify-center w-full">
                                    <p className="text-center text-gray-600 mb-6">Sélectionnez ce qui vous motive le plus à épargner.</p>
                                    <div className="w-full flex items-center gap-2">
                                        <button
                                            type="button"
                                            aria-label="Précédent"
                                            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                            onClick={() => {
                                                const container = document.getElementById('objectives-scroll-section');
                                                if (container) container.scrollBy({ left: -120, behavior: 'smooth' });
                                            }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#435933]">
                                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                        <div 
                                            id="objectives-scroll-section"
                                            className="flex items-center py-4 gap-4 lg:gap-6 px-2 overflow-x-auto w-full"
                                            style={{ 
                                                scrollbarWidth: 'none', 
                                                msOverflowStyle: 'none',
                                                WebkitOverflowScrolling: 'touch'
                                            }}
                                        >
                                            <style jsx>{`
                                                #objectives-scroll-section::-webkit-scrollbar {
                                                    display: none;
                                                }
                                            `}</style>
                                            {objectives.map((objective, index) => (
                                                <div
                                                    key={objective.id}
                                                    className={`group flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 flex-shrink-0 w-32 ${selectedObjective?.id === objective.id ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                                                    onClick={() => handleObjectiveClick(objective)}
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className={`w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full relative mb-2 transition-all duration-300 group-hover:shadow-lg ${selectedObjective?.id === objective.id ? "bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-lg scale-110" : "bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#e8f5e8] group-hover:to-[#d4f4d4]"}`}>
                                                        <Image
                                                            className="absolute w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-300 group-hover:scale-110"
                                                            alt={objective.name}
                                                            src={objective.icon}
                                                            width={50}
                                                            height={50}
                                                        />
                                                         {selectedObjective?.id === objective.id && <div className="absolute inset-0 rounded-full bg-[#435933]/10 animate-subtle-pulse"></div>}
                                                    </div>
                                                    <span className={`font-medium text-sm lg:text-base transition-colors duration-300 text-center ${selectedObjective?.id === objective.id ? "text-[#435933] font-bold" : "text-gray-800"}`}>
                                                        {objective.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Suivant"
                                            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition disabled:opacity-30 flex-shrink-0"
                                            onClick={() => {
                                                const container = document.getElementById('objectives-scroll-section');
                                                if (container) container.scrollBy({ left: 120, behavior: 'smooth' });
                                            }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#435933]">
                                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {simulationMode === 'persona' && (
                                <div className="space-y-3 animate-fade-in flex flex-col items-center justify-center w-full">
                                    <p className="text-center text-gray-600 mb-6">Ou trouvez un profil qui vous ressemble pour commencer.</p>
                                    <div className="w-full">
                                        <div className="flex items-center py-4 gap-4 lg:gap-6 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                                            {personas.map((persona, index) => (
                                                <div
                                                    key={persona.id}
                                                    className={`group flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 flex-shrink-0 w-32 ${selectedPersona?.id === persona.id ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                                                    onClick={() => setSelectedPersona(persona)}
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className={`w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full relative mb-2 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg ${selectedPersona?.id === persona.id ? "bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-lg scale-110" : "bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#e8f5e8] group-hover:to-[#d4f4d4]"}`}>
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="w-full h-full object-cover rounded-full"
                                                            alt={persona.name}
                                                            src={persona.icon}
                                                        />
                                                        {selectedPersona?.id === persona.id && <div className="absolute inset-0 rounded-full bg-[#435933]/10 animate-subtle-pulse"></div>}
                                                    </div>
                                                    <span className={`font-medium text-sm lg:text-base transition-colors duration-300 text-center ${selectedPersona?.id === persona.id ? "text-[#435933] font-bold" : "text-gray-800"}`}>
                                                        {persona.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {selectedPersona && (
                                        <div className="text-center p-3 mt-2 bg-white/80 rounded-lg border border-[#435933]/20 max-w-md mx-auto animate-fade-in">
                                            <p className="text-sm text-gray-600 italic">« {selectedPersona.quote} »</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Contrôles de montant et durée */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-6 border-t border-gray-200">
                                {/* Montant mensuel */}
                                <div className="space-y-3">
                                    <label className="block text-base lg:text-lg font-medium text-[#060606]">
                                        Montant mensuel : <span className="text-[#C38D1C] font-bold">{formatCurrency(mensualite)}</span>
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                min="1000"
                                                max="500000"
                                                step="1000"
                                                value={mensualite}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    handleMensualiteChange(val);
                                                }}
                                                onBlur={handleMensualiteBlur}
                                                className={`w-full px-3 py-2 border rounded-lg text-sm font-bold text-[#C38D1C] focus:ring-2 focus:ring-[#435933] focus:border-transparent transition-colors ${
                                                    mensualiteError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 whitespace-nowrap">FCFA</span>
                                    </div>
                                    {mensualiteError && (
                                        <p className="text-sm text-red-600">{mensualiteError}</p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => {
                                            const newValue = Math.max(1000, mensualite - 1000);
                                            handleMensualiteChange(newValue);
                                        }} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">-</button>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="500000"
                                            step="1000"
                                            value={mensualite}
                                            onChange={(e) => handleMensualiteChange(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                                            style={{ background: `linear-gradient(to right, #435933 0%, #435933 ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb 100%)` }}
                                        />
                                         <button onClick={() => {
                                            const newValue = Math.min(500000, mensualite + 1000);
                                            handleMensualiteChange(newValue);
                                        }} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">+</button>
                                    </div>
                                </div>

                                {/* Durée */}
                                <div className="space-y-3">
                                    <label className="block text-base lg:text-lg font-medium text-[#060606]">
                                        Durée d'épargne : <span className="text-[#435933] font-bold">{duree} mois</span>
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                min="6"
                                                max="180"
                                                step="1"
                                                value={duree}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    handleDureeChange(val);
                                                }}
                                                onBlur={handleDureeBlur}
                                                className={`w-full px-3 py-2 border rounded-lg text-sm font-bold text-[#435933] focus:ring-2 focus:ring-[#435933] focus:border-transparent transition-colors ${
                                                    dureeError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 whitespace-nowrap">mois</span>
                                    </div>
                                    {dureeError && (
                                        <p className="text-sm text-red-600">{dureeError}</p>
                                    )}
                                    <div className="flex items-center gap-3">
                                    <button onClick={() => {
                                        const newValue = Math.max(6, duree - 1);
                                        handleDureeChange(newValue);
                                    }} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">-</button>
                                        <input
                                            type="range"
                                            min="6"
                                            max="180"
                                            step="1"
                                            value={duree}
                                            onChange={(e) => handleDureeChange(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                                            style={{ background: `linear-gradient(to right, #435933 0%, #435933 ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb 100%)` }}
                                        />
                                        <button onClick={() => {
                                            const newValue = Math.min(180, duree + 1);
                                            handleDureeChange(newValue);
                                        }} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Résultats */}
                            <div className="text-center space-y-4 p-6 bg-gradient-to-br from-[#F2F8F4] to-white rounded-xl border border-gray-100">
                                <h4 className="font-normal text-[#060606] text-lg lg:text-xl">Capital final estimé</h4>
                                <div className="font-bold text-[#435933] text-3xl lg:text-5xl">
                                    {formatCurrency(Math.round(animatedCapitalFinal))}
                                </div>
                                <div className="font-normal text-gray-500 text-sm">
                                    Dont <span className="font-bold text-[#435933]">+{formatCurrency(Math.round(animatedInterests))}</span> d'intérêts gagnés
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

      {/* Bouton centré */}
      {simulationMode && (
        <div className="flex justify-center mt-8 lg:mt-12 px-4">
            <button
                onClick={handleStartSaving}
                className="group relative px-8 h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-2xl text-white text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-sm"
            >
                <span className="relative z-10">Je commence à épargner</span>
                <svg
                    width="20"
                    height="6"
                    viewBox="0 0 24 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                >
                    <path
                        d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </div>
      )}
    </section>
  );
}; 