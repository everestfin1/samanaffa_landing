import Image from 'next/image';

export default function WhyPEE() {
  return (
    <section id="why" className="py-8 md:pt-12 bg-gradient-to-r from-[#20163B] to-[#461D4C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Image Block */}
          <div className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/pee/teacher_kids.jpg" // Photo maquette
              alt="Parent et enfant"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Block */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C09037]">
              Pourquoi un Plan Épargne Éducation ?
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Parce que l’éducation a un coût et que l’anticipation fait la différence. Le Plan Épargne Éducation vous permet de constituer progressivement un capital dédié aux études de votre enfant, en toute sérénité, pour lui offrir la liberté de choisir son avenir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
