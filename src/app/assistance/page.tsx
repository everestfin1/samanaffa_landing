import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Button from "../../components/common/Button";
import { ArrowLeft, MessageCircle, Mail, Phone, Clock, MapPin, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AssistancePage() {
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
                Centre d&apos;assistance
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Notre équipe d&apos;experts est là pour vous accompagner dans votre parcours d&apos;épargne. 
                Contactez-nous par le canal qui vous convient le mieux.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <MessageCircle className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  WhatsApp
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Réponse immédiate 24h/24
                </p>
                <a
                  href="https://wa.me/221770993382"
                  className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ouvrir WhatsApp
                </a>
              </div>

              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <Mail className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  Email
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Réponse sous 24h
                </p>
                <a
                  href="mailto:support@sama-naffa.sn"
                  className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </a>
              </div>

              <div className="bg-muted rounded-2xl p-8 text-center group hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-foreground">
                  <Phone className="w-8 h-8 text-background group-hover:text-accent" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent-foreground mb-4">
                  Téléphone
                </h3>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90 mb-6">
                  Lun-Ven 8h-18h
                </p>
                <a
                  href="tel:+221XXXXXXXXX"
                  className="inline-flex items-center px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Help */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Aide rapide
              </h2>
              <p className="text-xl text-muted-foreground">
                Solutions aux problèmes les plus fréquents
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  🔐 Problème de connexion
                </h3>
                <p className="text-muted-foreground mb-4">
                  Vérifiez votre numéro de téléphone et votre code de vérification
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  💳 Paiement échoué
                </h3>
                <p className="text-muted-foreground mb-4">
                  Vérifiez votre solde mobile money et réessayez
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  📱 Application lente
                </h3>
                <p className="text-muted-foreground mb-4">
                  Videz le cache de votre navigateur et rechargez la page
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  📄 Documents KYC
                </h3>
                <p className="text-muted-foreground mb-4">
                  Assurez-vous que vos documents sont clairs et lisibles
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  💰 Retrait bloqué
                </h3>
                <p className="text-muted-foreground mb-4">
                  Vérifiez les conditions de retrait de votre profil
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-card-foreground mb-4">
                  🔄 Mise à jour profil
                </h3>
                <p className="text-muted-foreground mb-4">
                  Contactez-nous pour modifier vos informations personnelles
                </p>
                <Button href="/faq" variant="outline" size="sm">
                  Voir la solution
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Envoyez-nous un message
              </h2>
              <p className="text-xl text-muted-foreground">
                Décrivez votre problème et nous vous répondrons rapidement
              </p>
            </div>

            <div className="bg-muted rounded-3xl p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                      placeholder="+221 XX XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Sujet
                  </label>
                  <select className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent">
                    <option>Problème technique</option>
                    <option>Question sur l&apos;épargne</option>
                    <option>Question sur l&apos;APE</option>
                    <option>Problème de paiement</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent resize-none"
                    placeholder="Décrivez votre problème ou votre question en détail..."
                  ></textarea>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    En envoyant ce message, vous acceptez nos conditions d&apos;utilisation
                  </span>
                </div>

                <div className="text-center">
                  <Button size="lg" className="inline-flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Office Hours & Location */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  Horaires et localisation
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Horaires d&apos;ouverture
                      </h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lundi - Vendredi : 8h00 - 18h00</p>
                        <p>Samedi : 9h00 - 13h00</p>
                        <p>Dimanche : Fermé</p>
                        <p className="text-sm text-accent font-medium">
                          Support WhatsApp 24h/24
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Adresse
                      </h3>
                      <div className="text-muted-foreground">
                        <p>Immeuble Sama Naffa</p>
                        <p>Rue de la République</p>
                        <p>Dakar, Sénégal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-6">
                  Temps de réponse
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">WhatsApp</span>
                    <span className="font-semibold text-card-foreground">Immédiat</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold text-card-foreground">Sous 24h</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Téléphone</span>
                    <span className="font-semibold text-card-foreground">Immédiat</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Formulaire</span>
                    <span className="font-semibold text-card-foreground">Sous 48h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Besoin d&apos;aide immédiate ?
            </h2>
            <p className="text-xl text-background/80 mb-8">
              Contactez-nous maintenant par WhatsApp pour une assistance instantanée
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="https://wa.me/221770993382"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Ouvrir WhatsApp
              </Button>
              <Button href="/faq" variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                Consulter la FAQ
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
