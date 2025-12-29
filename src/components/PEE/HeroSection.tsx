import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
    window.addEventListener('resize', () => {
      window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
    });
    return () => {
      window.removeEventListener('resize', () => {
        window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
      });
    };
  }, [])
  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="relative w-full h-[65vh] sm:h-[100vh] md:h-[60vh] lg:h-[50vh]">
        {isMobile ? 
        <Image src="/pee/Banniere_PEE_3_mobile.png" alt="Bannière PEE" quality={100} fill className="object-cover object-center" priority />
        : 
        <Image
          src="/pee/Banniere_PEE_3.png"
          alt="Bannière PEE"
          quality={100}
          fill
          className="object-cover object-center"
          priority
        />
        }
      </div>
    </section>
  );
}
