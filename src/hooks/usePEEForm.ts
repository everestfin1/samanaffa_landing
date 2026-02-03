"use client";

import { useState, useCallback } from 'react';

const MIN_PEE_INVESTMENT_CFA = Number(process.env.NEXT_PUBLIC_PEE_MIN_INVESTMENT_CFA ?? '30000');
const PEE_INVESTMENT_INCREMENT_CFA = Number(process.env.NEXT_PUBLIC_PEE_INVESTMENT_INCREMENT_CFA ?? '5000');

export interface PEEFormData {
  civilite: 'Mr' | 'Mme' | '';
  prenom: string;
  nom: string;
  categorie: string;
  pays: string;
  ville: string;
  telephone: string;
  email: string;
  montant_cfa: string;
}

export interface PEEFormErrors {
  civilite?: string;
  prenom?: string;
  nom?: string;
  categorie?: string;
  pays?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  montant_cfa?: string;
}

const initialFormData: PEEFormData = {
  civilite: '',
  prenom: '',
  nom: '',
  categorie: '',
  pays: 'SN',
  ville: '',
  telephone: '',
  email: '',
  montant_cfa: '',
};

export function usePEEForm() {
  const [formData, setFormData] = useState<PEEFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<PEEFormErrors>({});

  const updateFormData = useCallback((field: keyof PEEFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: PEEFormErrors = {};

    if (!formData.civilite) {
      newErrors.civilite = 'Veuillez sélectionner une civilité';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.categorie) {
      newErrors.categorie = 'Veuillez sélectionner une catégorie';
    }
    if (!formData.pays) {
      newErrors.pays = 'Veuillez sélectionner un pays';
    }
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est requise';
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est requis';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.montant_cfa.trim()) {
      newErrors.montant_cfa = 'Le montant est requis';
    } else {
      const numericAmount = parseInt(formData.montant_cfa.replace(/\s/g, ''), 10);
      if (isNaN(numericAmount) || numericAmount < MIN_PEE_INVESTMENT_CFA) {
        newErrors.montant_cfa = `Le montant minimum est de ${MIN_PEE_INVESTMENT_CFA.toLocaleString('fr-FR')} FCFA`;
      } else {
        // Check increment
        const remainder = (numericAmount - MIN_PEE_INVESTMENT_CFA) % PEE_INVESTMENT_INCREMENT_CFA;
        if (remainder !== 0) {
          newErrors.montant_cfa = `Le montant doit être un multiple de ${PEE_INVESTMENT_INCREMENT_CFA.toLocaleString('fr-FR')} FCFA au-dessus du minimum`;
        }
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
    };
  }> => {
    if (!validateForm()) {
      return { success: false, message: 'Veuillez corriger les erreurs dans le formulaire' };
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pee/subscribe', {
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

  const formatAmount = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    const formattedValue = formatAmount(value);
    updateFormData('montant_cfa', formattedValue);
  }, [formatAmount, updateFormData]);

  return {
    formData,
    updateFormData,
    submitForm,
    isSubmitting,
    errors,
    resetForm,
    handleAmountChange,
    MIN_PEE_INVESTMENT_CFA,
    PEE_INVESTMENT_INCREMENT_CFA,
  };
}
