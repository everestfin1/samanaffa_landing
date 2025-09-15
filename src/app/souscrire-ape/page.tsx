"use client";

import { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import { ArrowLeft, CheckCircle, Upload, CreditCard, Building, FileText, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SouscrireAPEPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: 'SN',
    profession: '',
    
    // Address Information
    address: '',
    city: '',
    postalCode: '',
    
    // APE Investment
    investmentAmount: '500000',
    investmentDuration: '5',
    reinvestmentMode: 'compound',
    
    // Payment Method
    paymentMethod: 'mobile_money',
    bankAccount: '',
    
    // Documents
    identityDocument: null as File | string | null,
    proofOfAddress: null as File | string | null,
    selfie: null as File | string | null,
  });

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: FileText },
    { id: 2, title: 'Investissement APE', icon: TrendingUp },
    { id: 3, title: 'Documents', icon: Upload },
    { id: 4, title: 'Paiement', icon: CreditCard },
  ];

  const investmentAmounts = [
    { value: '50000', label: '50 000 FCFA' },
    { value: '100000', label: '100 000 FCFA' },
    { value: '250000', label: '250 000 FCFA' },
    { value: '500000', label: '500 000 FCFA' },
    { value: '1000000', label: '1 000 000 FCFA' },
  ];

  const investmentDurations = [
    { value: '5', label: '5 ans', rate: '7.5%' },
    { value: '7', label: '7 ans', rate: '8.0%' },
    { value: '10', label: '10 ans', rate: '8.5%' },
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
    const amount = parseInt(formData.investmentAmount);
    const years = parseInt(formData.investmentDuration);
    const rate = years === 5 ? 0.075 : years === 7 ? 0.08 : 0.085;
    
    const totalReturn = amount * Math.pow(1 + rate, years);
    const interest = totalReturn - amount;
    
    return {
      totalReturn: Math.round(totalReturn),
      interest: Math.round(interest),
      rate: (rate * 100).toFixed(1)
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
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-12 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/ape"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;APE
              </Link>
              
              <h1 className="text-4xl font-bold text-card-foreground mb-4">
                Souscrire à l&apos;APE
              </h1>
              <p className="text-lg text-muted-foreground">
                Investissez dans l&apos;avenir du Sénégal avec l&apos;Actionnariat Populaire Economique
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

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Nationalité *
                      </label>
                      <select
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                      >
                        <option value="SN">Sénégalais</option>
                        <option value="OTHER">Autre</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Profession *
                      </label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="Votre profession"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-card-foreground mb-2">
                      Adresse complète *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent resize-none"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="Votre ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-card-foreground mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                        placeholder="Code postal"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: APE Investment */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Paramètres d&apos;investissement APE
                  </h2>
                  
                  <div className="bg-muted rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Montant d&apos;investissement *
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {investmentAmounts.map((amount) => (
                        <button
                          key={amount.value}
                          onClick={() => handleInputChange('investmentAmount', amount.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.investmentAmount === amount.value
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
                      Durée d&apos;investissement *
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {investmentDurations.map((duration) => (
                        <button
                          key={duration.value}
                          onClick={() => handleInputChange('investmentDuration', duration.value)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                            formData.investmentDuration === duration.value
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-background text-card-foreground hover:border-accent'
                          }`}
                        >
                          <div className="font-bold text-lg">{duration.label}</div>
                          <div className="text-sm opacity-80">{duration.rate} annuel</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Mode de réinvestissement *
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="reinvestmentMode"
                          value="compound"
                          checked={formData.reinvestmentMode === 'compound'}
                          onChange={(e) => handleInputChange('reinvestmentMode', e.target.value)}
                          className="w-4 h-4 text-foreground"
                        />
                        <div>
                          <div className="font-medium text-card-foreground">Réinvestissement automatique</div>
                          <div className="text-sm text-muted-foreground">Intérêts composés pour maximiser vos gains</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="reinvestmentMode"
                          value="annual"
                          checked={formData.reinvestmentMode === 'annual'}
                          onChange={(e) => handleInputChange('reinvestmentMode', e.target.value)}
                          className="w-4 h-4 text-foreground"
                        />
                        <div>
                          <div className="font-medium text-card-foreground">Paiement annuel des intérêts</div>
                          <div className="text-sm text-muted-foreground">Intérêts versés chaque année sur votre mobile money</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Projection Display */}
                  <div className="bg-foreground rounded-2xl p-6 text-background">
                    <h3 className="text-lg font-semibold mb-4">Projection de votre investissement</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(parseInt(formData.investmentAmount))}</div>
                        <div className="text-sm opacity-80">Montant investi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{projectedReturn.rate}%</div>
                        <div className="text-sm opacity-80">Taux annuel</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(projectedReturn.totalReturn)}</div>
                        <div className="text-sm opacity-80">Montant final</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-lg font-semibold text-accent">
                        +{formatCurrency(projectedReturn.interest)} de gains
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Documents requis
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
                        Justificatif de domicile *
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Facture d&apos;électricité, d&apos;eau, de téléphone ou quittance de loyer (moins de 3 mois)
                      </p>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          {formData.proofOfAddress ? (typeof formData.proofOfAddress === 'string' ? formData.proofOfAddress : formData.proofOfAddress.name) : 'Cliquez pour télécharger'}
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleInputChange('proofOfAddress', e.target.files?.[0] || "")}
                          className="hidden"
                          id="address-upload"
                        />
                        <label
                          htmlFor="address-upload"
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
                    Mode de paiement
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-muted rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Choisissez votre mode de paiement *
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
                        
                        <label className="flex items-center space-x-4 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-accent transition-colors duration-300">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={formData.paymentMethod === 'bank_transfer'}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className="w-4 h-4 text-foreground"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-background" />
                            </div>
                            <div>
                              <div className="font-semibold text-card-foreground">Virement bancaire</div>
                              <div className="text-sm text-muted-foreground">Transfert depuis votre compte bancaire</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === 'bank_transfer' && (
                      <div className="bg-muted rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-card-foreground mb-4">
                          Informations bancaires
                        </h3>
                        <div>
                          <label className="block text-sm font-semibold text-card-foreground mb-2">
                            Numéro de compte bancaire
                          </label>
                          <input
                            type="text"
                            value={formData.bankAccount}
                            onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                            className="w-full p-4 border border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
                            placeholder="Votre numéro de compte"
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-foreground rounded-2xl p-6 text-background">
                      <h3 className="text-lg font-semibold mb-4">Récapitulatif de votre investissement</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Montant investi</span>
                          <span className="font-semibold">{formatCurrency(parseInt(formData.investmentAmount))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durée</span>
                          <span className="font-semibold">{formData.investmentDuration} ans</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux annuel</span>
                          <span className="font-semibold">{projectedReturn.rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode de réinvestissement</span>
                          <span className="font-semibold">
                            {formData.reinvestmentMode === 'compound' ? 'Automatique' : 'Paiement annuel'}
                          </span>
                        </div>
                        <div className="border-t border-background/20 pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Montant final projeté</span>
                            <span>{formatCurrency(projectedReturn.totalReturn)}</span>
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
                          J&apos;accepte les <a href="#" className="text-foreground hover:text-accent underline">conditions générales</a> et la <a href="#" className="text-foreground hover:text-accent underline">politique de confidentialité</a> de Sama Naffa. Je confirme avoir lu et compris les termes de l&apos;investissement APE.
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
                    Confirmer l&apos;investissement
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
