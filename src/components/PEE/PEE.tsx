'use client';

import Header from './Header';
import HeroSection from './HeroSection';
import WhyPEE from './WhyPEE';
import AdvantagesPEE from './AdvantagesPEE';
import LeadForm from './LeadForm';
import { Footer as ApeFooter } from '../APE/Footer';
import PEESavingsSimulator from './PEESavingsSimulator';

export default function PEE() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-[#C38D1C] selection:text-white">
      <Header />
      <HeroSection />
      <WhyPEE />
      <AdvantagesPEE />
      <PEESavingsSimulator />
      <LeadForm />
      <ApeFooter />
    </main>
  );
}
