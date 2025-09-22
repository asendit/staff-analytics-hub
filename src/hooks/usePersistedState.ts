import { useState, useEffect } from 'react';
import { FilterOptions } from '../services/hrAnalytics';

// Clés pour le localStorage
const STORAGE_KEYS = {
  FILTERS: 'hr_dashboard_filters',
  AI_ENABLED: 'aiEnabled'
} as const;

// État par défaut pour les filtres
const DEFAULT_FILTERS: FilterOptions = {
  period: 'year'
};

// Hook pour gérer les filtres persistés
export const usePersistedFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
      return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    try {
      localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(newFilters));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des filtres:', error);
    }
  };

  return [filters, updateFilters] as const;
};

// Hook pour gérer l'état IA persisté
export const usePersistedAI = () => {
  const [isAIEnabled, setIsAIEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AI_ENABLED) === 'true';
  });

  const updateAIEnabled = (enabled: boolean) => {
    setIsAIEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.AI_ENABLED, enabled.toString());
      // Déclencher un événement pour synchroniser entre les composants
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.AI_ENABLED,
        newValue: enabled.toString(),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état IA:', error);
    }
  };

  // Écouter les changements depuis d'autres composants
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.AI_ENABLED && e.newValue !== null) {
        setIsAIEnabled(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return [isAIEnabled, updateAIEnabled] as const;
};

// Hook combiné pour gérer l'état global persisté
export const usePersistedDashboardState = () => {
  const [filters, updateFilters] = usePersistedFilters();
  const [isAIEnabled, updateAIEnabled] = usePersistedAI();

  return {
    filters,
    updateFilters,
    isAIEnabled,
    updateAIEnabled
  };
};