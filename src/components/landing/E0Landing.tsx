import Image from "next/image";
import Link from "next/link";
import E0AfterFooter from "@/components/landing/E0AfterFooter";
import E0HeroBackground from "@/components/landing/E0HeroBackground";
import E0LegalFooter from "@/components/landing/E0LegalFooter";
import E0MarketingHeader from "@/components/landing/E0MarketingHeader";

const benefits = [
  {
    image: "/figma/e0/calculator.png",
    title: "Nattukaay Yéené",
    description: "Mesure ton projet",
    href: "/sama-naffa",
    width: 138,
    height: 124,
  },
  {
    image: "/figma/e0/savings-hand.png",
    title: "Sama Yéené",
    description: "Fixe ton objectif",
    href: "/login",
    width: 121,
    height: 107,
  },
  {
    image: "/figma/e0/savings-sacks.png",
    title: "Samay Kondanné",
    description: "Suis ton épargne",
    href: "/login",
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
  return <E0MarketingHeader active="accueil" />;
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
        <p className="mt-5 max-w-lg text-base font-normal text-black drop-shadow-sm md:text-xl">
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
        <div className="mt-10 grid grid-cols-1 gap-14 text-center sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="flex flex-col items-center">
              <Link
                href={benefit.href}
                className="e0-benefit-link flex flex-col items-center"
              >
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
                <p className="mt-2 text-lg font-normal text-white">{benefit.description}</p>
              </Link>
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
  return <E0LegalFooter />;
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
