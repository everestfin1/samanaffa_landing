import Link from "next/link";
import { ArrowRight, Shield, Zap, Smartphone } from "lucide-react";
import Button from "../common/Button";

export default function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Épargner pour vos projets,
            <span className="block text-accent mt-2">facilement et en toute sécurité</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Ouvrez un compte d&apos;épargne ou souscrivez à un APE en 3 clics maximum.
            Confirmation immédiate avec preuve de confiance BCEAO.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-background" />
              </div>
              <span className="font-medium">Conforme BCEAO</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="font-medium">3 clics maximum</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-background" />
              </div>
              <span className="font-medium">100% Mobile</span>
            </div>
          </div>

          {/* Main CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Savings Card */}
            <Link
              href="/personas"
              className="group bg-card rounded-3xl p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">
                  Épargner selon mon profil
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Découvrez votre programme d&apos;épargne personnalisé adapté à vos objectifs
                </p>
                <div className="flex items-center justify-center text-foreground font-semibold group-hover:text-accent transition-colors duration-300">
                  Commencer
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* APE Card */}
            <Link
              href="/ape"
              className="group bg-card rounded-3xl p-10 shadow-sm border border-border hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <span className="text-4xl">📈</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">
                  Souscrire à l&apos;APE
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Investissez dans l&apos;Actionnariat Populaire Economique avec rendement garanti
                </p>
                <div className="flex items-center justify-center text-foreground font-semibold group-hover:text-accent transition-colors duration-300">
                  Découvrir
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/simulateur" variant="outline" size="lg">
              Tester le simulateur
            </Button>
            <Button href="#pourquoi" variant="secondary" size="lg">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>

      {/* Elegant Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </section>
  );
}
