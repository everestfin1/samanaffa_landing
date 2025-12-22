import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function AdvantagesPEE() {
  const advantages = [
    "Anticipez les frais d’études sans stress",
    "Épargne simple, progressive et sécurisée",
    "Rendement supérieur à l’épargne classique",
    "Capital sécurisé + intérêts",
    "Discipline d’épargne sur le long terme",
    "Sérénité pour les parents, avenir assuré pour l’enfant"
  ];

  return (
    <section id="advantages" className="py-16 md:py-20 bg-gradient-to-r from-[#20163B] to-[#461D4C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Text/List Block (Left per design) */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#C38D1C]">
              Avantages du PEE
            </h2>
            <ul className="space-y-4 md:space-y-5">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-[#C38D1C] flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg font-light text-white/90">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Block (Right per design) */}
          <div className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/pee/avantages_image.jpg" // Photo maquette
              alt="Parent et enfant"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
