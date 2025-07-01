import { useState, useEffect } from "react";
import { ContactForm } from "../../components/ContactForm";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { SavingsPlanner } from "./components/ObjectivesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { Footer } from "./components/Footer";
import { Objective, Persona } from "./data/types";
import { objectives, personas } from "./data";
import { FAQSection } from "./components/FAQSection";
import { HeroExplainerSection } from "./components/HeroExplainerSection";
import { WhatsAppFloatingButton } from "../../components/WhatsAppFloatingButton";

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
  
  // Simulation state lifted from SavingsPlanner
  const [simulationMode, setSimulationMode] = useState<"objective" | "persona" | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [duree, setDuree] = useState(12);
  const [mensualite, setMensualite] = useState(25000);
  const [taux, setTaux] = useState(tauxParDuree(12));

  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);

  useEffect(() => {
    setTaux(tauxParDuree(duree));
  }, [duree]);

  useEffect(() => {
    if (simulationMode === 'objective' && selectedObjective) {
      setDuree(selectedObjective.duree);
      setMensualite(selectedObjective.mensualite);
      setSelectedPersona(null); 
    }
  }, [selectedObjective, simulationMode]);

  useEffect(() => {
    if (simulationMode === 'persona' && selectedPersona) {
      setDuree(selectedPersona.duration);
      setMensualite(selectedPersona.amount);
      setSelectedObjective(null);
    }
  }, [selectedPersona, simulationMode]);

  const handleObjectiveChange = (objective: Objective | null) => {
    if (objective) {
      setSimulationMode('objective');
      setSelectedObjective(objective);
    } else {
      // "Autre" was selected, keep current simulation values but clear objective
      setSelectedObjective(null);
    }
  }

  const handlePersonaChange = (persona: Persona | null) => {
    if (persona) {
      setSimulationMode('persona');
      setSelectedPersona(persona);
    } else {
      setSelectedPersona(null);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const objectiveName = selectedObjective?.titre || selectedPersona?.name || "Plan personnalisé";

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        <HeroSection />
        <HeroExplainerSection />
        <SavingsPlanner 
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          selectedObjective={selectedObjective}
          setSelectedObjective={setSelectedObjective}
          selectedPersona={selectedPersona}
          setSelectedPersona={setSelectedPersona}
          duree={duree}
          setDuree={setDuree}
          mensualite={mensualite}
          setMensualite={setMensualite}
          capitalFinal={capitalFinal}
          interets={interets}
          objectives={objectives}
          personas={personas}
          onShowForm={handleShowForm} 
        />

        {/* Contact Form Section avec background vert clair - Responsive */}
        {showForm && (
          <section
            id="contact-form"
            className="w-full py-8 lg:py-16 px-4 lg:px-[133px] bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] animate-fade-in"
          >
            <ContactForm
              selectedObjective={objectiveName}
              monthlyAmount={mensualite}
              duration={Math.round((duree / 12) * 10) / 10}
              projectedAmount={Math.round(capitalFinal)}
              onObjectiveChange={handleObjectiveChange}
              onPersonaChange={handlePersonaChange}
              objectives={objectives}
              personas={personas}
              simulationMode={simulationMode}
            />
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
