import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error('Supabase environment variables are not properly configured. Please set up your Supabase project credentials.');
  throw new Error('Missing or invalid Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface UserRegistration {
  id?: string;
  full_name: string;
  whatsapp_number: string;
  country: string;
  has_used_savings_app: boolean;
  saving_motivation: string;
  ideal_monthly_amount: string;
  selected_objective: string;
  monthly_amount: number;
  duration: number;
  projected_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Fonction pour insérer une nouvelle inscription avec gestion d'erreurs améliorée
export const insertUserRegistration = async (data: Omit<UserRegistration, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('Tentative d\'insertion des données:', data);
    
    // Empêcher les inscriptions multiples avec le même numéro WhatsApp
    const { data: existingNumber } = await supabase
      .from('user_registrations')
      .select('id')
      .eq('whatsapp_number', data.whatsapp_number)
      .maybeSingle();

    if (existingNumber) {
      throw new Error('Ce numéro WhatsApp est déjà enregistré.');
    }

    const { data: result, error } = await supabase
      .from('user_registrations')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase détaillée:', error);
      throw new Error(`Erreur lors de l'insertion: ${error.message}`);
    }

    console.log('Inscription réussie:', result);
    
    // L'email sera envoyé automatiquement par le trigger de base de données
    // Pas besoin d'appeler manuellement la fonction d'email ici
    
    return result;
  } catch (error) {
    console.error('Erreur dans insertUserRegistration:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les inscriptions (pour l'admin)
export const getUserRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur dans getUserRegistrations:', error);
    throw error;
  }
};

// Fonction pour récupérer les statistiques
export const getRegistrationStats = async () => {
  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('country, selected_objective, has_used_savings_app, monthly_amount, duration');

    if (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur dans getRegistrationStats:', error);
    throw error;
  }
};

// Fonction pour tester la connexion Supabase
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Test de connexion échoué:', error);
      return false;
    }

    console.log('Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.error('Erreur de test de connexion:', error);
    return false;
  }
};

// Fonction pour écouter les nouvelles inscriptions en temps réel
export const subscribeToNewRegistrations = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('user_registrations_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_registrations'
      },
      callback
    )
    .subscribe();

  return subscription;
};

// Fonction pour se désabonner des notifications temps réel
export const unsubscribeFromRegistrations = (subscription: any) => {
  supabase.removeChannel(subscription);
};