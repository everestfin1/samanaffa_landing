import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Persona } from "../../content/personas";
import { getFormattedRate, project } from "../../lib/rates";

interface PersonaCardProps {
  persona: Persona;
  className?: string;
}

export default function PersonaCard({ persona, className = "" }: PersonaCardProps) {
  const projectedAmount = project(persona.defaults.amount, persona.defaults.months);
  const totalInterest = projectedAmount - persona.defaults.amount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link
      href={`/personas/${persona.slug}`}
      className={`group bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-accent transition-all duration-500 hover:-translate-y-2 ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
            <span className="text-3xl">{persona.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300">
              {persona.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {getFormattedRate(persona.defaults.months)} annuel
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
      </div>

      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        {persona.description}
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
          <div className="text-lg font-bold text-card-foreground group-hover:text-accent-foreground">
            {formatCurrency(persona.defaults.amount)}
          </div>
          <div className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">Mensuel</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
          <div className="text-lg font-bold text-card-foreground group-hover:text-accent-foreground">
            {persona.defaults.months} mois
          </div>
          <div className="text-xs text-muted-foreground group-hover:text-accent-foreground/70">Durée</div>
        </div>
      </div>

      {/* Projected Results */}
      <div className="border-t border-border pt-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-muted-foreground">Projection finale:</span>
          <span className="font-bold text-card-foreground">
            {formatCurrency(projectedAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Intérêts gagnés:</span>
          <span className="font-semibold text-accent">
            +{formatCurrency(totalInterest)}
          </span>
        </div>
      </div>

      {/* Benefits Preview */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {persona.benefits.slice(0, 2).map((benefit, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full font-medium"
            >
              {benefit}
            </span>
          ))}
          {persona.benefits.length > 2 && (
            <span className="inline-block px-3 py-1 text-xs bg-border text-muted-foreground rounded-full font-medium">
              +{persona.benefits.length - 2} autres
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
