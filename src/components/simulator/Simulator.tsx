"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { project, getFormattedRate, getRateDescription } from "../../lib/rates";
import Button from "../common/Button";

export default function Simulator() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(12);

  const projectedAmount = project(amount, months);
  const totalInterest = projectedAmount - (amount * months);
  const averageMonthlyInterest = totalInterest / months;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom slider component
  const Slider = ({
    value,
    onChange,
    min,
    max,
    step,
    label,
    formatValue
  }: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    label: string;
    formatValue: (value: number) => string;
  }) => {

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-card-foreground">{label}</label>
          <span className="text-lg font-bold text-accent">{formatValue(value)}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-3 bg-muted rounded-xl appearance-none cursor-pointer slider"
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: var(--primary);
              cursor: pointer;
              border: 3px solid var(--background);
              box-shadow: 0 4px 8px rgba(0,0,0,0.15);
              transition: all 0.2s ease;
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
            .slider::-moz-range-thumb {
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: var(--primary);
              cursor: pointer;
              border: 3px solid var(--background);
              box-shadow: 0 4px 8px rgba(0,0,0,0.15);
              transition: all 0.2s ease;
            }
            .slider::-moz-range-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
          `}</style>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Simulez votre épargne
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez le potentiel de votre épargne avec notre simulateur interactif
          </p>
        </div>

        <div className="bg-card rounded-3xl p-10 shadow-sm border border-border">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Controls */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-8">
                Paramètres de votre épargne
              </h3>

              {/* Amount Slider */}
              <Slider
                value={amount}
                onChange={setAmount}
                min={10000}
                max={500000}
                step={5000}
                label="Versement mensuel"
                formatValue={formatCurrency}
              />

              {/* Duration Slider */}
              <Slider
                value={months}
                onChange={setMonths}
                min={3}
                max={120}
                step={1}
                label="Durée (mois)"
                formatValue={(value) => `${value} mois`}
              />

              {/* Rate Info */}
              <div className="bg-muted rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-background" />
                  </div>
                  <span className="font-semibold text-card-foreground">Taux d&apos;intérêt</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {getFormattedRate(months)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getRateDescription(months)}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-8">
                Projection de votre épargne
              </h3>

              {/* Main Result */}
              <div className="bg-muted rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Montant final projeté</div>
                    <div className="text-3xl font-bold text-card-foreground">
                      {formatCurrency(projectedAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">Total versé</span>
                  </div>
                  <div className="text-xl font-bold text-card-foreground">
                    {formatCurrency(amount * months)}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">Intérêts gagnés</span>
                  </div>
                  <div className="text-xl font-bold text-accent">
                    +{formatCurrency(totalInterest)}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">Intérêts/mois</span>
                  </div>
                  <div className="text-xl font-bold text-card-foreground">
                    {formatCurrency(averageMonthlyInterest)}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">Rendement</span>
                  </div>
                  <div className="text-xl font-bold text-accent">
                    {((totalInterest / (amount * months)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button href="/personas" size="lg" className="w-full">
                  Ouvrir mon Naffa d&apos;épargne
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Ou <Link href="/simulateur" className="text-foreground hover:text-accent transition-colors duration-300 font-medium">continuez à simuler</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
