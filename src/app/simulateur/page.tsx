import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Simulator from "../../components/simulator/Simulator";
import { ArrowLeft, Calculator, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Button from "../../components/common/Button";

export default function SimulatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-foreground" />
                </div>
                <h1 className="text-5xl font-bold text-card-foreground">
                  Simulateur d&apos;épargne
                </h1>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Testez différents scénarios d&apos;épargne et découvrez le potentiel de vos investissements 
                avec notre simulateur interactif en temps réel
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Calculs en temps réel
                </h3>
                <p className="text-muted-foreground text-sm">
                  Visualisez instantanément l&apos;impact de vos choix sur vos gains
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Taux réels BCEAO
                </h3>
                <p className="text-muted-foreground text-sm">
                  Basé sur les taux d&apos;intérêt officiels et conformes aux normes
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Simulation instantanée
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ajustez vos paramètres et voyez les résultats immédiatement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simulator Component */}
        <Simulator />

        {/* How it works */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Comment ça marche ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Utilisez les curseurs pour ajuster vos paramètres et découvrez vos projections financières
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Ajustez le montant
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Définissez le montant que vous souhaitez épargner chaque mois, 
                  de 10 000 FCFA à 500 000 FCFA
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Choisissez la durée
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sélectionnez la durée de votre épargne, de 3 mois à 10 ans, 
                  et voyez le taux d&apos;intérêt s&apos;adapter automatiquement
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Découvrez vos gains
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualisez votre montant final, vos intérêts gagnés et 
                  votre rendement annuel en temps réel
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Conseils pour optimiser votre épargne
              </h2>
              <p className="text-xl text-muted-foreground">
                Quelques astuces pour maximiser vos gains et atteindre vos objectifs
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  💡 Épargnez régulièrement
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  La régularité est la clé du succès. Même un petit montant épargné chaque mois 
                  peut générer des intérêts significatifs sur le long terme grâce à l&apos;effet des intérêts composés.
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  ⏰ Plus c&apos;est long, mieux c&apos;est
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Les taux d&apos;intérêt augmentent avec la durée. Un plan d&apos;épargne de 3 ans 
                  vous rapportera plus qu&apos;un plan de 1 an, même avec le même montant mensuel.
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  🎯 Fixez-vous des objectifs clairs
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Avoir un objectif précis (études, achat immobilier, retraite) vous aide à 
                  rester motivé et à ajuster vos versements selon vos besoins.
                </p>
              </div>
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
              Une fois que vous avez trouvé le plan qui vous convient, ouvrez votre compte en quelques clics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/personas" size="lg" className="bg-background text-foreground hover:bg-background/90">
                Voir les profils d&apos;épargne
              </Button>
              <Button href="/assistance" variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                Besoin d&apos;aide ?
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
