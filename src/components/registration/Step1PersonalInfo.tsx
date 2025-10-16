"use client";

import {
  UserIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import PhoneInput from "@/components/ui/PhoneInput";

// Employment status options
const employmentStatuses = [
  { value: "salarié", label: "Salarié" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "travailleur-autonome", label: "Travailleur autonome" },
  { value: "étudiant", label: "Étudiant" },
  { value: "stagiaire", label: "Stagiaire" },
  { value: "retraité", label: "Retraité" },
  { value: "sans-emploi", label: "Sans Emploi" },
];

// All metiers options (professions)
const allMetiers = [
  "Administrateur systèmes et réseaux",
  "Ajusteur-monteur",
  "Agent de réservation",
  "Agent de transit",
  "Agent immobilier",
  "Agriculteur / Agricultrice",
  "Analyste en intelligence économique",
  "Analyste financier",
  "Apiculteur / Apicultrice",
  "Arboriculteur / Arboricultrice",
  "Architecte",
  "Architecte de systèmes d'information",
  "Assistant administratif / Secrétaire",
  "Assistant social / Médiateur social",
  "Attaché de presse",
  "Aide-soignant",
  "Aviculteur / Avicultrice",
  "Autres",
  "Bibliothécaire numérique / Archiviste spécialisé",
  "Bûcheron / Bûcheronne",
  "Carriériste",
  "Chargé de communication",
  "Chargé de clientèle",
  "Chaudronnier",
  "Chef cuisinier",
  "Chef de chantier",
  "Chef de secteur",
  "Chercheur scientifique / universitaire",
  "Community manager",
  "Conseiller clientèle bancaire",
  "Conseiller en politiques publiques",
  "Conseiller pédagogique",
  "Consultant en management",
  "Consultant en management de l'innovation",
  "Consultant en stratégie technologique",
  "Consultant en technologies de l'information",
  "Consultant en transformation numérique",
  "Consultant senior en stratégie et gouvernance",
  "Contrôleur qualité",
  "Contrôleur qualité agroalimentaire",
  "Coordinateur logistique / Responsable logistique",
  "Courtier en assurances",
  "Couturier industriel / Modéliste",
  "Data Scientiste / Analyste Big Data",
  "Développeur spécialisé",
  "Développeur web / mobile",
  "Directeur d'hôtel",
  "Directeur d'institut de recherche",
  "Directeur Exécutif",
  "Directeur Général (ou PDG)",
  "Éleveur / Éleveuse",
  "Enseignant / Professeur",
  "Enseignant-chercheur / Professeur universitaire",
  "Expert en analyse stratégique",
  "Expert en cybersécurité",
  "Formateur en compétences technologiques",
  "Formateur professionnel",
  "Forestier",
  "Gestionnaire d'entrepôt",
  "Gestionnaire de l'information",
  "Gestionnaire de portefeuilles",
  "Gestionnaire de projets",
  "Guide touristique",
  "Haut Fonctionnaire / Administrateur Général",
  "Infirmier / Infirmière",
  "Ingénieur civil",
  "Ingénieur de recherche",
  "Ingénieur en agroalimentaire",
  "Ingénieur en production",
  "Journaliste / Rédacteur web",
  "Juriste / Avocat",
  "Logisticien / Responsable logistique",
  "Maraîcher / Maraîchère",
  "Mécanicien d'usinage",
  "Membre de Conseil d'Administration",
  "Métallurgiste",
  "Mineur / Mineuse",
  "Notaire",
  "Opérateur de production",
  "Opérateur de production agroalimentaire",
  "Opérateur en robot industriel",
  "Opérateur en usinage",
  "Opérateur textile",
  "Ouvrier du bâtiment (maçon, charpentier, couvreur, électricien, plombier, menuisier, etc.)",
  "Pêcheur / Pêcheuse (en haute mer, artisanale ou côtière)",
  "Porcher / Porcheresse",
  "Président de Conseil d'Administration",
  "Psychologue / Conseiller en orientation",
  "Réceptionniste hôtelier",
  "Responsable des politiques internationales",
  "Responsable de magasin",
  "Responsable des ressources humaines (DRH)",
  "Responsable marketing",
  "Soudeur / Sou-dresseuse",
  "Sylviculteur / Sylvicultrice",
  "Technicien d'extraction / Exploitant en industries extractives",
  "Technicien de maintenance industrielle",
  "Technicien en chimie",
  "Technicien en génie civil",
  "Technicien en R&D",
  "Technicien informatique",
  "Technico-commercial",
  "Traducteur / Interprète",
  "Vendeur / Vendeuse",
  "Viticulteur / Viticultrice",
  "Sans activité génératrice de revenus",
];

// Function to get filtered metiers based on employment status
const getFilteredMetiers = (statutEmploi: string): string[] => {
  const activeStatuses = [
    "salarié",
    "entrepreneur",
    "travailleur-autonome",
    "étudiant",
    "stagiaire",
  ];

  if (activeStatuses.includes(statutEmploi)) {
    // For active employment statuses, show all metiers except "Sans activité génératrice de revenus"
    return allMetiers.filter(
      (metier) => metier !== "Sans activité génératrice de revenus"
    );
  } else if (statutEmploi === "retraité") {
    // For retired, only show "Sans activité génératrice de revenus"
    return ["Sans activité génératrice de revenus"];
  } else if (statutEmploi === "sans-emploi") {
    // For not seeking employment, only show "Autres"
    return ["Autres"];
  }

  // Default: return all metiers
  return allMetiers;
};

interface FormData {
  civilite: "mr" | "mme";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  statutEmploi: string;
  metiers: string;
}

interface Step1PersonalInfoProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onPhoneChange: (value: string, countryData?: any) => void;
  onPhoneValidationChange?: (isValid: boolean, error?: string) => void;
}

export default function Step1PersonalInfo({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  onPhoneChange,
  onPhoneValidationChange,
}: Step1PersonalInfoProps) {
  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || "" : "";
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  // Handle phone change from PhoneInput component
  const handlePhoneChange = (value: string | undefined) => {
    onPhoneChange(value || "", undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-night mb-2">
          Civilité *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "mr", label: "Mr" },
            { value: "mme", label: "Mme" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10"
            >
              <input
                type="radio"
                name="civilite"
                value={option.value}
                checked={formData.civilite === option.value}
                onChange={onInputChange}
                className="sr-only"
              />
              <span
                className={`font-medium ${
                  formData.civilite === option.value
                    ? "text-gold-metallic"
                    : "text-night/70"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">
            Prénom *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError("firstName")
                ? "border-red-400 bg-red-50"
                : "border-timberwolf/30"
            }`}
            placeholder="Amadou"
            required
          />
          {getFieldError("firstName") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("firstName")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">
            Nom *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError("lastName")
                ? "border-red-400 bg-red-50"
                : "border-timberwolf/30"
            }`}
            placeholder="Diallo"
            required
          />
          {getFieldError("lastName") && (
            <p className="text-red-500 text-sm mt-1">
              {getFieldError("lastName")}
            </p>
          )}
        </div>
      </div>

      <PhoneInput
        label="Numéro de téléphone *"
        value={formData.phone}
        onChange={handlePhoneChange}
        onBlur={() => onBlur({ target: { name: "phone" } } as any)}
        onValidationChange={onPhoneValidationChange}
        error={getFieldError("phone")}
        placeholder="77 123 45 67"
        required
      />

      <div>
        <label className="block text-sm font-semibold text-night mb-2">
          Adresse email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError("email")
              ? "border-red-400 bg-red-50"
              : "border-timberwolf/30"
          }`}
          placeholder="amadou.diallo@email.com"
          required
        />
        {getFieldError("email") && (
          <p className="text-red-500 text-sm mt-1">{getFieldError("email")}</p>
        )}
      </div>


      <div>
        <label className="block text-sm font-semibold text-night mb-2">
          Statut d'emploi *
        </label>
        <select
          name="statutEmploi"
          value={formData.statutEmploi}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError("statutEmploi")
              ? "border-red-400 bg-red-50"
              : "border-timberwolf/30"
          }`}
          required
        >
          <option value="">Sélectionnez votre statut d'emploi</option>
          {employmentStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        {getFieldError("statutEmploi") && (
          <p className="text-red-500 text-sm mt-1">
            {getFieldError("statutEmploi")}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-night mb-2">
          Métier *
        </label>
        <select
          name="metiers"
          value={formData.metiers}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError("metiers")
              ? "border-red-400 bg-red-50"
              : "border-timberwolf/30"
          }`}
          required
          disabled={!formData.statutEmploi}
        >
          <option value="">
            {formData.statutEmploi
              ? "Sélectionnez votre métier"
              : "Sélectionnez d'abord un statut d'emploi"}
          </option>
          {getFilteredMetiers(formData.statutEmploi).map((metier) => (
            <option key={metier} value={metier}>
              {metier}
            </option>
          ))}
        </select>
        {getFieldError("metiers") && (
          <p className="text-red-500 text-sm mt-1">
            {getFieldError("metiers")}
          </p>
        )}
      </div>
    </div>
  );
}
