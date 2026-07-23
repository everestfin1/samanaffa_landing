import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import E0AfterFooter from "@/components/landing/E0AfterFooter";
import E0HeroBackground from "@/components/landing/E0HeroBackground";

const benefits = [
  {
    image: "/figma/e0/calculator.png",
    title: "Nattukaay Yéené",
    description: "Mesure ton projet",
    width: 138,
    height: 124,
  },
  {
    image: "/figma/e0/savings-hand.png",
    title: "Sama Yéené",
    description: "Fixe ton objectif",
    width: 121,
    height: 107,
  },
  {
    image: "/figma/e0/savings-sacks.png",
    title: "Samay Kondanné",
    description: "Suis ton épargne",
    width: 138,
    height: 95,
  },
];

const steps = [
  "Clique sur Ouvre mon Naffa",
  "Choisis ton projet",
  "Renseigne tes informations",
  "Fais ton premier versement",
];

function MarketingHeader() {
  return (
    <header className="e0-header">
      <div className="relative mx-auto flex h-[88px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-11">
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          <Link
            className="text-lg font-medium text-[var(--sama-cod-gray)] transition-colors hover:text-[var(--sama-marigold)]"
            href="/"
          >
            Accueil
          </Link>
          <Link
            className="text-lg font-medium text-[var(--sama-cod-gray)] transition-colors hover:text-[var(--sama-marigold)]"
            href="#nattukaay"
          >
            Nattukaay Yéené
          </Link>
        </nav>

        <Link
          className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-80"
          href="/"
          aria-label="Accueil Sama Naffa"
        >
          <Image
            src="/figma/e0/logo-small.png"
            alt="Sama Naffa par Everest Finance"
            width={180}
            height={100}
            priority
            className="h-[72px] w-auto object-contain"
          />
        </Link>

        <Link href="/login" className="e0-cta-forest ml-auto text-[15px]">
          Se connecter
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="e0-hero" aria-labelledby="hero-title">
      <E0HeroBackground />

      <div className="e0-hero-content">
        <h1 id="hero-title" className="e0-hero-title">
          Ton épargne,
          <span className="e0-hero-title-accent">notre expertise</span>
        </h1>
        <p className="mt-5 max-w-lg text-base font-normal text-[var(--sama-cod-gray)] drop-shadow-sm md:text-xl">
          La plateforme qui accompagne ton épargne, pas à pas
        </p>
        <Link href="/onboarding" className="e0-cta-marigold mt-8">
          Ouvre mon Naffa
        </Link>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="nattukaay" className="e0-benefits" aria-labelledby="benefits-title">
      <div className="mx-auto max-w-[1000px]">
        <h2 id="benefits-title" className="e0-benefits-title">
          Suis ton épargne simplement
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-14 text-center sm:grid-cols-3 sm:gap-8">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="flex flex-col items-center">
              <div className="flex h-32 items-end justify-center">
                <Image
                  src={benefit.image}
                  alt=""
                  width={benefit.width}
                  height={benefit.height}
                  className="max-h-32 w-auto object-contain"
                />
              </div>
              <h3 className="e0-benefit-title">{benefit.title}</h3>
              <p className="mt-2 text-base text-white/90">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="e0-steps" aria-labelledby="steps-title">
      <div className="mx-auto max-w-[1000px]">
        <h2 id="steps-title" className="e0-steps-title">
          ... juste en 2 minutes
        </h2>
        <ol className="mx-auto mt-14 max-w-xl">
          {steps.map((step, index) => (
            <li key={step} className="relative flex min-h-24 items-start gap-5 last:min-h-0">
              {index < steps.length - 1 ? (
                <span className="e0-step-line" aria-hidden="true" />
              ) : null}
              <span className="e0-step-dot" aria-hidden="true">
                ✓
              </span>
              <span className="pt-2 text-lg text-[var(--sama-cod-gray)] md:text-2xl">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FirstStep() {
  return (
    <section className="e0-first-step" aria-labelledby="first-step-title">
      <div className="relative mx-auto flex min-h-[384px] w-full items-center">
        <div className="z-[1] w-full px-8 py-16 text-center md:max-w-[52%] md:pl-20 md:pr-8 md:text-left lg:pl-24 xl:pl-[max(6rem,calc((100vw-1200px)/2+1.5rem))]">
          <h2 id="first-step-title" className="e0-first-step-title">
            Ton yéené commence ici
          </h2>
          <Link href="/onboarding" className="e0-cta-marigold mt-8">
            Fais le premier pas
          </Link>
        </div>
        <div className="relative h-80 w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[48%]">
          <Image
            src="/figma/e0/first-step-art-large.png"
            alt="Une main indique un coffre d'épargne Sama Naffa"
            fill
            sizes="(max-width: 767px) 100vw, 48vw"
            className="object-contain object-right-bottom"
          />
        </div>
      </div>
    </section>
  );
}

function LegalFooter() {
  return (
    <footer>
      <div className="e0-legal">
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-[1.2fr_0.55fr_1fr]">
          <div>
            <Image
              src="/figma/e0/logo-small.png"
              alt="Sama Naffa"
              width={104}
              height={58}
              className="h-[58px] w-auto object-contain"
            />
            <p className="e0-legal-muted mt-4 max-w-sm text-sm leading-relaxed">
              Sama Naffa est un service de gestion sous mandat de EVEREST Finance,
              Société agréée et régulée par l&apos;AMF-UMOA n° SGI/2016-01
            </p>
          </div>
          <nav aria-label="Support">
            <h2 className="m-0 text-sm font-bold text-[var(--sama-periglacial)]">Support</h2>
            <div className="e0-legal-muted mt-4 flex flex-col gap-2 text-sm">
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/contact" className="hover:text-white">
                Réclamations
              </Link>
            </div>
          </nav>
          <address className="not-italic">
            <h2 className="m-0 text-sm font-bold text-[var(--sama-periglacial)]">Contact</h2>
            <div className="e0-legal-muted mt-4 space-y-3 text-sm">
              <a className="flex items-center gap-3 hover:text-white" href="tel:+221338228700">
                <PhoneIcon className="size-4" />
                +221 33 822 87 00
              </a>
              <a className="flex items-center gap-3 hover:text-white" href="mailto:contact@samanaffa.com">
                <EnvelopeIcon className="size-4" />
                contact@samanaffa.com
              </a>
              <p className="m-0 flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                18 Boulevard de la République
                <br />
                Dakar, Sénégal BP: 11659-13000
              </p>
            </div>
          </address>
        </div>
        <div className="e0-legal-soft mx-auto mt-10 flex max-w-[1080px] flex-col gap-4 border-t border-white/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">© 2026 EVEREST Finance</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white">
              CGU
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
            <Link href="/contact" className="hover:text-white">
              Réclamations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function E0Landing() {
  return (
    <div className="e0-page">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      {/* Fixed under the sheet — DOM order matters: before the sheet */}
      <E0AfterFooter />
      <div className="e0-sheet">
        <div className="e0-top">
          <MarketingHeader />
          <Hero />
        </div>
        <main id="main">
          <Benefits />
          <Steps />
          <FirstStep />
        </main>
        <LegalFooter />
      </div>
      {/* Spacer = splash height so scrolling past the sheet uncovers it */}
      <div className="e0-after-footer-spacer" aria-hidden />
    </div>
  );
}
