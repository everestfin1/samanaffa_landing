export interface Persona {
  id: string;
  name: string;
  amount: number;
  duration: number;
  description: string;
  personalizedMessage: string;
  emoji: string;
  shortName: string;
  quote: string;
}

export interface Objective {
  id: number;
  name:string;
  icon: string;
  titre: string;
  duree: number;
  mensualite: number;
  description: string;
} 