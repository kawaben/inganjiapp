// context/TranslationContext.tsx
'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const translation = useTranslation();

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};