import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { ArrowLeft, TrendingUp, Shield, Users, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

export default function APEPage() {
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
                  <TrendingUp className="w-8 h-8 text-foreground" />
                </div>
                <h1 className="text-5xl font-bold text-card-foreground">
                  Actionnariat Populaire Economique
                </h1>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Investissez dans l&apos;avenir économique du Sénégal avec l&apos;APE. 
                Un programme d&apos;investissement citoyen qui vous permet de participer 
                au développement national tout en générant des rendements attractifs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/souscrire-ape" size="lg">
                  Souscrire à l&apos;APE
                </Button>
                <Button href="/assistance" variant="outline" size="lg">
                  En savoir plus
                </Button>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center bg-muted rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent mb-2">7.5%</div>
                <div className="text-sm text-muted-foreground">Rendement annuel garanti</div>
              </div>
              <div className="text-center bg-muted rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent mb-2">5 ans</div>
                <div className="text-sm text-muted-foreground">Durée minimum</div>
              </div>
              <div className="text-center bg-muted rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Garantie de l&apos;État</div>
              </div>
              <div className="text-center bg-muted rounded-2xl p-6">
                <div className="text-3xl font-bold text-accent mb-2">50k</div>
                <div className="text-sm text-muted-foreground">Montant minimum (FCFA)</div>
              </div>
            </div>
          </div>
        </section>

        {/* What is APE */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Qu&apos;est-ce que l&apos;APE ?
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  L&apos;Actionnariat Populaire Economique est un programme d&apos;investissement 
                  citoyen lancé par l&apos;État du Sénégal pour permettre à tous les citoyens 
                  de participer au développement économique national.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  En souscrivant à l&apos;APE, vous investissez dans des projets d&apos;infrastructure 
                  et de développement qui contribuent à la croissance du pays, tout en bénéficiant 
                  d&apos;un rendement garanti et sécurisé.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Garantie de l&apos;État</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Rendement garanti</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Impact social</span>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Avantages de l&apos;APE
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Sécurité maximale</h4>
                      <p className="text-muted-foreground text-sm">
                        Garantie totale de l&apos;État sénégalais sur votre investissement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Rendement attractif</h4>
                      <p className="text-muted-foreground text-sm">
                        7.5% de rendement annuel garanti, supérieur aux taux bancaires
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Impact citoyen</h4>
                      <p className="text-muted-foreground text-sm">
                        Contribuez directement au développement économique du Sénégal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Comment souscrire à l&apos;APE ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Un processus simple et sécurisé en 3 étapes pour commencer votre investissement
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Choisissez votre montant
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sélectionnez le montant de votre investissement, à partir de 50 000 FCFA, 
                  et la durée de votre engagement (5 à 10 ans)
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Complétez votre dossier
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Remplissez le formulaire KYC complet et fournissez les documents 
                  d&apos;identité et de domicile requis
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-background text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-4">
                  Effectuez le paiement
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payez via mobile money ou virement bancaire et recevez votre 
                  attestation de souscription immédiatement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Calculator */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Calculez votre rendement APE
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez combien vous pouvez gagner avec l&apos;APE
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-6">
                    Paramètres d&apos;investissement
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Montant investi
                      </label>
                      <select className="w-full p-3 border border-border rounded-xl bg-background text-card-foreground">
                        <option>50 000 FCFA</option>
                        <option>100 000 FCFA</option>
                        <option>250 000 FCFA</option>
                        <option>500 000 FCFA</option>
                        <option>1 000 000 FCFA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Durée d&apos;investissement
                      </label>
                      <select className="w-full p-3 border border-border rounded-xl bg-background text-card-foreground">
                        <option>5 ans</option>
                        <option>7 ans</option>
                        <option>10 ans</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Mode de réinvestissement
                      </label>
                      <select className="w-full p-3 border border-border rounded-xl bg-background text-card-foreground">
                        <option>Réinvestissement des intérêts</option>
                        <option>Paiement annuel des intérêts</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-6">
                    Projection de rendement
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-muted rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Montant investi</span>
                        <span className="font-bold text-card-foreground">500 000 FCFA</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Intérêts gagnés</span>
                        <span className="font-bold text-accent">+187 500 FCFA</span>
                      </div>
                    </div>
                    
                    <div className="bg-foreground rounded-xl p-4 text-background">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Montant final</span>
                        <span className="text-2xl font-bold">687 500 FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button href="/souscrire-ape" size="lg" className="w-full">
                      Souscrire maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-card-foreground mb-6">
                Témoignages d&apos;investisseurs APE
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez les expériences de nos investisseurs APE
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-muted rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mr-4">
                    <span className="text-background font-bold">AS</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground">Aminata Sow</div>
                    <div className="text-sm text-muted-foreground">Fonctionnaire</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  &quot;L&apos;APE m&apos;a permis de sécuriser mon épargne tout en contribuant 
                  au développement du pays. Le rendement est excellent et la garantie 
                  de l&apos;État me rassure complètement.&quot;
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mr-4">
                    <span className="text-background font-bold">MD</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground">Moussa Diop</div>
                    <div className="text-sm text-muted-foreground">Entrepreneur</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  &quot;En tant qu&apos;entrepreneur, l&apos;APE me permet de diversifier mes 
                  investissements avec un produit sûr et rentable. C&apos;est un excellent 
                  complément à mes autres placements.&quot;
                </p>
              </div>

              <div className="bg-muted rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mr-4">
                    <span className="text-background font-bold">FN</span>
                  </div>
                  <div>
                    <div className="font-bold text-card-foreground">Fatou Ndiaye</div>
                    <div className="text-sm text-muted-foreground">Retraitée</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  &quot;L&apos;APE est parfait pour ma retraite. Le rendement régulier me 
                  permet de compléter ma pension et je suis fière de participer 
                  au développement de mon pays.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à investir dans l&apos;avenir du Sénégal ?
            </h2>
            <p className="text-xl text-background/80 mb-8">
              Rejoignez des milliers d&apos;investisseurs qui font confiance à l&apos;APE 
              pour sécuriser leur épargne et contribuer au développement national
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/souscrire-ape" size="lg" className="bg-background text-foreground hover:bg-background/90">
                Souscrire à l&apos;APE maintenant
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
