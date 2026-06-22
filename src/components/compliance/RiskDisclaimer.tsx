import { RISK_DISCLAIMER_SHORT } from '@/lib/compliance-copy';

interface RiskDisclaimerProps {
  className?: string;
  variant?: 'short' | 'simulator';
}

export default function RiskDisclaimer({
  className = '',
  variant = 'short',
}: RiskDisclaimerProps) {
  const text =
    variant === 'simulator'
      ? 'Simulation indicative à titre d\'objectif de rendement. Résultat non garanti — la valeur peut varier.'
      : RISK_DISCLAIMER_SHORT;

  return (
    <p
      className={`text-xs text-night/60 leading-relaxed ${className}`}
      role="note"
    >
      {text}
    </p>
  );
}
