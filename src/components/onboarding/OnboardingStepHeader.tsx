interface OnboardingStepHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

/** Shared title + subtitle styling (matches T0 project picker). */
export default function OnboardingStepHeader({
  title,
  description,
  className = 'mb-8',
}: OnboardingStepHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-xl md:text-2xl font-bold text-night mb-3">
        {title}
      </p>
      {description ? <p className="text-night/60">{description}</p> : null}
    </div>
  );
}
