'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Category } from '@/db/schema'; // Adjust the import path as needed

interface CategoriesContextType {
  categories: Category[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
  initialCategories: Category[];
}

export function CategoriesProvider({ children, initialCategories }: CategoriesProviderProps) {
  return (
    <CategoriesContext.Provider value={{ categories: initialCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories(): CategoriesContextType {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    return {categories: []} 
  }
  return context;
} 