import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <section id="hero" className="relative w-full bg-white">
      <div className="relative w-full h-[65vh] sm:h-[100vh] md:h-[60vh] lg:h-[50vh]">
        {isMobile ? 
        <img src="/pee/Banniere_PEE_3_mobile.png" alt="Bannière PEE" className="object-cover object-center absolute inset-0 w-full h-full" />
        : 
        <img
          src="/pee/Banniere_PEE_3.png"
          alt="Bannière PEE"
          className="object-cover object-center absolute inset-0 w-full h-full"
        />
        }
      </div>
    </section>
  );
}
