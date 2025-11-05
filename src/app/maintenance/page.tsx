import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance en cours — Sama Naffa',
  description: 'Sama Naffa est actuellement en maintenance. Nous reviendrons bientôt.',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient with Sama Naffa colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#30461f] via-[#435933] to-[#5a7344]">
        {/* Animated circles for visual interest */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C38D1C]/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite] [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#364529]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <Image
              src="/sama_naffa_logo.png"
              alt="Sama Naffa Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C38D1C] to-[#b3830f] rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-6 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-20 h-20 bg-[#C38D1C]/30 rounded-2xl animate-[ping_1s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Maintenance en cours
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light">
            Nous améliorons votre expérience
          </p>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4 mb-10">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Notre plateforme est actuellement en maintenance pour vous offrir une meilleure expérience.
            </p>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Nous travaillons dur pour revenir très bientôt avec des améliorations passionnantes.
            </p>
          </div>

          {/* Status indicator */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C38D1C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C38D1C]"></span>
            </div>
            <span className="text-white/90 font-medium">Maintenance active</span>
          </div>

          {/* Contact info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 mb-4">Pour toute urgence, contactez-nous :</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a
                href="mailto:contact@samanaffa.sn"
                className="inline-flex items-center gap-2 text-[#C38D1C] hover:text-[#b3830f] transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                contact@samanaffa.sn
              </a>
              <a
                href="tel:+221338234567"
                className="inline-flex items-center gap-2 text-[#C38D1C] hover:text-[#b3830f] transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +221 33 823 45 67
              </a>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-white/60 text-sm">
          © {new Date().getFullYear()} Sama Naffa — Everest Finance SGI
        </p>
      </div>
    </div>
  );
}

