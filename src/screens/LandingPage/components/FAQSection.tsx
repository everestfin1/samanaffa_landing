import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Comment fonctionne Sama Naffa ?',
    answer:
      "Sama Naffa vous permet de définir un objectif d'épargne, de choisir un montant mensuel et une durée. Votre capital fructifie grâce à un taux d'intérêt compétitif. Vous suivez votre progression en temps réel depuis l'application.",
  },
  {
    question: 'Mon argent est-il en sécurité ?',
    answer:
      "Oui. Vos fonds sont déposés dans une institution financière partenaire régulée. Les transferts sont sécurisés et chiffrés de bout en bout.",
  },
  {
    question: 'Puis-je retirer mon argent avant la fin ?',
    answer:
      "Tu peux retirer tes fonds à tout moment. Cependant, pour profiter pleinement du rendement annoncé, nous te recommandons de respecter la durée initiale.",
  },
  {
    question: "Quels sont les frais d'utilisation ?",
    answer:
      "L'inscription et la gestion du compte sont gratuites. Des frais minimes peuvent s'appliquer en cas de retrait anticipé ou de transferts internationaux.",
  },
  {
    question: 'Comment contacter le support ?',
    answer:
      "Notre équipe est dispo par WhatsApp, e-mail (contact@samanaffa.com) et téléphone aux horaires ouvrables.",
  },
];

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const FAQSection: React.FC = () => {
  return (
    <section className="w-full bg-gray-50 py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#30461f] mb-8">
          FAQ
        </h2>
        <div className="divide-y divide-gray-300/60">
          {faqs.map((faq, idx) => (
            <details key={idx} className="py-4 group">
              <summary className="cursor-pointer list-none font-medium text-lg md:text-xl flex justify-between items-center text-[#30461f] group-open:text-[#C38D1C]">
                {faq.question}
                <span className="text-[#C38D1C] ml-2">
                  <ChevronIcon open={typeof window !== 'undefined' && (document?.querySelectorAll('details')[idx]?.open)} />
                </span>
              </summary>
              <p className="mt-2 text-gray-700 leading-relaxed text-sm md:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}; 