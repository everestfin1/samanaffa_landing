import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Button from "../../components/common/Button";
import { CheckCircle, Download, Share2, MessageCircle, Mail, Phone, ArrowRight, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Success Hero */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-background" />
            </div>
            
            <h1 className="text-5xl font-bold text-card-foreground mb-6">
              Félicitations !
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Votre compte a été créé avec succès. Vous allez recevoir une confirmation 
              par WhatsApp et email dans les prochaines minutes.
            </p>

            <div className="bg-muted rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                Prochaines étapes
              </h2>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-background text-xs font-bold">1</span>
                  </div>
                  <span className="text-muted-foreground">Vérifiez votre email pour activer votre compte</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-background text-xs font-bold">2</span>
                  </div>
                  <span className="text-muted-foreground">Effectuez votre premier versement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-background text-xs font-bold">3</span>
                  </div>
                  <span className="text-muted-foreground">Commencez à épargner régulièrement</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/" size="lg">
                Retour à l&apos;accueil
              </Button>
              <Button href="/assistance" variant="outline" size="lg">
                Besoin d&apos;aide ?
              </Button>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Détails de votre compte
              </h2>
              <p className="text-lg text-muted-foreground">
                Conservez ces informations importantes pour votre référence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="bg-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-6">
                  Informations du compte
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Numéro de compte</span>
                    <span className="font-semibold text-card-foreground">SN-2024-001234</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Type de compte</span>
                    <span className="font-semibold text-card-foreground">Épargne personnalisée</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Date d&apos;ouverture</span>
                    <span className="font-semibold text-card-foreground" suppressHydrationWarning>{new Date().toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-semibold text-accent">Actif</span>
                  </div>
                </div>
              </div>

              {/* Savings Plan */}
              <div className="bg-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-6">
                  Plan d&apos;épargne
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Versement mensuel</span>
                    <span className="font-semibold text-card-foreground">50 000 FCFA</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-semibold text-card-foreground">12 mois</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Taux d&apos;intérêt</span>
                    <span className="font-semibold text-card-foreground">3.0% annuel</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">Prochaine échéance</span>
                    <span className="font-semibold text-card-foreground" suppressHydrationWarning>1er {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'long' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-4">
                Actions disponibles
              </h2>
              <p className="text-lg text-muted-foreground">
                Gérez votre compte et accédez à vos services
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <Download className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  Télécharger l&apos;attestation
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Téléchargez votre attestation d&apos;ouverture de compte
                </p>
                <Button variant="outline" className="w-full group-hover:bg-accent-foreground group-hover:text-accent group-hover:border-accent-foreground">
                  Télécharger PDF
                </Button>
              </div>

              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <Share2 className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  Partager avec des amis
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Invitez vos proches à rejoindre Sama Naffa
                </p>
                <Button variant="outline" className="w-full group-hover:bg-accent-foreground group-hover:text-accent group-hover:border-accent-foreground">
                  Partager
                </Button>
              </div>

              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <TrendingUp className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  Voir mes projections
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Consultez vos projections d&apos;épargne détaillées
                </p>
                <Button variant="outline" className="w-full group-hover:bg-accent-foreground group-hover:text-accent group-hover:border-accent-foreground">
                  Consulter
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Besoin d&apos;aide ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Notre équipe d&apos;assistance est là pour vous accompagner
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Support instantané
                </p>
                <a
                  href="https://wa.me/221XXXXXXXXX"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  +221 XX XX XX XX XX
                </a>
              </div>

              <div className="bg-card rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Email
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Réponse sous 24h
                </p>
                <a
                  href="mailto:support@sama-naffa.sn"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  support@sama-naffa.sn
                </a>
              </div>

              <div className="bg-card rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Téléphone
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Lun-Ven 8h-18h
                </p>
                <a
                  href="tel:+221XXXXXXXXX"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  +221 XX XX XX XX XX
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps CTA */}
        <section className="py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Explorez nos autres services
            </h2>
            <p className="text-xl text-background/80 mb-8">
              Découvrez l&apos;Actionnariat Populaire Economique et d&apos;autres opportunités d&apos;investissement
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                href="/ape"
                className="group bg-background/10 rounded-2xl p-6 hover:bg-background/20 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-background" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">Actionnariat Populaire Economique</h3>
                    <p className="text-sm text-background/80">Investissez dans l&apos;avenir du Sénégal</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-background/60 group-hover:text-background group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>

              <Link
                href="/simulateur"
                className="group bg-background/10 rounded-2xl p-6 hover:bg-background/20 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-background" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold mb-1">Simulateur d&apos;épargne</h3>
                    <p className="text-sm text-background/80">Testez différents scénarios</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-background/60 group-hover:text-background group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
