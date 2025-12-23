import Image from 'next/image';

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
    <section id="advantages" className="py-8 md:py-12 bg-gradient-to-r from-[#20163B] to-[#461D4C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Text/List Block (Left per design) */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#D2BBD6]">
              Avantages du PEE
            </h2>
            <ul className="space-y-1 md:space-y-2">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-[6px] h-[6px] bg-white/90 rounded-none"></span>
                  <span className="text-base md:text-lg font-light text-white/90 leading-relaxed">{advantage}</span>
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
