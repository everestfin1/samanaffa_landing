import React from 'react';

interface HeroSectionProps {
  onShowForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShowForm }) => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute blur-sm md:blur-none w-full h-full lg:w-[1123px] lg:h-full top-0 left-0 object-cover">
        <img
          className="w-full h-full object-cover object-center"
          alt="Background element"
          src="/4x3-v2-3h-1.png"
        />
      </div>

      {/* Éléments décoratifs - Cachés sur mobile */}
      {/* <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute w-24 h-24 bg-[#435933]/80 rounded-full top-32 left-32 animate-float"></div>
        <div
          className="absolute w-16 h-16 bg-[#C38D1C]/10 rounded-full bottom-40 right-40 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div> */}

      <div className="relative w-full h-full z-10">
        {/* Logo - Centered using Flexbox */}
        <div className="flex justify-center w-full pt-4">
          <img
            className="w-[120px] h-[67px] sm:w-[140px] sm:h-[78px] lg:w-[194px] lg:h-[109px] object-cover hover:scale-105 transition-transform duration-300"
            alt="Logo SAMA NAFFA"
            src="/logo-sama-naffa-vf-logo-1.png"
          />
        </div>

        {/* Main content container */}
        <div className="flex flex-col md:grid md:grid-cols-3 md:gap-8 lg:gap-12 xl:gap-16 min-h-screen px-4 sm:px-6 pt-10">
          <div>
          </div>
          {/* Content section - Left side on desktop */}
          <div className="md:rounded-2xl md:backdrop-blur-sm md:bg-white/30 md:px-2 md:py-4 md:my-4 flex-1 flex flex-col justify-center items-center pt-20 text-center md:col-span-1 md:items-start md:text-start space-y-2 lg:space-y-6 max-w-lg md:max-w-none mx-auto md:mx-0 pb-8 md:pb-0">

            {/* Main title */}
            <h1 className="font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight animate-fade-in">
              <span className=" md:block text-[#435933] mb-1 sm:mb-2">
                Épargner
              </span>
              <span className="ml-2 md:ml-0 md:block text-[#C38D1C]">intelligemment</span>
            </h1>

            {/* Subtitle */}
            <h2
              className="font-medium text-[#30461f] text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              pour réaliser vos projets.
            </h2>

            {/* Description */}
            <div
              className="space-y-3 lg:space-y-4 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="font-normal text-[#1a1616] text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm md:max-w-md lg:max-w-lg">
                Rejoignez la révolution de l'épargne digitale en Afrique de
                l'Ouest avec
                <span className="font-semibold text-[#435933]">
                  {" "}
                  Sama Naffa
                </span>
                .
              </p>

            </div>

            {/* CTA button */}
            <div
              className="pt-4 lg:pt-6 animate-fade-in w-full flex justify-center md:justify-start"
              style={{ animationDelay: "0.9s" }}
            >
              <button
                onClick={onShowForm}
                className="group relative px-6 sm:px-8 h-[52px] sm:h-[56px] lg:h-[60px] bg-gradient-to-r from-[#30461f] to-[#435933] hover:from-[#243318] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden max-w-xs sm:max-w-sm md:max-w-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">
                  Je m'inscris
                </span>
                <svg
                  width="20"
                  height="6"
                  viewBox="0 0 24 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
                >
                  <path
                    d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Image section - Right side on desktop */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center md:justify-end md:pb-0 md:col-span-1">

            {/* App store badges */}
            <div className="w-full flex justify-center items-center sm:gap-3 lg:gap-4">
              <img
                className="w-[120px] sm:w-[130px] lg:w-[135px] h-8 sm:h-9 lg:h-10 hover:scale-105 transition-transform duration-300 cursor-pointer"
                alt="App Store"
                src="/mobile-app-store-badge.svg"
              />
              <div className="w-[120px] sm:w-[130px] lg:w-[135px] h-8 sm:h-9 lg:h-10 bg-baseblack rounded-[5px] overflow-hidden border border-solid border-[#a6a6a6] relative hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  className="absolute w-[65px] sm:w-[75px] lg:w-[85px] h-[13px] sm:h-[15px] lg:h-[17px] top-[13px] sm:top-[15px] lg:top-[17px] left-[32px] sm:left-[36px] lg:left-[41px]"
                  alt="Google play"
                  src="/google-play.svg"
                />
                <img
                  className="absolute w-[30px] sm:w-[35px] lg:w-[39px] h-1 sm:h-1 lg:h-1.5 top-[6px] sm:top-[6px] lg:top-[7px] left-[32px] sm:left-[36px] lg:left-[41px]"
                  alt="Get it on"
                  src="/get-it-on.svg"
                />
                <img
                  className="absolute w-[18px] sm:w-[20px] lg:w-[23px] h-[21px] sm:h-[23px] lg:h-[26px] top-[5px] sm:top-[6px] lg:top-[7px] left-2 sm:left-2 lg:left-2.5"
                  alt="Google play logo"
                  src="/google-play-logo.png"
                />
              </div>
            </div>
            {/* Phone image */}
            <div className="flex justify-center">
              <img
                className="w-[280px] sm:w-[320px] md:w-[500px] lg:w-[550px] xl:w-[650px] h-auto hover:scale-105 transition-transform duration-500 drop-shadow-2xl z-20"
                alt="Application Sama Naffa sur téléphone"
                src="/phone.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 