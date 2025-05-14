'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';

type ImageUploadContextType = {
  previews: string[];
  setPreviews: (previews: string[]) => void;
  addPreviews: (newPreviews: string[]) => void;
  removePreviews: (indexesToRemove: number) => void;
  clearPreviews: () => void;
  previewsFiles: File[]; // Store actual File objects
  setFiles: (files: File[]) => void;
  addFiles: (newFiles: File[]) => void;
};

const ImageUploadContext = createContext<ImageUploadContextType | undefined>(undefined);

export function ImageUploadProvider({ children }: { children: ReactNode }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewsFiles, setPreviewsFiles] = useState<File[]>([]);
  
  const addPreviews = (newPreviews: string[]) => {
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // const removePreviews = (indexesToRemove: number[]) => {
  //   setPreviews((prev) => prev.filter((_, index) => !indexesToRemove.includes(index)));
  //   setPreviewsFiles((prev) => prev.filter((_, index) => !indexesToRemove.includes(index)));
  // };
  const removePreviews = (indexToRemove: number) => { 
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewsFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };


  const clearPreviews = () => {
    // Clean up object URLs to prevent memory leaks
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    setPreviewsFiles([]);
  };
  
  const setFiles = (files: File[]) => {
    setPreviewsFiles(files);
  };
  
  const addFiles = (newFiles: File[]) => {
    setPreviewsFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <ImageUploadContext.Provider
      value={{ 
        previews, 
        setPreviews, 
        addPreviews, 
        removePreviews, 
        clearPreviews,
        previewsFiles,
        setFiles,
        addFiles
      }}
    >
      {children}
    </ImageUploadContext.Provider>
  );
}

export function useImageUpload() {
  const context = useContext(ImageUploadContext);
  if (context === undefined) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider');
  }
  return context;
} 