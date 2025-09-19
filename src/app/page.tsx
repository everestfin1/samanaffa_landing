'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4
      }
    }
  };

  // Main title line animations
  const titleLineVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.7,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0
    }
  };

  // Individual word animations for more dynamic effect
  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateY: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0
    }
  };

  // Subtitle with slide and fade effect
  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)"
    }
  };

  // Button with bounce and scale effect
  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.8,
      rotateX: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0
    }
  };

  // Character-level animation for dramatic effect
  const characterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.5
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  const handleVideoEnd = () => {
    // Start transition immediately with minimal delay
    setTimeout(() => {
      setIsTransitioning(true);
      // Quick fade transition
      setTimeout(() => {
        setShowVideo(false);
        setIsTransitioning(false);
      }, 10); // 150ms for quick fade
    }, 10); // 100ms minimal delay for smoothness
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      {/* Hero Section */}
      <main id="main">
        <section className="relative overflow-hidden bg-white h-screen -mt-20" aria-label="Hero">
          {/* Background Video/Image */}
          <div className="absolute inset-0">
            {showVideo ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                className={`hero-video transition-opacity duration-150 ease-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                aria-label="Background video"
                poster="/sama-naffa_bg.jpg"
              >
                <source src="/sama-naffa-bg-vid.mp4" type="video/mp4" />
              </video>
            ) : (
              <Image
                src="/sama-naffa_bg.jpg"
                alt="Background"
                fill
                className="object-cover transition-opacity duration-150 ease-in opacity-100"
                priority
                quality={100}
              />
            )}
          </div>
          
          <div className="relative max-w-[600px] mx-auto px-6 h-full flex items-center pt-20">
            <motion.div 
              className="text-center space-y-8 w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              
              {/* Main heading */}
              <div className="space-y-8">
                <motion.h1 
                  className="text-6xl lg:text-8xl sama-text-green font-extralight tracking-tight leading-none drop-shadow-2xl"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="inline-block"
                    variants={titleLineVariants}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.span
                      className="inline-block"
                      variants={wordVariants}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      Votre
                    </motion.span>
                    <motion.span
                      className="inline-block ml-2"
                      variants={wordVariants}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    >
                      épargne,
                    </motion.span>
                  </motion.div>
                  <br />
                  <motion.div 
                    className="inline-block"
                    variants={titleLineVariants}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  >
                    <motion.span 
                      className="sama-text-gold font-light inline-block"
                      variants={wordVariants}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                      whileHover={{ 
                        scale: 1.05, 
                        textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      notre
                    </motion.span>
                    <motion.span 
                      className="sama-text-gold font-light inline-block ml-2"
                      variants={wordVariants}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                      whileHover={{ 
                        scale: 1.05, 
                        textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      expertise
                    </motion.span>
                  </motion.div>
                </motion.h1>
                
                <motion.p 
                  className="text-xl lg:text-2xl sama-text-primary max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  La plateforme d'épargne et d'investissement de référence au Sénégal.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
              >
                <motion.button 
                  onClick={() => router.push('/register')}
                  className="group relative px-12 py-5 sama-gradient-primary text-white font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-sama-primary-green/40 hover:-translate-y-2 hover:scale-105"
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.2, 
                    ease: "easeOut" 
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7 }}
                  />
                  <motion.span 
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.3 }}
                  >
                    Ouvrir un compte
                  </motion.span>
                </motion.button>
              </motion.div>

            </motion.div>
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 2.5, 
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <motion.button 
              onClick={() => {
                const servicesSection = document.querySelector('[aria-label="Nos services"]');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex flex-col items-center gap-2 sama-text-secondary hover:sama-text-gold transition-all duration-300"
              aria-label="Faire défiler vers le bas"
              whileHover={{ 
                scale: 1.1,
                y: -2,
                transition: { duration: 0.3 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              <motion.span 
                className="text-sm font-light tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              >
                Découvrir
              </motion.span>
              <motion.div 
                className="w-8 h-8 border-2 sama-border-light rounded-full flex items-center justify-center group-hover:border-sama-accent-gold/60 transition-colors duration-300"
                animate={{ 
                  y: [0, 6, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileHover={{
                  scale: 1.1,
                  borderColor: "rgba(212, 175, 55, 0.6)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, 2, 0],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                </motion.div>
              </motion.div>
            </motion.button>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-32 " aria-label="Nos services">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl sama-text-primary font-extralight mb-6 tracking-tight">
                Deux solutions,
                <span className="block sama-text-highlight font-light">
                  un objectif
                </span>
              </h2>
              <p className="text-xl sama-text-secondary font-light max-w-2xl mx-auto">
                Choisissez la solution qui correspond parfaitement à vos ambitions financières
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Sama Naffa Card */}
              <div className="group relative sama-bg-card backdrop-blur-sm rounded-3xl p-10 border sama-border-light hover:border-sama-primary-green/30 transition-all duration-700 hover:shadow-2xl hover:shadow-sama-primary-green/10 hover:-translate-y-2">
                {/* Subtle accent */}
                <div className="absolute top-0 left-0 w-full h-1 sama-gradient-primary rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 sama-bg-light-green rounded-3xl flex items-center justify-center group-hover:bg-sama-primary-green/10 transition-all duration-300">
                        <DevicePhoneMobileIcon className="w-8 h-8 sama-text-green" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 sama-gradient-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-light sama-text-primary mb-2">Sama Naffa</h3>
                      <p className="sama-text-secondary text-lg font-light">Épargne Inclusive Moderne</p>
                    </div>
                  </div>
                  
                  <p className="sama-text-secondary leading-relaxed text-lg font-light">
                    Épargne intelligente avec objectifs personnalisés, comptes joints et défis d'épargne communautaires pour une gestion financière moderne.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-primary rounded-full"></div>
                      <span className="sama-text-secondary font-light">Objectifs d'épargne personnalisés</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-primary rounded-full"></div>
                      <span className="sama-text-secondary font-light">Comptes joints et tontines digitales</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-primary rounded-full"></div>
                      <span className="sama-text-secondary font-light">Défis d'épargne motivants</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/sama-naffa"
                    className="inline-flex items-center gap-3 sama-text-primary font-medium hover:sama-text-gold transition-all duration-300 group/link pt-4"
                  >
                    <span className="text-lg">Découvrir Sama Naffa</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* APE Card */}
              <div className="group relative sama-bg-card backdrop-blur-sm rounded-3xl p-10 border sama-border-light hover:border-sama-accent-gold/30 transition-all duration-700 hover:shadow-2xl hover:shadow-sama-accent-gold/10 hover:-translate-y-2">
                {/* Subtle accent */}
                <div className="absolute top-0 left-0 w-full h-1 sama-gradient-accent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-sama-accent-gold/10 rounded-3xl flex items-center justify-center group-hover:bg-sama-accent-gold/20 transition-all duration-300">
                        <BuildingLibraryIcon className="w-8 h-8 sama-text-gold" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 sama-gradient-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-light sama-text-primary mb-2">Emprunt Obligataire</h3>
                      <p className="sama-text-secondary text-lg font-light">Appel Public à l'Épargne</p>
                    </div>
                  </div>
                  
                  <p className="sama-text-secondary leading-relaxed text-lg font-light">
                    Investissement sécurisé dans les obligations d'État avec rendement fixe garanti et échéances définies pour une croissance stable.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-accent rounded-full"></div>
                      <span className="sama-text-secondary font-light">Rendement fixe garanti de 8%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-accent rounded-full"></div>
                      <span className="sama-text-secondary font-light">Sécurisé par l'État du Sénégal</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 sama-gradient-accent rounded-full"></div>
                      <span className="sama-text-secondary font-light">Calculateur de rendement intégré</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/ape"
                    className="inline-flex items-center gap-3 sama-text-primary font-medium hover:sama-text-gold transition-all duration-300 group/link pt-4"
                  >
                    <span className="text-lg">Explorer l'APE</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
