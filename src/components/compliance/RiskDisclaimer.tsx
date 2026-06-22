import { RISK_DISCLAIMER_SHORT, RISK_DISCLAIMER_SIMULATOR } from '@/lib/compliance-copy';

interface RiskDisclaimerProps {
  className?: string;
  variant?: 'short' | 'simulator';
}

export default function RiskDisclaimer({
  className = '',
  variant = 'short',
}: RiskDisclaimerProps) {
  const text =
    variant === 'simulator' ? RISK_DISCLAIMER_SIMULATOR : RISK_DISCLAIMER_SHORT;

  return (
    <p
      className={`text-xs text-night/60 leading-relaxed ${className}`}
      role="note"
    >
      {text}
    </p>
  );
}
