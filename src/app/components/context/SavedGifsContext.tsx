'use client';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { Gif } from '../../core/interfaces/gif';

interface SavedGifsContextType {
  savedGifs: Gif[];
  saveGif: (gif: Gif) => void;
  unsaveGif: (gifId: string) => void;
  isSaved: (gifId: string) => boolean;
}

const SavedGifsContext = createContext<SavedGifsContextType | undefined>(
  undefined
);

interface SavedGifsProviderProps {
  children: ReactNode;
}

export const SavedGifsProvider: React.FC<SavedGifsProviderProps> = ({
  children,
}) => {
  const [savedGifs, setSavedGifs] = useState<Gif[]>([]);

  useEffect(() => {
    const storedGifs = localStorage.getItem('savedGifs');
    if (storedGifs) {
      setSavedGifs(JSON.parse(storedGifs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
  }, [savedGifs]);

  const saveGif = (gif: Gif) => {
    setSavedGifs((prevGifs) => [...prevGifs, gif]);
  };

  const unsaveGif = (gifId: string) => {
    setSavedGifs((prevGifs) => prevGifs.filter((gif) => gif.id !== gifId));
  };

  const isSaved = (gifId: string) => {
    return savedGifs.some((gif) => gif.id === gifId);
  };

  return (
    <SavedGifsContext.Provider
      value={{ savedGifs, saveGif, unsaveGif, isSaved }}
    >
      {children}
    </SavedGifsContext.Provider>
  );
};

export const useSavedGifs = () => {
  const context = useContext(SavedGifsContext);
  if (context === undefined) {
    throw new Error('useSavedGifs must be used within a SavedGifsProvider');
  }
  return context;
};
