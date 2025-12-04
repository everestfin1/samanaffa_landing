"use client";

import { ChevronRightIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React, { useState, useCallback } from "react";

const MIN_APE_INVESTMENT_CFA = Number(process.env.NEXT_PUBLIC_APE_MIN_INVESTMENT_CFA ?? '10000');
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CountrySelector } from "../ui/country-selector";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { FormData, FormErrors } from "../../hooks/useContactForm";
import type { Country } from "../data/countries";

interface Tranche {
  id: string;
  duration: string;
  rate: number;
}

interface ContactFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  professionalCategories: string[];
  countries: Country[];
  selectedCountryData?: Country;
  getDisplayPhoneValue: () => string;
  handlePhoneChange: (value: string) => void;
  handleAmountChange: (value: string) => void;
  tranches: Tranche[];
  errors: FormErrors;
  submitMessage?: string | null;
  paymentPending?: boolean;
}

export const ContactForm = ({
  formData,
  updateFormData,
  handleFormSubmit,
  isSubmitting,
  professionalCategories,
  countries,
  selectedCountryData,
  getDisplayPhoneValue,
  handlePhoneChange,
  handleAmountChange,
  tranches,
  errors,
  submitMessage,
  paymentPending,
}: ContactFormProps) => {
  const getFieldError = (field: keyof FormData) => errors[field];
  const inputErrorClasses = (field: keyof FormData) =>
    getFieldError(field) ? "border-red-500 focus-visible:ring-red-500" : "";
  const errorId = (field: keyof FormData) => `${field}-error`;

  // Sponsor code verification state
  const [sponsorCodeStatus, setSponsorCodeStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const [sponsorCodeMessage, setSponsorCodeMessage] = useState<string>('');
  const [verificationTimeout, setVerificationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Verify sponsor code with debounce
  const verifySponsorCode = useCallback(async (code: string) => {
    if (!code || code.length < 3) {
      setSponsorCodeStatus('idle');
      setSponsorCodeMessage('');
      return;
    }

    setSponsorCodeStatus('verifying');
    setSponsorCodeMessage('');

    try {
      const response = await fetch('/api/ape/verify-sponsor-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.valid) {
        setSponsorCodeStatus('valid');
        setSponsorCodeMessage(data.message || 'Code valide');
      } else {
        setSponsorCodeStatus('invalid');
        setSponsorCodeMessage(data.error || 'Code invalide');
      }
    } catch (error) {
      setSponsorCodeStatus('invalid');
      setSponsorCodeMessage('Erreur de vérification');
    }
  }, []);

  // Handle sponsor code change with debounce
  const handleSponsorCodeChange = useCallback((value: string) => {
    const upperValue = value.toUpperCase();
    updateFormData("code_parrainage", upperValue);

    // Clear previous timeout
    if (verificationTimeout) {
      clearTimeout(verificationTimeout);
    }

    // Reset status if empty
    if (!upperValue || upperValue.length < 3) {
      setSponsorCodeStatus('idle');
      setSponsorCodeMessage('');
      return;
    }

    // Debounce verification
    const timeout = setTimeout(() => {
      verifySponsorCode(upperValue);
    }, 500);
    setVerificationTimeout(timeout);
  }, [updateFormData, verifySponsorCode, verificationTimeout]);

  // Check if form can be submitted (sponsor code must be valid if provided)
  const canSubmit = !isSubmitting && !paymentPending && 
    (sponsorCodeStatus === 'idle' || sponsorCodeStatus === 'valid' || !formData.code_parrainage);

  return (
    <section id="contact-form" className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-4xl mx-auto rounded-[35px] border border-solid border-neutral-300 bg-white">
          <CardContent className="p-6 lg:p-12">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-6">
                <Label className="font-bold text-[#4d4958] text-sm mb-2">
                  Civilité*
                </Label>
                <RadioGroup
                  value={formData.civilite}
                  onValueChange={(value) =>
                    updateFormData("civilite", value as "Mr" | "Mme")
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mr" id="Mr" />
                    <Label
                      htmlFor="Mr"
                      className="font-medium text-black text-xl lg:text-2xl"
                    >
                      Mr
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mme" id="Mme" />
                    <Label
                      htmlFor="Mme"
                      className="font-medium text-black text-xl lg:text-2xl"
                    >
                      Mme
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label
                    htmlFor="prenom"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Prénom*
                  </Label>
                  <Input
                    id="prenom"
                    aria-invalid={!!getFieldError("prenom")}
                    aria-describedby={
                      getFieldError("prenom") ? errorId("prenom") : undefined
                    }
                    value={formData.prenom}
                    onChange={(e) => updateFormData("prenom", e.target.value)}
                    placeholder="Saisissez votre prénom"
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("prenom")}`}
                    required
                  />
                  {getFieldError("prenom") && (
                    <p
                      id={errorId("prenom")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("prenom")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="nom"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Nom*
                  </Label>
                  <Input
                    id="nom"
                    aria-invalid={!!getFieldError("nom")}
                    aria-describedby={
                      getFieldError("nom") ? errorId("nom") : undefined
                    }
                    value={formData.nom}
                    onChange={(e) => updateFormData("nom", e.target.value)}
                    placeholder="Saisissez votre nom"
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("nom")}`}
                    required
                  />
                  {getFieldError("nom") && (
                    <p id={errorId("nom")} className="mt-1 text-sm text-red-600">
                      {getFieldError("nom")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <Label
                  htmlFor="categorie"
                  className="font-bold text-[#4d4958] text-sm"
                >
                  Catégorie socioprofessionnelle *
                </Label>
                <Select
                  value={formData.categorie_socioprofessionnelle}
                  onValueChange={(value) =>
                    updateFormData("categorie_socioprofessionnelle", value)
                  }
                >
                  <SelectTrigger
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("categorie_socioprofessionnelle")}`}
                    aria-invalid={
                      !!getFieldError("categorie_socioprofessionnelle")
                    }
                    aria-describedby={
                      getFieldError("categorie_socioprofessionnelle")
                        ? errorId("categorie_socioprofessionnelle")
                        : undefined
                    }
                  >
                    <SelectValue placeholder="Sélectionnez votre catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalCategories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("categorie_socioprofessionnelle") && (
                  <p
                    id={errorId("categorie_socioprofessionnelle")}
                    className="mt-1 text-sm text-red-600"
                  >
                    {getFieldError("categorie_socioprofessionnelle")}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label
                    htmlFor="pays"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Pays de résidence*
                  </Label>
                  <div className="mt-2">
                    <CountrySelector
                      countries={countries}
                      value={formData.pays_residence}
                      onValueChange={(value) =>
                        updateFormData("pays_residence", value)
                      }
                      placeholder="Sélectionnez votre pays"
                      searchPlaceholder="Rechercher un pays..."
                      emptyMessage="Aucun pays trouvé."
                      error={!!getFieldError("pays_residence")}
                    />
                  </div>
                  {getFieldError("pays_residence") && (
                    <p
                      id={errorId("pays_residence")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("pays_residence")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="ville"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Ville*
                  </Label>
                  <Input
                    id="ville"
                    aria-invalid={!!getFieldError("ville")}
                    aria-describedby={
                      getFieldError("ville") ? errorId("ville") : undefined
                    }
                    value={formData.ville}
                    onChange={(e) => updateFormData("ville", e.target.value)}
                    placeholder="Saisissez votre ville"
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("ville")}`}
                    required
                  />
                  {getFieldError("ville") && (
                    <p
                      id={errorId("ville")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("ville")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label
                    htmlFor="telephone"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Numéro de téléphone*
                  </Label>
                  <Input
                    id="telephone"
                    aria-invalid={!!getFieldError("telephone")}
                    aria-describedby={
                      getFieldError("telephone")
                        ? errorId("telephone")
                        : undefined
                    }
                    value={getDisplayPhoneValue()}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={selectedCountryData?.phoneCode || "+221"}
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("telephone")}`}
                    required
                  />
                  {getFieldError("telephone") && (
                    <p
                      id={errorId("telephone")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("telephone")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Adresse email*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    aria-invalid={!!getFieldError("email")}
                    aria-describedby={
                      getFieldError("email") ? errorId("email") : undefined
                    }
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="exemple@email.com"
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("email")}`}
                    required
                  />
                  {getFieldError("email") && (
                    <p
                      id={errorId("email")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("email")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label
                    htmlFor="tranche"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Tranche d'intérêt*
                  </Label>
                  <Select
                    value={formData.tranche_interesse}
                    onValueChange={(value) =>
                      updateFormData("tranche_interesse", value)
                    }
                  >
                    <SelectTrigger className="h-14 mt-2 bg-gray-50 text-base">
                      <SelectValue placeholder="Sélectionnez une tranche" />
                    </SelectTrigger>
                    <SelectContent>
                      {tranches.map((tranche) => (
                        <SelectItem
                          key={tranche.id}
                          value={`Tranche ${tranche.id}`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>Tranche {tranche.id}</span>
                            <span className="ml-4 text-sm text-gray-600">
                              {tranche.duration} - {tranche.rate}%
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="montant"
                    className="font-bold text-[#4d4958] text-sm"
                  >
                    Montant en FCFA*
                  </Label>
                  <Input
                    id="montant"
                    type="text"
                    inputMode="numeric"
                    aria-invalid={!!getFieldError("montant_cfa")}
                    aria-describedby={
                      getFieldError("montant_cfa")
                        ? errorId("montant_cfa")
                        : undefined
                    }
                    value={formData.montant_cfa}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={`Ex: Minimum ${MIN_APE_INVESTMENT_CFA.toLocaleString('fr-FR')} FCFA`}
                    className={`h-14 mt-2 bg-gray-50 text-base ${inputErrorClasses("montant_cfa")}`}
                    required
                  />
                  {getFieldError("montant_cfa") && (
                    <p
                      id={errorId("montant_cfa")}
                      className="mt-1 text-sm text-red-600"
                    >
                      {getFieldError("montant_cfa")}
                    </p>
                  )}
                </div>
              </div>

              {/* Code de parrainage */}
              <div className="mb-6">
                <Label
                  htmlFor="code_parrainage"
                  className="font-bold text-[#4d4958] text-sm"
                >
                  Code de parrainage (optionnel)
                </Label>
                <div className="relative">
                  <Input
                    id="code_parrainage"
                    value={formData.code_parrainage}
                    onChange={(e) => handleSponsorCodeChange(e.target.value)}
                    placeholder="Entrez votre code de parrainage"
                    className={`h-14 mt-2 bg-gray-50 text-base pr-12 font-mono uppercase ${
                      sponsorCodeStatus === 'valid' ? 'border-green-500 focus-visible:ring-green-500' :
                      sponsorCodeStatus === 'invalid' ? 'border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  />
                  {/* Verification status indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1">
                    {sponsorCodeStatus === 'verifying' && (
                      <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {sponsorCodeStatus === 'valid' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {sponsorCodeStatus === 'invalid' && (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                {/* Verification message */}
                {sponsorCodeMessage && (
                  <p className={`mt-1 text-sm ${
                    sponsorCodeStatus === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sponsorCodeMessage}
                  </p>
                )}
                {!sponsorCodeMessage && (
                  <p className="mt-1 text-xs text-gray-500">
                    Si vous avez été recommandé par quelqu&apos;un, entrez son code ici.
                  </p>
                )}
              </div>

              {/* Submit message */}
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.includes('succès') || submitMessage.includes('enregistrée')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Payment pending indicator */}
              {paymentPending && (
                <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirection vers le portail de paiement Intouch...
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full sm:w-auto px-10 h-16 bg-[#b3830f] hover:bg-[#9a7010] rounded font-normal text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentPending 
                  ? "Redirection..." 
                  : isSubmitting 
                    ? "Traitement..." 
                    : sponsorCodeStatus === 'verifying'
                      ? "Vérification du code..."
                      : sponsorCodeStatus === 'invalid' && formData.code_parrainage
                        ? "Code de parrainage invalide"
                        : "Procéder au paiement"}
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
