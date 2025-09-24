"use client";

import { useState, Suspense } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Button from "../../components/common/Button";
import { ArrowLeft, CheckCircle, Upload, CreditCard, User, Target, Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OuvrirCompteContent() {
  const searchParams = useSearchParams();
  const persona = searchParams.get('persona');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Savings Plan
    monthlyAmount: persona === 'etudiant' ? '25000' : persona === 'entrepreneur' ? '100000' : '50000',
    duration: persona === 'etudiant' ? '12' : persona === 'entrepreneur' ? '18' : '12',
    
    // Documents
    identityDocument: null as File | string | null,
    selfie: null as File | string | null,
    
    // Payment Method
    paymentMethod: 'mobile_money',
  });

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Plan d\'épargne', icon: Target },
    { id: 3, title: 'Documents', icon: Upload },
    { id: 4, title: 'Paiement', icon: CreditCard },
  ];

  const monthlyAmounts = [
    { value: '10000', label: '10 000 FCFA' },
    { value: '25000', label: '25 000 FCFA' },
    { value: '50000', label: '50 000 FCFA' },
    { value: '100000', label: '100 000 FCFA' },
    { value: '200000', label: '200 000 FCFA' },
    { value: '500000', label: '500 000 FCFA' },
  ];

  const durations = [
    { value: '3', label: '3 mois', rate: '3.0%' },
    { value: '6', label: '6 mois', rate: '3.0%' },
    { value: '12', label: '12 mois', rate: '3.0%' },
    { value: '18', label: '18 mois', rate: '4.5%' },
    { value: '24', label: '24 mois', rate: '4.5%' },
    { value: '36', label: '36 mois', rate: '5.5%' },
    { value: '60', label: '60 mois', rate: '5.5%' },
  ];

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateProjectedReturn = () => {
    const amount = parseInt(formData.monthlyAmount);
    const months = parseInt(formData.duration);
    
    // Simple interest calculation for projection
    const monthlyRate = months < 12 ? 0.03/12 : months < 24 ? 0.045/12 : 0.055/12;
    const totalAmount = amount * months;
    const interest = totalAmount * monthlyRate * months;
    const finalAmount = totalAmount + interest;
    
    return {
      totalAmount: Math.round(totalAmount),
      interest: Math.round(interest),
      finalAmount: Math.round(finalAmount),
      monthlyRate: (monthlyRate * 12 * 100).toFixed(1)
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const projectedReturn = calculateProjectedReturn();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="py-12 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href={persona ? "/personas" : "/simulateur"}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour {persona ? "aux profils" : "au simulateur"}
              </Link>
              
              <h1 className="text-4xl font-bold text-card-foreground mb-4">
                Ouvrir mon Naffa d&apos;épargne
              </h1>
              <p className="text-lg text-muted-foreground">
                {persona 
                  ? `Créez votre compte d'épargne personnalisé en quelques étapes simples`
                  : `Configurez votre plan d'épargne selon vos objectifs`
                }
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-px mx-4 ${
                      currentStep > step.id ? 'bg-foreground' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-12 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-3xl p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Informations personnelles
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="Votre prénom"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="+221 XX XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full md:w-1/2 p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Savings Plan */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Plan d&apos;épargne
                  </h2>
                  
                  <div className="bg-muted rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Versement mensuel *
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {monthlyAmounts.map((amount) => (
                        <button
                          key={amount.value}
                          onClick={() => handleInputChange('monthlyAmount', amount.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.monthlyAmount === amount.value
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-background text-card-foreground hover:border-accent'
                          }`}
                        >
                          <div className="font-semibold">{amount.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Durée d&apos;épargne *
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {durations.map((duration) => (
                        <button
                          key={duration.value}
                          onClick={() => handleInputChange('duration', duration.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.duration === duration.value
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-background text-card-foreground hover:border-accent'
                          }`}
                        >
                          <div className="font-semibold">{duration.label}</div>
                          <div className="text-xs opacity-80">{duration.rate}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Projection Display */}
                  <div className="bg-foreground rounded-2xl p-6 text-background">
                    <h3 className="text-lg font-semibold mb-4">Projection de votre épargne</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(parseInt(formData.monthlyAmount))}</div>
                        <div className="text-sm opacity-80">Versement mensuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{projectedReturn.monthlyRate}%</div>
                        <div className="text-sm opacity-80">Taux annuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(projectedReturn.finalAmount)}</div>
                        <div className="text-sm opacity-80">Montant final</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-semibold text-accent">
                        +{formatCurrency(projectedReturn.interest)} d&apos;intérêts
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Documents d&apos;identité
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-muted rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Pièce d&apos;identité *
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Carte d&apos;identité nationale, passeport ou permis de conduire
                      </p>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          {formData.identityDocument ? (typeof formData.identityDocument === 'string' ? formData.identityDocument : formData.identityDocument.name) : 'Cliquez pour télécharger'}
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleInputChange('identityDocument', e.target.files?.[0] || "")}
                          className="hidden"
                          id="identity-upload"
                        />
                        <label
                          htmlFor="identity-upload"
                          className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-lg cursor-pointer hover:bg-accent transition-colors duration-300"
                        >
                          Choisir un fichier
                        </label>
                      </div>
                    </div>

                    <div className="bg-muted rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Photo de profil (selfie) *
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Prenez un selfie clair pour la vérification d&apos;identité
                      </p>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          {formData.selfie ? (typeof formData.selfie === 'string' ? formData.selfie : formData.selfie.name) : 'Cliquez pour prendre une photo'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          capture="user"
                          onChange={(e) => handleInputChange('selfie', e.target.files?.[0] || "")}
                          className="hidden"
                          id="selfie-upload"
                        />
                        <label
                          htmlFor="selfie-upload"
                          className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-lg cursor-pointer hover:bg-accent transition-colors duration-300"
                        >
                          Prendre une photo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Premier versement
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-muted rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Mode de paiement *
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-accent transition-colors duration-300">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="mobile_money"
                            checked={formData.paymentMethod === 'mobile_money'}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="w-4 h-4 text-foreground"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                              <span className="text-background text-lg">📱</span>
                            </div>
                            <div>
                              <div className="font-semibold text-card-foreground">Mobile Money</div>
                              <div className="text-sm text-muted-foreground">Orange Money, Free Money, MTN Money</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-foreground rounded-2xl p-6 text-background">
                      <h3 className="text-lg font-semibold mb-4">Récapitulatif de votre épargne</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Versement mensuel</span>
                          <span className="font-semibold">{formatCurrency(parseInt(formData.monthlyAmount))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durée</span>
                          <span className="font-semibold">{formData.duration} mois</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux annuel</span>
                          <span className="font-semibold">{projectedReturn.monthlyRate}%</span>
                        </div>
                        <div className="border-t border-background/20 pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Montant final projeté</span>
                            <span>{formatCurrency(projectedReturn.finalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-muted rounded-2xl p-6">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="w-4 h-4 text-foreground mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground">
                          J&apos;accepte les <a href="#" className="text-foreground hover:text-accent underline">conditions générales</a> et la <a href="#" className="text-foreground hover:text-accent underline">politique de confidentialité</a> de Sama Naffa. Je confirme avoir lu et compris les termes de mon plan d&apos;épargne.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                >
                  Précédent
                </Button>
                
                {currentStep < steps.length ? (
                  <Button onClick={nextStep}>
                    Suivant
                  </Button>
                ) : (
                  <Button href="/succes" size="lg">
                    <Shield className="w-4 h-4 mr-2" />
                    Ouvrir mon Naffa
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function OuvrirComptePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <OuvrirCompteContent />
    </Suspense>
  );
}
