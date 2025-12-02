"use client";

import { useState, useCallback } from 'react';

export interface FormData {
  civilite: 'Mr' | 'Mme' | '';
  prenom: string;
  nom: string;
  categorie_socioprofessionnelle: string;
  pays_residence: string;
  ville: string;
  telephone: string;
  email: string;
  tranche_interesse: string;
  montant_cfa: string;
  code_parrainage: string;
}

export interface FormErrors {
  civilite?: string;
  prenom?: string;
  nom?: string;
  categorie_socioprofessionnelle?: string;
  pays_residence?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  tranche_interesse?: string;
  montant_cfa?: string;
  code_parrainage?: string;
}

const initialFormData: FormData = {
  civilite: '',
  prenom: '',
  nom: '',
  categorie_socioprofessionnelle: '',
  pays_residence: 'SN',
  ville: '',
  telephone: '',
  email: '',
  tranche_interesse: '',
  montant_cfa: '',
  code_parrainage: '',
};

export function useContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setTrancheInteret = useCallback((tranche: string) => {
    setFormData(prev => ({ ...prev, tranche_interesse: tranche }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.civilite) {
      newErrors.civilite = 'Veuillez sélectionner une civilité';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.categorie_socioprofessionnelle) {
      newErrors.categorie_socioprofessionnelle = 'Veuillez sélectionner une catégorie';
    }
    if (!formData.pays_residence) {
      newErrors.pays_residence = 'Veuillez sélectionner un pays';
    }
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.tranche_interesse) {
      newErrors.tranche_interesse = 'Veuillez sélectionner une tranche';
    }
    if (!formData.montant_cfa.trim()) {
      newErrors.montant_cfa = 'Le montant est requis';
    } else {
      const numericAmount = parseInt(formData.montant_cfa.replace(/\s/g, ''), 10);
      if (isNaN(numericAmount) || numericAmount < 10000) {
        newErrors.montant_cfa = 'Le montant minimum est de 10 000 FCFA';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitForm = useCallback(async (): Promise<{ 
    success: boolean; 
    message: string;
    subscription?: {
      id: string;
      referenceNumber: string;
      amount: number;
      tranche: string;
    };
  }> => {
    if (!validateForm()) {
      return { success: false, message: 'Veuillez corriger les erreurs dans le formulaire' };
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ape/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { 
          success: false, 
          message: result.error || 'Une erreur est survenue. Veuillez réessayer.' 
        };
      }

      // Don't reset form yet - we need the data for payment
      return { 
        success: true, 
        message: 'Votre demande a été enregistrée. Redirection vers le paiement...',
        subscription: result.subscription,
      };
    } catch {
      return { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' };
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    updateFormData,
    setTrancheInteret,
    submitForm,
    isSubmitting,
    errors,
    resetForm,
  };
}
