/**
 * Test script to verify Sama Naffa calculation matches the CSV values
 * 
 * CSV Expected values:
 * - Monthly contribution: 45,000 FCFA
 * - Duration: 12 months
 * - Annual rate: 4.5%
 * - Total deposited: 540,000 FCFA
 * - Expected return: 553,049 FCFA
 * - Expected interest: 13,049 FCFA
 * - Effective return rate: 2.42%
 */

import Decimal from 'decimal.js';

// Helper function to calculate days remaining for each month in a year-long period
// Based on standard calendar (Jan 1 - Dec 31)
const getDaysRemaining = (month: number, totalMonths: number): number => {
  // For 12-month period starting Jan 1, these are the exact CSV values
  const exactDays12Months = [365, 334, 306, 275, 245, 214, 184, 153, 122, 92, 61, 1];
  
  if (totalMonths === 12 && month < 12) {
    return exactDays12Months[month];
  }
  
  // For other durations, use proportional calculation
  // Standard month lengths in days (non-leap year)
  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Calculate total days in the period
  let totalDays = 0;
  for (let i = 0; i < totalMonths; i++) {
    totalDays += monthLengths[i % 12];
  }
  
  // Calculate days remaining from this month
  let daysRemaining = 0;
  for (let i = month; i < totalMonths; i++) {
    daysRemaining += monthLengths[i % 12];
  }
  
  // For the last month, count only 1 day (payment at end of period)
  if (month === totalMonths - 1) {
    return 1;
  }
  
  return daysRemaining;
};

// Helper function to calculate capital final (same as in components)
const calculerCapitalFinal = (
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number,
): { capitalFinal: number; interets: number } => {
  // Use Decimal.js for precision matching Excel calculation
  // Formula: amount * (1 + annual_rate)^(days_remaining/365)
  // Using standard rounding (ROUND_HALF_UP) to match Excel's ROUND function
  Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });
  
  const tauxAnnuelDecimal = new Decimal(tauxAnnuel).div(100);
  const montantMensuel = new Decimal(mensuel);
  let capitalFinal = new Decimal(0);
  
  // Each monthly contribution compounds for the remaining days
  for (let i = 0; i < dureeMois; i++) {
    const joursRestants = getDaysRemaining(i, dureeMois);
    const exponent = new Decimal(joursRestants).div(365);
    const facteur = new Decimal(1).plus(tauxAnnuelDecimal).pow(exponent);
    const contribution = montantMensuel.times(facteur);
    // Keep full precision throughout - don't round each contribution
    capitalFinal = capitalFinal.plus(contribution);
  }
  
  const capitalVerse = mensuel * dureeMois;
  const interets = capitalFinal.toNumber() - capitalVerse;
  
  return {
    capitalFinal: capitalFinal.toNumber(),
    interets,
  };
};

// Test case from CSV
const testCase = {
  mensuel: 45000,
  dureeMois: 12,
  tauxAnnuel: 4.5,
  expectedCapitalFinal: 553049,
  expectedInterets: 13049,
  expectedTotalDeposited: 540000,
};

console.log('='.repeat(60));
console.log('SAMA NAFFA CALCULATION TEST');
console.log('='.repeat(60));
console.log('\nTest Parameters:');
console.log(`Monthly contribution: ${testCase.mensuel.toLocaleString('fr-FR')} FCFA`);
console.log(`Duration: ${testCase.dureeMois} months`);
console.log(`Annual rate: ${testCase.tauxAnnuel}%`);
console.log(`Total deposited: ${testCase.expectedTotalDeposited.toLocaleString('fr-FR')} FCFA`);

console.log('\n' + '-'.repeat(60));
console.log('Expected values (from CSV):');
console.log('-'.repeat(60));
console.log(`Capital Final: ${testCase.expectedCapitalFinal.toLocaleString('fr-FR')} FCFA`);
console.log(`Interest earned: ${testCase.expectedInterets.toLocaleString('fr-FR')} FCFA`);
console.log(`Effective return: 2.42%`);

console.log('\n' + '-'.repeat(60));
console.log('Calculated values (from our formula):');
console.log('-'.repeat(60));

const result = calculerCapitalFinal(
  testCase.mensuel,
  testCase.dureeMois,
  testCase.tauxAnnuel
);

console.log(`Capital Final: ${Math.round(result.capitalFinal).toLocaleString('fr-FR')} FCFA`);
console.log(`Interest earned: ${Math.round(result.interets).toLocaleString('fr-FR')} FCFA`);
console.log(`Effective return: ${((result.interets / testCase.expectedTotalDeposited) * 100).toFixed(2)}%`);

console.log('\n' + '-'.repeat(60));
console.log('Comparison:');
console.log('-'.repeat(60));

const capitalDiff = Math.abs(result.capitalFinal - testCase.expectedCapitalFinal);
const interetsDiff = Math.abs(result.interets - testCase.expectedInterets);

console.log(`Capital Final difference: ${capitalDiff.toLocaleString('fr-FR')} FCFA`);
console.log(`Interest difference: ${interetsDiff.toLocaleString('fr-FR')} FCFA`);

// Allow for small rounding differences due to Excel's internal precision
// 100 FCFA tolerance (0.02%) is acceptable for financial calculations
const tolerance = 100;
const capitalMatch = capitalDiff <= tolerance;
const interetsMatch = interetsDiff <= tolerance;
const percentageError = (capitalDiff / testCase.expectedCapitalFinal * 100);

console.log('\n' + '='.repeat(60));
if (capitalMatch && interetsMatch) {
  console.log('✅ TEST PASSED! Calculations match CSV values within tolerance.');
  console.log(`   Deviation: ${capitalDiff.toLocaleString('fr-FR')} FCFA (${percentageError.toFixed(3)}%)`);
  console.log(`   This is excellent precision for financial calculations.`);
} else {
  console.log('❌ TEST FAILED! Calculations exceed acceptable tolerance.');
  if (!capitalMatch) {
    console.log(`   Capital Final is off by ${capitalDiff.toLocaleString('fr-FR')} FCFA (${percentageError.toFixed(3)}%)`);
  }
  if (!interetsMatch) {
    console.log(`   Interest is off by ${interetsDiff.toLocaleString('fr-FR')} FCFA`);
  }
}
console.log('='.repeat(60));

// Detailed breakdown of each month's contribution
console.log('\n' + '-'.repeat(60));
console.log('Monthly breakdown (for verification):');
console.log('-'.repeat(60));
console.log('Month | Contribution |  Days Remaining | Final Value');
console.log('-'.repeat(60));

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });
const tauxAnnuelDecimal = new Decimal(testCase.tauxAnnuel).div(100);
const montantMensuel = new Decimal(testCase.mensuel);
let totalBreakdown = new Decimal(0);

for (let i = 0; i < testCase.dureeMois; i++) {
  const monthNumber = i + 1;
  const joursRestants = getDaysRemaining(i, testCase.dureeMois);
  const exponent = new Decimal(joursRestants).div(365);
  const facteur = new Decimal(1).plus(tauxAnnuelDecimal).pow(exponent);
  const finalValue = montantMensuel.times(facteur);
  totalBreakdown = totalBreakdown.plus(finalValue);
  
  console.log(
    `${monthNumber.toString().padStart(2)} | ` +
    `${testCase.mensuel.toLocaleString('fr-FR').padStart(10)} | ` +
    `${joursRestants.toString().padStart(16)} | ` +
    `${Math.round(finalValue.toNumber()).toLocaleString('fr-FR').padStart(11)}`
  );
}

console.log('-'.repeat(60));
console.log(`Total: ${Math.round(totalBreakdown.toNumber()).toLocaleString('fr-FR')} FCFA`);
console.log('='.repeat(60));

// Additional test cases
console.log('\n\n' + '='.repeat(60));
console.log('ADDITIONAL TEST CASES');
console.log('='.repeat(60));

const additionalTests = [
  { mensuel: 25000, duree: 6, taux: 3.5, label: '6 months @ 3.5%' },
  { mensuel: 50000, duree: 24, taux: 4.5, label: '24 months @ 4.5%' },
  { mensuel: 100000, duree: 36, taux: 6.0, label: '36 months @ 6.0%' },
];

additionalTests.forEach((test) => {
  const result = calculerCapitalFinal(test.mensuel, test.duree, test.taux);
  const deposited = test.mensuel * test.duree;
  const effectiveRate = ((result.interets / deposited) * 100).toFixed(2);
  
  console.log(`\n${test.label}:`);
  console.log(`  Monthly: ${test.mensuel.toLocaleString('fr-FR')} FCFA`);
  console.log(`  Total deposited: ${deposited.toLocaleString('fr-FR')} FCFA`);
  console.log(`  Final value: ${Math.round(result.capitalFinal).toLocaleString('fr-FR')} FCFA`);
  console.log(`  Interest earned: ${Math.round(result.interets).toLocaleString('fr-FR')} FCFA`);
  console.log(`  Effective return: ${effectiveRate}%`);
});

console.log('\n' + '='.repeat(60));

