import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PersonaCard from "../../components/cards/PersonaCard";
import { personas } from "../../content/personas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "../../components/common/Button";

export default function PersonasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
              <h1 className="text-5xl font-bold text-card-foreground mb-6">
                Choisissez votre profil d&apos;épargne
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Découvrez nos programmes d&apos;épargne personnalisés conçus pour répondre à vos besoins spécifiques et objectifs financiers
              </p>
            </div>

            {/* Personas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {personas.map((persona) => (
                <PersonaCard key={persona.slug} persona={persona} />
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-muted rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Vous ne trouvez pas votre profil ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Utilisez notre simulateur universel pour créer un plan d&apos;épargne personnalisé selon vos propres paramètres
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/simulateur" size="lg">
                  Utiliser le simulateur
                </Button>
                <Button href="/assistance" variant="outline" size="lg">
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Pourquoi choisir un profil personnalisé ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Chaque profil est conçu avec des avantages spécifiques et des taux optimisés
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Objectifs adaptés
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Des programmes conçus pour vos objectifs spécifiques, qu&apos;il s&apos;agisse d&apos;études, d&apos;entrepreneuriat ou de retraite
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Taux préférentiels
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bénéficiez de taux d&apos;intérêt optimisés selon votre profil et la durée de votre épargne
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Sécurité garantie
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tous nos profils respectent les normes BCEAO et offrent une sécurité maximale pour vos fonds
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
