"use client";

import React, { useState, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface TrancheOption {
  id: string;
  label: string;
  duration: string;
  years: number;
  rate: number;
  multiplier: number;
}

const tranches: TrancheOption[] = [
  { id: "1", label: "Tranche 1", duration: "3ans", years: 3, rate: 6.40, multiplier: 1.192 },
  { id: "2", label: "Tranche 2", duration: "5ans", years: 5, rate: 6.60, multiplier: 1.208 },
  { id: "3", label: "Tranche 3", duration: "7ans", years: 7, rate: 6.75, multiplier: 1.32063 },
  { id: "4", label: "Tranche 4", duration: "10ans", years: 10, rate: 6.95, multiplier: 1.43438 },
];

const formatNumber = (num: number): string => {
  if (!Number.isFinite(num)) return "0";
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Investment constraints aligned with InvestmentModal
const MIN_INVESTMENT = 10000;
const STEP_INVESTMENT = 10000;

export default function InvestmentSimulator() {
  const [selectedTranche, setSelectedTranche] = useState<TrancheOption>(tranches[2]); // Default to Tranche 3
  const [amount, setAmount] = useState<string>("100000");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const results = useMemo(() => {
    const numericAmount = parseFloat(amount || "0");
    const investedAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

    // Calculate using the specific multiplier for each tranche
    // This matches the Excel Maturity values provided by the business
    const totalAtMaturity = investedAmount * selectedTranche.multiplier;
    const interestIncome = totalAtMaturity - investedAmount;

    return {
      investedAmount,
      interestIncome,
      totalAtMaturity,
    };
  }, [amount, selectedTranche]);

  return (
    <section
      className="relative py-16 sm:py-20 overflow-hidden"
      aria-label="Simulateur d'investissement"
    >
      {/* Background image with soft white overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/simulator_bg.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/40" />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="sama-heading-section mb-3">
            Simulez votre investissement
          </h2>
          <p className="sama-text-secondary text-base sm:text-lg">
            Choisissez votre tranche, entrez un montant et obtenez une estimation instantanée
          </p>
        </div>

        {/* Simulator Card */}
        <div className="bg-white/75 rounded-[32px] shadow-[0_28px_80px_rgba(0,0,0,0.10)] border border-white/60 backdrop-blur-xl p-6 sm:p-8">
          {/* Tranche Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Choisissez votre tranche
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                <span className="text-gray-700">
                  {selectedTranche.label} . {selectedTranche.duration} . {selectedTranche.rate.toFixed(2).replace(".", ",")}%
                </span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {tranches.map((tranche) => (
                    <button
                      key={tranche.id}
                      type="button"
                      onClick={() => {
                        setSelectedTranche(tranche);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors ${
                        selectedTranche.id === tranche.id ? "bg-amber-50 text-amber-700" : "text-gray-700"
                      }`}
                    >
                      {tranche.label} . {tranche.duration} . {tranche.rate.toFixed(2).replace(".", ",")}%
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Indiquez le montant*
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Minimum 10 000 FCFA, paliers de 10 000 FCFA (mêmes règles que la souscription).
            </p>
            <div className="relative">
              <input
                type="number"
                min={MIN_INVESTMENT}
                step={STEP_INVESTMENT}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Minimum 10 000 FCFA"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-700"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                FCFA
              </span>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Vos résultats estimés
            </h3>
            <div className="bg-gradient-to-r from-[#30461f] to-[#435933] rounded-2xl p-5 sm:p-6 space-y-4 text-white shadow-inner">
              {/* Invested Amount */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm sm:text-base">
                  Montant investi
                </span>
                <span className="font-semibold text-lg sm:text-xl">
                  {formatNumber(results.investedAmount)} FCFA
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20" />

              {/* Interest Income */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm sm:text-base">
                  Revenus d'intérêts
                </span>
                <span className="font-semibold text-lg sm:text-xl text-emerald-300">
                  {formatNumber(results.interestIncome)} FCFA
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20" />

              {/* Total at Maturity */}
              <div className="flex items-center justify-between">
                <span className="text-white text-sm sm:text-base">
                  Montant total à l'échéance
                </span>
                <span className="font-bold text-xl sm:text-2xl text-sama-accent-gold">
                  {formatNumber(results.totalAtMaturity)} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}