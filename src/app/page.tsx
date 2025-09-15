import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Hero from "../components/hero/Hero";
import Simulator from "../components/simulator/Simulator";
import { personas } from "../content/personas";
import PersonaCard from "../components/cards/PersonaCard";
import { CheckCircle, Users, Award, Shield } from "lucide-react";
import Button from "@/components/common/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Why Sama Naffa Section */}
        <section id="pourquoi" className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Pourquoi choisir Sama Naffa ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Découvrez les avantages qui font de nous la référence de l&apos;épargne digitale au Sénégal
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <div className="text-center group">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Sécurité maximale
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Conformité BCEAO et protocoles de sécurité bancaires pour protéger vos fonds
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Confirmation immédiate
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Validation instantanée de vos transactions avec notifications WhatsApp
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Communauté active
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rejoignez plus de 10 000 épargnants satisfaits et partagez vos succès
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Taux préférentiels
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bénéficiez des meilleurs taux d&apos;intérêt selon votre profil et durée
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-foreground rounded-3xl p-12 text-background">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-5xl font-bold mb-3">10,000+</div>
                  <div className="text-background/80 text-lg font-medium">Épargnants actifs</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-3">2.5Mdt</div>
                  <div className="text-background/80 text-lg font-medium">D&apos;épargne gérée</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-3">98%</div>
                  <div className="text-background/80 text-lg font-medium">Taux de satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simulator Section */}
        <Simulator />

        {/* Personas Preview Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Épargnez selon votre profil
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Découvrez nos programmes d&apos;épargne personnalisés adaptés à votre situation et objectifs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {personas.slice(0, 3).map((persona) => (
                <PersonaCard key={persona.slug} persona={persona} />
              ))}
            </div>

            <div className="text-center">
              <Button href="/personas" variant="outline" size="lg">
                Voir tous les profils
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez les témoignages de notre communauté d&apos;épargnants
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-muted rounded-2xl p-8 group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center mr-4 group-hover:bg-accent-foreground">
                    <span className="text-background font-bold text-lg group-hover:text-accent">MF</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground group-hover:text-accent-foreground">Marie Faye</div>
                    <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/70">Étudiante</div>
                  </div>
                </div>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 italic leading-relaxed">
                  &quot;Grâce à Sama Naffa, j&apos;ai pu financer mes études facilement.
                  Le processus est simple et les intérêts sont très intéressants.&quot;
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8 group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center mr-4 group-hover:bg-accent-foreground">
                    <span className="text-background font-bold text-lg group-hover:text-accent">AD</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground group-hover:text-accent-foreground">Amadou Diallo</div>
                    <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/70">Entrepreneur</div>
                  </div>
                </div>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 italic leading-relaxed">
                  &quot;La plateforme est parfaite pour les entrepreneurs comme moi.
                  J&apos;ai pu constituer un fond d&apos;urgence rapidement et simplement.&quot;
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8 group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-foreground rounded-2xl flex items-center justify-center mr-4 group-hover:bg-accent-foreground">
                    <span className="text-background font-bold text-lg group-hover:text-accent">KS</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground group-hover:text-accent-foreground">Khadija Sy</div>
                    <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/70">Fonctionnaire</div>
                  </div>
                </div>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 italic leading-relaxed">
                  &quot;Service fiable et sécurisé. Les retraits sont faciles et
                  les intérêts s&apos;accumulent régulièrement. Je recommande !&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section id="faq" className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Questions fréquentes
              </h2>
              <p className="text-xl text-muted-foreground">
                Tout ce que vous devez savoir sur Sama Naffa
              </p>&quot;
            </div>

            <div className="space-y-6">
              <details className="bg-card rounded-2xl p-8 shadow-sm border border-border group">
                <summary className="font-bold text-card-foreground cursor-pointer text-lg group-hover:text-accent transition-colors duration-300">
                  Comment ouvrir un compte d&apos;épargne ?
                </summary>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  Ouvrir un compte est simple : choisissez votre profil, remplissez le formulaire KYC,
                  effectuez votre premier versement. Tout se fait en ligne en quelques minutes.&quot;
                </p>
              </details>

              <details className="bg-card rounded-2xl p-8 shadow-sm border border-border group">
                <summary className="font-bold text-card-foreground cursor-pointer text-lg group-hover:text-accent transition-colors duration-300">
                  Mes fonds sont-ils sécurisés ?
                </summary>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  Absolument ! Nous sommes conformes aux normes BCEAO et travaillons avec des
                  partenaires bancaires de confiance. Vos fonds sont garantis et sécurisés.&quot;
                </p>
              </details>

              <details className="bg-card rounded-2xl p-8 shadow-sm border border-border group">
                <summary className="font-bold text-card-foreground cursor-pointer text-lg group-hover:text-accent transition-colors duration-300">
                  Comment effectuer des retraits ?
                </summary>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  Les retraits peuvent être effectués à tout moment selon les conditions de votre profil.
                  Ils sont traités instantanément via mobile money ou virement bancaire.&quot;
                </p>
              </details>
            </div>

            <div className="text-center mt-12">
              <Button href="/faq" size="lg">
                Voir toutes les questions
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
