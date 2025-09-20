'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for different selection data
export interface SamaNaffaSelection {
  type: 'sama-naffa';
  objective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
  simulationMode: 'objective' | 'persona';
  selectedPersona?: string;
  selectedObjective?: number;
}

export interface APESelection {
  type: 'ape';
  trancheId: string;
  duration: string;
  rate: number;
  coupon: number;
  amount: string;
  nominalValue: string;
  additionalInfo: {
    maturite: string;
    differe: string;
    duration: string;
    remboursement: string;
  };
}

export type SelectionData = SamaNaffaSelection | APESelection | null;

interface SelectionContextType {
  selectionData: SelectionData;
  setSelectionData: (data: SelectionData) => void;
  clearSelection: () => void;
  hasSelection: boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectionData, setSelectionDataState] = useState<SelectionData>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load selection data from localStorage on mount - client-side only
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userSelection');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelectionDataState(parsed);
      }
    } catch (error) {
      console.error('Error parsing stored selection data:', error);
      try {
        localStorage.removeItem('userSelection');
      } catch (storageError) {
        console.error('Error removing corrupted data:', storageError);
      }
    }
    setIsHydrated(true);
  }, []);

  const setSelectionData = (data: SelectionData) => {
    setSelectionDataState(data);
    if (isHydrated) {
      try {
        if (data) {
          localStorage.setItem('userSelection', JSON.stringify(data));
        } else {
          localStorage.removeItem('userSelection');
        }
      } catch (error) {
        console.error('Error saving selection data:', error);
      }
    }
  };

  const clearSelection = () => {
    setSelectionDataState(null);
    if (isHydrated) {
      try {
        localStorage.removeItem('userSelection');
      } catch (error) {
        console.error('Error clearing selection data:', error);
      }
    }
  };

  const hasSelection = selectionData !== null;

  return (
    <SelectionContext.Provider value={{
      selectionData,
      setSelectionData,
      clearSelection,
      hasSelection
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}

// Helper functions for working with selection data
export function getInitialDepositFromSelection(selection: SelectionData): string {
  if (!selection) return '';
  
  if (selection.type === 'sama-naffa') {
    // For Sama Naffa, suggest 3x the monthly amount as initial deposit
    const suggested = selection.monthlyAmount * 3;
    if (suggested <= 25000) return '25000';
    if (suggested <= 50000) return '50000';
    if (suggested <= 100000) return '100000';
    if (suggested <= 250000) return '250000';
    if (suggested <= 500000) return '500000';
    return 'custom';
  }
  
  if (selection.type === 'ape') {
    // For APE, suggest based on nominal value
    const nominalValue = parseInt(selection.nominalValue.replace(/[^\d]/g, ''));
    if (nominalValue <= 25000) return '25000';
    if (nominalValue <= 50000) return '50000';
    if (nominalValue <= 100000) return '100000';
    if (nominalValue <= 250000) return '250000';
    return '500000';
  }
  
  return '';
}

export function getAccountTypeFromSelection(selection: SelectionData): 'savings' | 'investment' | 'both' {
  if (!selection) return 'both';
  
  if (selection.type === 'sama-naffa') return 'savings';
  if (selection.type === 'ape') return 'investment';
  
  return 'both';
}

export function getMonthlyGoalFromSelection(selection: SelectionData): string {
  if (!selection) return '';
  
  if (selection.type === 'sama-naffa') {
    return selection.monthlyAmount.toString();
  }
  
  return '';
}
