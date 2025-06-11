import React, { useState, useEffect } from 'react';
import { KPICard } from '@/components/KPICard';
import { FilterPanel } from '@/components/FilterPanel';
import { BoardManager } from '@/components/BoardManager';
import { GlobalInsightPanel } from '@/components/GlobalInsightPanel';
import UserStoriesExport from '@/components/UserStoriesExport';
import { generateHRData } from '@/data/hrDataGenerator';
import { analyzeHRData } from '@/services/hrAnalytics';
import type { KPIData, FilterOptions, HRAnalytics } from '@/services/hrAnalytics';

const Index = () => {
  const [kpiData, setKpiData] = useState<KPIData>({
    employeeCount: 0,
    turnoverRate: 0,
    absenteeismRate: 0,
    satisfactionRate: 0,
  });
  const [hrAnalytics, setHrAnalytics] = useState<HRAnalytics | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    department: 'All',
    period: 'All',
    employmentType: 'All',
  });
  const [showInsights, setShowInsights] = useState(true);

  useEffect(() => {
    const data = generateHRData(100);
    const analytics = analyzeHRData(data, filterOptions);
    setKpiData({
      employeeCount: analytics.employeeCount,
      turnoverRate: analytics.turnoverRate,
      absenteeismRate: analytics.absenteeismRate,
      satisfactionRate: analytics.satisfactionRate,
    });
    setHrAnalytics(analytics);
  }, [filterOptions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord RH</h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble des indicateurs de performance RH</p>
          </div>
          <div className="flex items-center space-x-4">
            <UserStoriesExport />
            <BoardManager
              showInsights={showInsights}
              onToggleInsights={setShowInsights}
            />
          </div>
        </div>

        <FilterPanel onFilterChange={setFilterOptions} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Effectifs" value={kpiData.employeeCount} />
          <KPICard title="Taux de Turnover" value={kpiData.turnoverRate} />
          <KPICard title="Taux d'Absentéisme" value={kpiData.absenteeismRate} />
          <KPICard title="Satisfaction des Employés" value={kpiData.satisfactionRate} />
        </div>

        {showInsights && hrAnalytics && (
          <GlobalInsightPanel hrAnalytics={hrAnalytics} />
        )}
      </div>
    </div>
  );
};

export default Index;
