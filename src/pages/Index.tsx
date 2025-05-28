import React, { useState, useEffect } from 'react';
import { HRAnalytics, FilterOptions, KPIData, KPIChartData } from '../services/hrAnalytics';
import { generateHRData } from '../data/hrDataGenerator';
import KPICard from '../components/KPICard';
import KPIDetailModal from '../components/KPIDetailModal';
import KPIChartModal from '../components/KPIChartModal';
import FilterPanel from '../components/FilterPanel';
import GlobalInsightPanel from '../components/GlobalInsightPanel';
import BoardManager from '../components/BoardManager';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ 
    period: 'month',
    compareWith: undefined 
  });
  const [analytics, setAnalytics] = useState<HRAnalytics | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartData, setChartData] = useState<KPIChartData | null>(null);
  const [showInsights, setShowInsights] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setIsLoading(true);
      toast({
        title: "🔄 Initialisation du module RH",
        description: "Chargement des données en cours...",
      });

      const hrData = generateHRData();
      const hrAnalytics = new HRAnalytics(hrData);
      setAnalytics(hrAnalytics);

      const uniqueDepartments = [...new Set(hrData.employees.map(emp => emp.department))];
      setDepartments(uniqueDepartments);

      toast({
        title: "📊 Données générées",
        description: `${hrData.employees.length} collaborateurs et leurs données ont été générés.`,
      });

      loadKPIs(hrAnalytics, filters);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les données RH",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadKPIs = (hrAnalytics: HRAnalytics, currentFilters: FilterOptions) => {
    const allKPIs = hrAnalytics.getAllKPIs(currentFilters);
    setKpis(allKPIs);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (analytics) {
      loadKPIs(analytics, newFilters);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleKPIInfoClick = (kpi: KPIData) => {
    setSelectedKPI(kpi);
    setIsDetailModalOpen(true);
  };

  const handleKPIChartClick = (kpi: KPIData) => {
    if (analytics) {
      const data = analytics.getKPIChartData(kpi.id, filters);
      setChartData(data);
      setSelectedKPI(kpi);
      setIsChartModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données RH...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord RH
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble des indicateurs clés de performance
          </p>
        </div>

        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          departments={departments}
          onRefresh={handleRefresh}
        />

        <BoardManager
          showInsights={showInsights}
          onToggleInsights={setShowInsights}
        />

        {showInsights && (
          <GlobalInsightPanel
            kpis={kpis}
            filters={filters}
            analytics={analytics}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              onInfoClick={() => handleKPIInfoClick(kpi)}
              onChartClick={() => handleKPIChartClick(kpi)}
              showInsight={showInsights}
            />
          ))}
        </div>

        <KPIDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          kpi={selectedKPI}
          filters={filters}
          showInsight={showInsights}
        />

        <KPIChartModal
          isOpen={isChartModalOpen}
          onClose={() => setIsChartModalOpen(false)}
          kpi={selectedKPI}
          chartData={chartData}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default Index;
