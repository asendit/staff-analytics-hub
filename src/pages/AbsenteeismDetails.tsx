import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import FilterPanel from '@/components/FilterPanel';
import { HRAnalytics, FilterOptions } from '@/services/hrAnalytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AbsenteeismDetailsProps {
  analytics: HRAnalytics;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
  onShowInsightChange: (enabled: boolean) => void;
}

interface AbsenteeismDetailData {
  kpi: any;
  evolution: any[];
  byAgency: any[];
  byDepartment: any[];
  byType: any[];
  byDemographic: any[];
}

const AbsenteeismDetails: React.FC<AbsenteeismDetailsProps> = ({
  analytics,
  filters,
  onFiltersChange,
  showInsight,
  onShowInsightChange
}) => {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState<AbsenteeismDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [agencies, setAgencies] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données principales
        const kpiData = analytics.getAbsenteeismRate(filters);
        const evolutionData = analytics.getAbsenteeismEvolution(filters);
        const byAgencyData = analytics.getAbsenteeismByAgency(filters);
        const byDepartmentData = analytics.getAbsenteeismByDepartment(filters);
        const byTypeData = analytics.getAbsenteeismByType(filters);
        const byDemographicData = analytics.getAbsenteeismByDemographic(filters);
        
        // Récupérer les listes pour les filtres
        const deptList = analytics.getDepartments();
        const agencyList = analytics.getAgencies();
        
        setDetailData({
          kpi: kpiData,
          evolution: evolutionData,
          byAgency: byAgencyData,
          byDepartment: byDepartmentData,
          byType: byTypeData,
          byDemographic: byDemographicData
        });
        
        setDepartments(deptList);
        setAgencies(agencyList);
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'absentéisme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analytics, filters]);

  const handleAIToggle = (checked: boolean) => {
    localStorage.setItem('aiEnabled', checked.toString());
    onShowInsightChange(checked);
  };

  const getTrendIcon = (trend: number | undefined) => {
    if (!trend) return <Minus className="h-4 w-4" />;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getTrendColor = (trend: number | undefined) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-red-500' : 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Tableau de bord</span>
                  <span>/</span>
                  <span>KPI</span>
                  <span>/</span>
                  <span className="text-foreground">Absentéisme</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground mt-1">
                  Détails - Absentéisme
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {filters.period}
              </Badge>
              {filters.compareWith && (
                <Badge variant="outline">
                  Avec comparaison
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-teams-purple" />
                <span className="text-sm font-medium">Analyse IA</span>
                <Switch
                  checked={showInsight}
                  onCheckedChange={handleAIToggle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Filtres */}
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          departments={departments}
          agencies={agencies}
          onRefresh={() => {}}
        />

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'absentéisme</CardTitle>
              {getTrendIcon(detailData.kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{detailData.kpi.value}%</div>
              <p className={`text-xs ${getTrendColor(detailData.kpi.trend)}`}>
                {detailData.kpi.comparison}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Évolution de l'absentéisme */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Évolution de l'absentéisme</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <LineChart data={detailData.evolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Période actuelle"
                  />
                  {filters.compareWith && (
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Période précédente"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Répartition par agence */}
          <Card>
            <CardHeader>
              <CardTitle>Absentéisme par agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={detailData.byAgency} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Taux (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par département */}
          <Card>
            <CardHeader>
              <CardTitle>Absentéisme par département</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={detailData.byDepartment} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" name="Taux (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par type d'absence */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type d'absence</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={detailData.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {detailData.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par démographie */}
          <Card>
            <CardHeader>
              <CardTitle>Absentéisme par tranche d'âge</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <BarChart data={detailData.byDemographic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF8042" name="Taux (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Insights IA (optionnel) */}
        {showInsight && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-teams-purple" />
                Analyse IA - Absentéisme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {detailData.kpi.insight}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default AbsenteeismDetails;