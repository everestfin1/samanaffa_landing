import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[460px] lg:h-[520px]">
        <Image
          src="/pee/Banniere_PEE_1.png"
          alt="Bannière PEE"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </section>
  );
}
