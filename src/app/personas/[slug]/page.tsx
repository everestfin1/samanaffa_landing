import { notFound } from "next/navigation";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import Button from "../../../components/common/Button";
import { personas, getPersonaBySlug } from "../../../content/personas";
import { project, getFormattedRate, getRateDescription } from "../../../lib/rates";
import { ArrowLeft, CheckCircle, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

interface PersonaDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PersonaDetailPage({ params }: PersonaDetailPageProps) {
  const persona = getPersonaBySlug(params.slug);

  if (!persona) {
    notFound();
  }

  const projectedAmount = project(persona.defaults.amount, persona.defaults.months);
  const totalInterest = projectedAmount - (persona.defaults.amount * persona.defaults.months);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <Link
                href="/personas"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux profils
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">{persona.icon}</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-card-foreground mb-2">
                      {persona.name}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      {getFormattedRate(persona.defaults.months)} annuel
                    </p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {persona.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button href="/ouvrir-compte" size="lg">
                    Ouvrir mon compte
                  </Button>
                  <Button href="/simulateur" variant="outline" size="lg">
                    Simuler mes gains
                  </Button>
                </div>
              </div>

              {/* Projection Card */}
              <div className="bg-muted rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Projection de votre épargne
                </h3>

                <div className="space-y-6">
                  <div className="bg-card rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-background" />
                      </div>
                      <span className="font-semibold text-card-foreground">Montant final</span>
                    </div>
                    <div className="text-3xl font-bold text-card-foreground">
                      {formatCurrency(projectedAmount)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1">Versement mensuel</div>
                      <div className="text-lg font-bold text-card-foreground">
                        {formatCurrency(persona.defaults.amount)}
                      </div>
                    </div>
                    <div className="bg-card rounded-xl p-4">
                      <div className="text-sm text-muted-foreground mb-1">Durée</div>
                      <div className="text-lg font-bold text-card-foreground">
                        {persona.defaults.months} mois
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Intérêts gagnés</span>
                      <span className="text-xl font-bold text-accent">
                        +{formatCurrency(totalInterest)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Avantages du profil {persona.name}
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez les privilèges et avantages exclusifs de ce programme
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {persona.benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center group-hover:bg-accent-foreground">
                      <CheckCircle className="w-4 h-4 text-background group-hover:text-accent" />
                    </div>
                    <span className="font-semibold text-card-foreground group-hover:text-accent-foreground">
                      Avantage {index + 1}
                    </span>
                  </div>
                  <p className="text-muted-foreground group-hover:text-accent-foreground/90">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* Target Goals */}
            <div className="bg-card rounded-3xl p-12">
              <h3 className="text-3xl font-bold text-card-foreground mb-8 text-center">
                Objectifs ciblés
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {persona.targetGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-accent-foreground text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-card-foreground font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Rate Information */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-muted rounded-3xl p-12 text-center">
              <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-3xl font-bold text-card-foreground mb-4">
                Taux d&apos;intérêt
              </h3>
              <div className="text-6xl font-bold text-accent mb-4">
                {getFormattedRate(persona.defaults.months)}
              </div>
              <p className="text-lg text-muted-foreground mb-8">
                {getRateDescription(persona.defaults.months)}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ce taux s&apos;applique à votre épargne mensuelle de {formatCurrency(persona.defaults.amount)} 
                sur une durée de {persona.defaults.months} mois, vous permettant d&apos;atteindre 
                {formatCurrency(projectedAmount)} au total.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à commencer votre épargne ?
            </h2>
            <p className="text-xl text-background/80 mb-8">
              Ouvrez votre compte en quelques minutes et commencez à épargner dès aujourd&apos;hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/ouvrir-compte" size="lg" className="bg-background text-foreground hover:bg-background/90">
                Ouvrir mon compte maintenant
              </Button>
              <Button href="/assistance" variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                Poser une question
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return personas.map((persona) => ({
    slug: persona.slug,
  }));
}
