import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import KPIDetails from '../pages/KPIDetails';
import TurnoverDetails from '../pages/TurnoverDetails';
import { HRAnalytics, FilterOptions } from '../services/hrAnalytics';
import { convertHRData } from '../utils/dataConverter';
import { generateHRData } from '../data/hrDataGenerator';

const KPIDetailsRoute: React.FC = () => {
  const [analytics, setAnalytics] = useState<HRAnalytics | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({ period: 'month' });
  const [showInsight, setShowInsight] = useState(() => {
    return localStorage.getItem('aiEnabled') === 'true';
  });
  const navigate = useNavigate();
  const { kpiId } = useParams();

  useEffect(() => {
    // Initialiser ou récupérer l'analytics depuis le localStorage ou générer de nouvelles données
    const initializeAnalytics = async () => {
      try {
        // Générer des données HR similaires à celles de la page Index
        const rawData = generateHRData();
        const hrData = convertHRData(rawData);
        const analyticsInstance = new HRAnalytics(hrData);
        setAnalytics(analyticsInstance);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des analytics:', error);
        // Rediriger vers la page d'accueil en cas d'erreur
        navigate('/');
      }
    };

    initializeAnalytics();
  }, [navigate]);

  useEffect(() => {
    // Écouter les changements de l'état AI
    const handleStorageChange = () => {
      setShowInsight(localStorage.getItem('aiEnabled') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Choisir le bon composant selon le kpiId
  switch (kpiId) {
    case 'turnover':
      return (
        <TurnoverDetails
          analytics={analytics}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          showInsight={showInsight}
        />
      );
    default:
      return (
        <KPIDetails
          analytics={analytics}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          showInsight={showInsight}
        />
      );
  }
};

export default KPIDetailsRoute;