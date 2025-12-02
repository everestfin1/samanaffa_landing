import { ChevronRightIcon } from "lucide-react";
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { CountrySelector } from '../../../components/ui/country-selector';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { FormData, FormErrors } from "../../../hooks/useContactForm";

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

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
}: ContactFormProps) => {
  const getFieldError = (field: keyof FormData) => errors[field];
  const inputErrorClasses = (field: keyof FormData) =>
    getFieldError(field) ? "border-red-500 focus-visible:ring-red-500" : "";
  const errorId = (field: keyof FormData) => `${field}-error`;

  return (
    <section id="contact-form" className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-semibold mb-2 animate-fade-in-up">
            <span className="text-[#b3830f]">
              Épargne sécurisée et rentable,
            </span>
            <span className="text-black"> simplifiez-vous </span>
          </h2>
          <p className="text-center text-[#01081b] text-lg lg:text-2xl font-light mb-6 lg:mb-10 animate-fade-in-up animation-delay-200">
            Remplissez le formulaire de contact
          </p>
        </div> */}
        <Card className="w-full max-w-4xl mx-auto rounded-[35px] border border-solid border-neutral-300 bg-white animate-fade-in-up animation-delay-400">
          <CardContent className="p-6 lg:p-12">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-6">
                <Label className="font-bold text-[#4d4958] text-sm mb-2">
                  Civilité*
                </Label>
                <RadioGroup 
                  value={formData.civilite} 
                  onValueChange={(value) => updateFormData('civilite', value as 'Mr' | 'Mme')}
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
                    aria-invalid={!!getFieldError('prenom')}
                    aria-describedby={getFieldError('prenom') ? errorId('prenom') : undefined}
                    value={formData.prenom}
                    onChange={(e) => updateFormData('prenom', e.target.value)}
                    placeholder="Saisissez votre prénom"
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('prenom')}`}
                    required
                  />
                  {getFieldError('prenom') && (
                    <p id={errorId('prenom')} className="mt-1 text-sm text-red-600">
                      {getFieldError('prenom')}
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
                    aria-invalid={!!getFieldError('nom')}
                    aria-describedby={getFieldError('nom') ? errorId('nom') : undefined}
                    value={formData.nom}
                    onChange={(e) => updateFormData('nom', e.target.value)}
                    placeholder="Saisissez votre nom"
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('nom')}`}
                    required
                  />
                  {getFieldError('nom') && (
                    <p id={errorId('nom')} className="mt-1 text-sm text-red-600">
                      {getFieldError('nom')}
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
                  onValueChange={(value) => updateFormData('categorie_socioprofessionnelle', value)}
                >
                  <SelectTrigger
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('categorie_socioprofessionnelle')}`}
                    aria-invalid={!!getFieldError('categorie_socioprofessionnelle')}
                    aria-describedby={getFieldError('categorie_socioprofessionnelle') ? errorId('categorie_socioprofessionnelle') : undefined}
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
                {getFieldError('categorie_socioprofessionnelle') && (
                  <p id={errorId('categorie_socioprofessionnelle')} className="mt-1 text-sm text-red-600">
                    {getFieldError('categorie_socioprofessionnelle')}
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
                      onValueChange={(value) => updateFormData('pays_residence', value)}
                      placeholder="Sélectionnez votre pays"
                      searchPlaceholder="Rechercher un pays..."
                      emptyMessage="Aucun pays trouvé."
                      error={!!getFieldError('pays_residence')}
                    />
                  </div>
                  {getFieldError('pays_residence') && (
                    <p id={errorId('pays_residence')} className="mt-1 text-sm text-red-600">
                      {getFieldError('pays_residence')}
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
                    aria-invalid={!!getFieldError('ville')}
                    aria-describedby={getFieldError('ville') ? errorId('ville') : undefined}
                    value={formData.ville}
                    onChange={(e) => updateFormData('ville', e.target.value)}
                    placeholder="Saisissez votre ville"
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('ville')}`}
                    required
                  />
                  {getFieldError('ville') && (
                    <p id={errorId('ville')} className="mt-1 text-sm text-red-600">
                      {getFieldError('ville')}
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
                    aria-invalid={!!getFieldError('telephone')}
                    aria-describedby={getFieldError('telephone') ? errorId('telephone') : undefined}
                    value={getDisplayPhoneValue()}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={selectedCountryData?.phoneCode || "+221"}
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('telephone')}`}
                    required
                  />
                  {getFieldError('telephone') && (
                    <p id={errorId('telephone')} className="mt-1 text-sm text-red-600">
                      {getFieldError('telephone')}
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
                    aria-invalid={!!getFieldError('email')}
                    aria-describedby={getFieldError('email') ? errorId('email') : undefined}
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="exemple@email.com"
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('email')}`}
                    required
                  />
                  {getFieldError('email') && (
                    <p id={errorId('email')} className="mt-1 text-sm text-red-600">
                      {getFieldError('email')}
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
                    onValueChange={(value) => updateFormData('tranche_interesse', value)}
                  >
                    <SelectTrigger className="h-14 mt-2 bg-shapes-02 text-base">
                      <SelectValue placeholder="Sélectionnez une tranche" />
                    </SelectTrigger>
                    <SelectContent>
                      {tranches.map((tranche) => (
                        <SelectItem key={tranche.id} value={`Tranche ${tranche.id}`}>
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
                    aria-invalid={!!getFieldError('montant_cfa')}
                    aria-describedby={getFieldError('montant_cfa') ? errorId('montant_cfa') : undefined}
                    value={formData.montant_cfa}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Ex: Minimum 10 000 FCFA"
                    className={`h-14 mt-2 bg-shapes-02 text-base ${inputErrorClasses('montant_cfa')}`}
                    required
                  />
                  {getFieldError('montant_cfa') && (
                    <p id={errorId('montant_cfa')} className="mt-1 text-sm text-red-600">
                      {getFieldError('montant_cfa')}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 h-16 cta-secondary rounded font-normal text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi...' : 'Envoyer'}
                <ChevronRightIcon className="ml-2 h-4 w-4 arrow-bounce" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}; 