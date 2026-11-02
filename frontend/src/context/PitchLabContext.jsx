import { createContext, useContext } from 'react';
import { useSupabaseState } from '../hooks/useSupabase.js';

const PitchLabContext = createContext(null);

export function PitchLabProvider({ children }) {
  const value = useSupabaseState();

  return (
    <PitchLabContext.Provider value={value}>
      {children}
    </PitchLabContext.Provider>
  );
}

export function usePitchLab() {
  const context = useContext(PitchLabContext);
  if (!context) {
    throw new Error('usePitchLab must be used inside PitchLabProvider');
  }
  return context;
}
