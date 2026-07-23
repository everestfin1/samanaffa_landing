import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";

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
    <header className="border-b border-sama-pearl-bush bg-white shadow-[0_2px_5px_rgb(0_0_0/0.03)]">
      <div className="relative mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-11">
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          <Link className="text-[15px] font-medium text-sama-cod-gray transition-colors hover:text-sama-marigold" href="/">
            Accueil
          </Link>
          <Link className="text-[15px] font-medium text-sama-cod-gray transition-colors hover:text-sama-marigold" href="#nattukaay">
            Nattukaay Yéené
          </Link>
        </nav>

        <Link className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-80" href="/" aria-label="Accueil Sama Naffa">
          <Image
            src="/figma/e0/logo-small.png"
            alt="Sama Naffa par Everest Finance"
            width={104}
            height={58}
            priority
            className="h-[52px] w-auto object-contain"
          />
        </Link>

        <Link
          href="/login"
          className="ml-auto inline-flex min-h-10 items-center justify-center rounded-full bg-sama-forest-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-sama-forest focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sama-marigold active:translate-y-px"
        >
          Se connecter
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-white md:min-h-[613px]" aria-labelledby="hero-title">
      <Image
        src="/figma/e0/hero-art-large.png"
        alt="Un oiseau prend son envol depuis un nid contenant l'épargne Sama Naffa"
        fill
        priority
        sizes="(max-width: 767px) 110vw, 70vw"
        className="pointer-events-none object-contain object-left-bottom md:w-[70%]"
      />

      <div className="relative z-[1] mx-auto flex min-h-[520px] max-w-[1200px] flex-col items-center px-6 pt-20 text-center md:min-h-[613px] md:pt-24">
        <h1 id="hero-title" className="[margin:0] max-w-xl text-[clamp(2.5rem,4.1vw,3.55rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-sama-forest">
          Ton épargne,
          <span className="block text-sama-marigold">notre expertise</span>
        </h1>
        <p className="[margin:1.25rem_0_0] max-w-lg text-sm font-medium text-sama-cod-gray sm:text-base">
          La plateforme qui accompagne ton épargne, pas à pas
        </p>
        <Link
          href="/onboarding"
          className="mt-7 inline-flex min-h-[55px] items-center justify-center rounded-full bg-sama-marigold px-9 text-base font-semibold text-white shadow-[0_10px_24px_rgb(196_151_47/0.3)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sama-forest active:translate-y-px"
        >
          Ouvre mon Naffa
        </Link>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section id="nattukaay" className="bg-sama-forest px-6 py-20 text-white md:py-24" aria-labelledby="benefits-title">
      <div className="mx-auto max-w-[1000px]">
        <h2 id="benefits-title" className="[margin:0] text-center text-[clamp(1.75rem,3.2vw,2.4rem)] font-medium tracking-[-0.02em]">
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
              <h3 className="[margin:1.25rem_0_0] text-xl font-bold text-sama-marigold md:text-2xl">
                {benefit.title}
              </h3>
              <p className="[margin:0.45rem_0_0] text-base text-white/90">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="bg-white px-6 py-20 md:py-24" aria-labelledby="steps-title">
      <div className="mx-auto max-w-[1000px]">
        <h2 id="steps-title" className="[margin:0] text-center text-[clamp(1.8rem,3.2vw,2.4rem)] font-medium tracking-[-0.02em] text-sama-forest">
          ... juste en 2 minutes
        </h2>
        <ol className="mx-auto mt-14 max-w-3xl">
          {steps.map((step, index) => (
            <li key={step} className="relative flex min-h-24 items-start gap-5 last:min-h-0">
              {index < steps.length - 1 ? (
                <span className="absolute left-[19px] top-11 h-[calc(100%-2.5rem)] w-px bg-sama-forest/35" aria-hidden="true" />
              ) : null}
              <span className="relative z-[1] flex size-10 shrink-0 items-center justify-center rounded-full bg-sama-forest text-lg font-bold text-white" aria-hidden="true">
                ✓
              </span>
              <span className="pt-2 text-lg text-sama-cod-gray md:text-xl">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FirstStep() {
  return (
    <section className="overflow-hidden bg-[linear-gradient(97deg,var(--sama-cream),white)]" aria-labelledby="first-step-title">
      <div className="mx-auto grid min-h-[384px] max-w-[1200px] grid-cols-1 items-center md:grid-cols-[0.9fr_1.1fr]">
        <div className="z-[1] px-8 py-16 text-center md:pl-20 md:text-left lg:pl-24">
          <h2 id="first-step-title" className="[margin:0] text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.02em] text-sama-forest">
            Ton yéené commence ici
          </h2>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex min-h-[55px] items-center justify-center rounded-full bg-sama-marigold px-9 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sama-forest active:translate-y-px"
          >
            Fais le premier pas
          </Link>
        </div>
        <div className="relative h-80 self-end md:h-full">
          <Image
            src="/figma/e0/first-step-art-large.png"
            alt="Une main indique un coffre d'épargne Sama Naffa"
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
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
      <div className="bg-sama-forest px-6 py-12 text-white">
        <div className="mx-auto grid max-w-[1080px] gap-10 md:grid-cols-[1.2fr_0.55fr_1fr]">
          <div>
            <Image src="/figma/e0/logo-small.png" alt="Sama Naffa" width={104} height={58} className="h-[58px] w-auto object-contain" />
            <p className="[margin:1rem_0_0] max-w-sm text-sm leading-relaxed text-sama-norway">
              Sama Naffa est un service de gestion sous mandat de EVEREST Finance, Société agréée et régulée par l'AMF-UMOA n° SGI/2016-01
            </p>
          </div>
          <nav aria-label="Support">
            <h2 className="[margin:0] text-sm font-semibold">Support</h2>
            <div className="mt-4 flex flex-col gap-2 text-sm text-sama-norway">
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/contact" className="hover:text-white">Réclamations</Link>
            </div>
          </nav>
          <address className="not-italic">
            <h2 className="[margin:0] text-sm font-semibold">Contact</h2>
            <div className="mt-4 space-y-3 text-sm text-sama-norway">
              <a className="flex items-center gap-3 hover:text-white" href="tel:+221338228700"><PhoneIcon className="size-4" />+221 33 822 87 00</a>
              <a className="flex items-center gap-3 hover:text-white" href="mailto:contact@samanaffa.com"><EnvelopeIcon className="size-4" />contact@samanaffa.com</a>
              <p className="[margin:0] flex items-start gap-3"><MapPinIcon className="mt-0.5 size-4 shrink-0" />18 Boulevard de la République<br />Dakar, Sénégal BP: 11659-13000</p>
            </div>
          </address>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1080px] flex-col gap-4 border-t border-white/10 pt-5 text-xs text-sama-forest-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="[margin:0]">© 2026 EVEREST Finance</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white">CGU</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <Link href="/contact" className="hover:text-white">Réclamations</Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-[500px] flex-col items-center justify-center bg-white px-6 py-20 text-center">
        <Image
          src="/figma/e0/logo-large.png"
          alt="Sama Naffa par Everest Finance"
          width={586}
          height={329}
          sizes="(max-width: 640px) 90vw, 586px"
          className="h-auto w-full max-w-[586px] object-contain"
        />
        <h2 className="[margin:1.5rem_0_0] text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-tight tracking-[-0.02em] text-sama-marigold">
          Dencukaay bu jáppandi te woor
        </h2>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <p className="[margin:0] text-sm text-sama-cod-gray">Rejoins-nous sur nos plateformes</p>
          <div className="flex items-center gap-4 text-sama-forest" aria-label="Réseaux sociaux">
            <Facebook className="size-5" aria-label="Facebook" />
            <Instagram className="size-5" aria-label="Instagram" />
            <Music2 className="size-5" aria-label="TikTok" />
            <Youtube className="size-5" aria-label="YouTube" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function E0Landing() {
  return (
    <div className="e0-page overflow-hidden bg-white text-sama-cod-gray">
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      <MarketingHeader />
      <main id="main">
        <Hero />
        <Benefits />
        <Steps />
        <FirstStep />
      </main>
      <LegalFooter />
    </div>
  );
}
