import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useRef, useEffect, useState } from 'react';
import {
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { LazyMotion, domAnimation, m } from 'framer-motion';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAudio = async () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = false;
    video.playsInline = true;

    const handleVideoEnded = () => {
      if (!hasPlayedOnce) {
        setHasPlayedOnce(true);
        setIsVideoPaused(true);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
          video.currentTime = 0;
          video.loop = true;
          video.play().then(() => setIsVideoPaused(false)).catch(console.log);
        }, 60000);
      }
    };

    const startVideo = () => {
      if (video.readyState >= 2) {
        video.play().catch(console.log);
      }
    };

    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('loadeddata', startVideo);
    if (video.readyState >= 2) startVideo();

    return () => {
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('loadeddata', startVideo);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [hasPlayedOnce]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <a href="#main" className="skip-link">Aller au contenu principal</a>

        <main id="main">
          <section className="relative overflow-hidden bg-white h-screen md:h-screen -mt-32 hero-section" aria-label="Hero">
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                preload="auto"
                className={`hero-video hero-media-position w-full h-full object-cover transition-opacity duration-1000 ${isVideoPaused ? 'opacity-0' : 'opacity-100'}`}
                poster="/sama-naffa_bg.jpg"
              >
                <source src="/sama-naffa-bg-vid.mp4" type="video/mp4" />
              </video>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isVideoPaused ? 'opacity-100' : 'opacity-0'}`}>
                <img src="/sama-naffa_bg.jpg" alt="Hero background" className="hero-media-position object-cover w-full h-full" />
              </div>
            </div>

            <m.div
              className="absolute bottom-6.5 right-22 z-20 max-md:hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={toggleAudio}
                className="group relative bg-gold-metallic hover:bg-gold-metallic/50 rounded-full p-3 border border-gold-metallic/30"
                aria-label={isAudioEnabled ? "Désactiver le son" : "Activer le son"}
              >
                {isAudioEnabled ? (
                  <SpeakerWaveIcon className="w-6 h-6 text-white" />
                ) : (
                  <SpeakerXMarkIcon className="w-6 h-6 text-white" />
                )}
              </button>
            </m.div>

            <div className="relative max-w-[600px] mx-auto px-6 h-full flex pt-[18rem] md:items-center md:pt-20">
              <m.div 
                className="text-center space-y-8 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <m.h1 
                  className="text-6xl lg:text-8xl sama-text-green font-extralight tracking-tight leading-none drop-shadow-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Votre épargne,<br />
                  <span className="sama-text-gold font-light">notre expertise</span>
                </m.h1>
                
                <m.p 
                  className="text-xl lg:text-2xl sama-text-primary max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  La plateforme d'épargne et d'investissement de référence au Sénégal.
                </m.p>

                <m.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <button 
                    onClick={() => navigate({ to: '/register' })}
                    className="group relative px-12 py-5 sama-gradient-accent text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:cursor-pointer"
                  >
                    Ouvrir mon naffa
                  </button>
                </m.div>
              </m.div>
            </div>
            
            <m.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <button 
                onClick={() => document.querySelector('[aria-label="Nos services"]')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-2 sama-text-secondary hover:sama-text-gold transition-all duration-300"
              >
                <span className="text-sm font-light tracking-wide">Découvrir</span>
                <div className="w-8 h-8 border-2 sama-border-light rounded-full flex items-center justify-center">
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </button>
            </m.div>
          </section>

          <section className="pt-16" aria-label="Diaspora Bond Banner">
            <div className="max-w-6xl mx-auto px-6">
              <Link to="/register">
                <img src="/Créa-Diaspora-Bond-1.png" alt="Diaspora Bonds" className="w-full h-auto hover:opacity-80 transition-all duration-300" />
              </Link>
            </div>
          </section>

          <section className="pt-16 pb-32" aria-label="Nos services">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl sama-text-primary font-extralight mb-6 tracking-tight">
                  Deux solutions,<span className="block sama-text-gold font-light">un objectif</span>
                </h2>
                <p className="text-xl sama-text-secondary font-light max-w-2xl mx-auto">
                  Choisissez la solution qui correspond parfaitement à vos ambitions financières
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="group relative sama-bg-card backdrop-blur-sm rounded-3xl p-10 border sama-border-light hover:border-sama-primary-green/30 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 sama-bg-light-green rounded-3xl flex items-center justify-center">
                        <DevicePhoneMobileIcon className="w-8 h-8 sama-text-green" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-light sama-text-primary mb-2">Sama Naffa</h3>
                        <p className="sama-text-secondary text-lg font-light">Épargne Inclusive Moderne</p>
                      </div>
                    </div>
                    <p className="sama-text-secondary leading-relaxed text-lg font-light">
                      Épargne intelligente avec objectifs personnalisés, comptes joints et défis d'épargne communautaires.
                    </p>
                    <Link to="/sama-naffa" className="inline-flex items-center gap-3 sama-text-primary font-medium hover:sama-text-gold transition-all duration-300 pt-4">
                      <span className="text-lg">Découvrir Sama Naffa</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="group relative sama-bg-card backdrop-blur-sm rounded-3xl p-10 border sama-border-light hover:border-sama-accent-gold/30 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-sama-accent-gold/10 rounded-3xl flex items-center justify-center">
                        <BuildingLibraryIcon className="w-8 h-8 sama-text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-light sama-text-primary mb-2">Emprunt Obligataire</h3>
                        <p className="sama-text-secondary text-lg font-light">Appel Public à l'Épargne</p>
                      </div>
                    </div>
                    <p className="sama-text-secondary leading-relaxed text-lg font-light">
                      Investissement sécurisé dans les obligations d'État avec rendement fixe garanti.
                    </p>
                    <Link to="/pee" className="inline-flex items-center gap-3 sama-text-primary font-medium hover:sama-text-gold transition-all duration-300 pt-4">
                      <span className="text-lg">Explorer le PEE</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </LazyMotion>
  );
}
