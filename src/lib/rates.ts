/**
 * Calculate interest rate based on savings duration
 * @param months - Number of months for the savings plan
 * @returns Annual interest rate as decimal (e.g., 0.03 for 3%)
 */
export function rateForMonths(months: number): number {
  if (months < 12) return 0.03;       // 3%
  if (months < 24) return 0.045;      // 4.5%
  if (months < 60) return 0.055;     // 5.5%
  if (months < 120) return 0.065;    // 6.5%
  return 0.07;                       // 7%
}

/**
 * Calculate projected savings amount with compound interest
 * @param principal - Initial amount
 * @param months - Number of months
 * @returns Projected final amount
 */
export function project(principal: number, months: number): number {
  const annualRate = rateForMonths(months); // Annual rate
  const monthlyRate = annualRate / 12;      // Monthly rate

  // Calculate compound interest: A = P(1 + r/n)^(nt)
  // Where: A = final amount, P = principal, r = annual rate, n = 12 (monthly), t = months/12
  return principal * Math.pow(1 + monthlyRate, months);
}

/**
 * Calculate monthly interest earned
 * @param principal - Initial amount
 * @param months - Number of months
 * @returns Monthly interest amount
 */
export function monthlyInterest(principal: number, months: number): number {
  const projected = project(principal, months);
  const totalInterest = projected - principal;
  return totalInterest / months;
}

/**
 * Calculate total interest earned over the period
 * @param principal - Initial amount
 * @param months - Number of months
 * @returns Total interest earned
 */
export function totalInterest(principal: number, months: number): number {
  return project(principal, months) - principal;
}

/**
 * Get formatted rate as percentage string
 * @param months - Number of months
 * @returns Formatted rate (e.g., "3.00%")
 */
export function getFormattedRate(months: number): string {
  const rate = rateForMonths(months);
  return `${(rate * 100).toFixed(2)}%`;
}

/**
 * Get human-readable rate description
 * @param months - Number of months
 * @returns Rate description for UI display
 */
export function getRateDescription(months: number): string {
  const rate = rateForMonths(months);
  const percentage = (rate * 100).toFixed(1);

  if (months < 12) return `${percentage}% - Idéal pour court terme`;
  if (months < 24) return `${percentage}% - Bon équilibre`;
  if (months < 60) return `${percentage}% - Taux optimisé`;
  if (months < 120) return `${percentage}% - Excellent rendement`;
  return `${percentage}% - Rendement maximum`;
}
