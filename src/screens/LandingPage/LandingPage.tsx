import { useState, useEffect } from "react";
import { ContactForm } from "../../components/ContactForm";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { SavingsPlanner } from "./components/SavingsPlanner";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { Footer } from "./components/Footer";
import { FAQSection } from "./components/FAQSection";
import { HeroExplainerSection } from "./components/HeroExplainerSection";
import { WhatsAppFloatingButton } from "../../components/WhatsAppFloatingButton";
import { objectives, personas } from "./data";

const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

const calculerCapitalFinal = (
  mensuel: number,
  dureeMois: number,
  tauxAnnuel: number,
): { capitalFinal: number; interets: number } => {
  const tauxMensuel = tauxAnnuel / 12 / 100; // Convert annual rate to monthly and percentage to decimal
  const capitalFinal = mensuel * ((Math.pow(1 + tauxMensuel, dureeMois) - 1) / tauxMensuel);
  const capitalVerse = mensuel * dureeMois;
  const interets = capitalFinal - capitalVerse;
  return {
    capitalFinal,
    interets,
  };
};

export const LandingPage = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  
  interface FormSubmissionData {
    objective: string;
    monthlyAmount: number;
    duration: number;
    projectedAmount: number;
  }

  const [formData, setFormData] = useState<FormSubmissionData | null>(null);

  const handleShowForm = (data: FormSubmissionData) => {
    setFormData(data);
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const noop = () => {};

  const handleHeroCTA = () => setShowForm(true);

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        <HeroSection onShowForm={handleHeroCTA} />
        <HeroExplainerSection />
        <SavingsPlanner onShowForm={handleShowForm} />

        {/* Contact Form Section avec background vert clair - Responsive */}
        {showForm && (
          <section
            id="contact-form"
            className="w-full py-8 lg:py-16 px-4 lg:px-[133px] bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] animate-fade-in"
          >
            {formData && (
            <ContactForm
                selectedObjective={formData.objective}
                monthlyAmount={formData.monthlyAmount}
                duration={formData.duration}
                projectedAmount={formData.projectedAmount}
                onObjectiveChange={noop}
                onPersonaChange={noop}
              objectives={objectives}
              personas={personas}
                simulationMode={null}
            />
            )}
          </section>
        )}

        <TestimonialsSection />

        <FAQSection />

        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </div>
  );
};
