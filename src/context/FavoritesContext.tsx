"use client";

import React, { createContext, useContext, useEffect, useState } from"react";

const STORAGE_KEY ="mcaris_favorites";
const EVENT_KEY ="mcaris_favorites_updated";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  clearFavorites: () => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {
        // Ignore
      }
    };

    window.addEventListener(EVENT_KEY, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(EVENT_KEY, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch {
      // Ignore write errors
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const toggleFavorite = (productId: string) => {
    if (!productId) return;
    let updated: string[];
    if (favorites.includes(productId)) {
      updated = favorites.filter((id) => id !== productId);
    } else {
      updated = [...favorites, productId];
    }
    saveFavorites(updated);
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        count: isInitialized ? favorites.length : 0,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

const defaultContext: FavoritesContextType = {
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  clearFavorites: () => {},
  count: 0,
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  return context || defaultContext;
}
