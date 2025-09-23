import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Users, BarChart3, Brain, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { HRAnalytics, FilterOptions } from '../services/hrAnalytics';
import FilterPanel from '../components/FilterPanel';
import { Switch } from '@/components/ui/switch';

interface SeniorityDetailsProps {
  analytics: HRAnalytics | null;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
  onShowInsightChange?: (enabled: boolean) => void;
}

const SeniorityDetails: React.FC<SeniorityDetailsProps> = ({ 
  analytics, 
  filters, 
  onFiltersChange,
  showInsight,
  onShowInsightChange
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [departureFilter, setDepartureFilter] = useState<string>('all');

  const departments = ['RH', 'Commercial', 'Technique', 'Marketing', 'Finance', 'Support'];
  const agencies = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux'];

  useEffect(() => {
    const fetchData = async () => {
      if (!analytics) return;
      
      setLoading(true);
      try {
        const data = await analytics.getSeniorityAnalytics(filters, departureFilter);
        setDetailData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analytics, filters, departureFilter]);

  const handleAIToggle = (enabled: boolean) => {
    localStorage.setItem('aiEnabled', String(enabled));
    onShowInsightChange?.(enabled);
  };

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#e91e63'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Chargement des données d'ancienneté...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-muted-foreground">Aucune donnée d'ancienneté disponible</p>
          </div>
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
                  <span className="text-foreground">Ancienneté</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground mt-1">
                  Détails - Ancienneté
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
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ancienneté moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{detailData.averageSeniority}</div>
                <div className="text-sm text-muted-foreground">années</div>
                {getTrendIcon(detailData.seniorityTrend)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Taux de rétention global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{detailData.retentionRate}%</div>
                {getTrendIcon(detailData.retentionTrend)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Collaborateurs +5 ans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{detailData.seniorEmployees}</div>
                <div className="text-sm text-muted-foreground">({detailData.seniorEmployeesPercent}%)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Évolution de l'ancienneté moyenne - Full width on top */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-teams-purple" />
                <span>Évolution ancienneté moyenne</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={detailData.seniorityEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ans`, 
                      name === 'average' ? 'Moyenne' : 'Médiane'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Ancienneté moyenne"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="median" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Ancienneté médiane"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 2. Répartition de l'ancienneté */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-teams-purple" />
                <span>Répartition par tranche d'ancienneté</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={detailData.seniorityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'count' ? 'Collaborateurs' : 
                      name === 'countPrevious' ? 'Collaborateurs (précédent)' : 'Pourcentage'
                    ]}
                    labelFormatter={(label) => `Ancienneté: ${label}`}
                  />
                  {detailData.seniorityDistribution[0]?.comparisonLabel && (
                    <Legend />
                  )}
                  <Bar dataKey="count" fill="#8884d8" name={detailData.seniorityDistribution[0]?.comparisonLabel?.split(' vs ')[0] || 'Collaborateurs'}>
                    {detailData.seniorityDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  {detailData.seniorityDistribution[0]?.countPrevious !== null && (
                    <Bar 
                      dataKey="countPrevious" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                      name={detailData.seniorityDistribution[0]?.comparisonLabel?.split(' vs ')[1] || 'Collaborateurs (précédent)'}
                    >
                      {detailData.seniorityDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-prev-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
                      ))}
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
              {showInsight && detailData.insight && (
                <div className="mt-4 p-3 bg-teams-purple/5 rounded-md border border-teams-purple/20">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="h-4 w-4 text-teams-purple mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{detailData.insight}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Ancienneté par département */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-teams-purple" />
                <span>Ancienneté par département</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={detailData.seniorityByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ans`, 
                      name === 'avgSeniority' ? 'Ancienneté moyenne' : 'Ancienneté moyenne (précédent)'
                    ]}
                    labelFormatter={(label) => `Département: ${label}`}
                  />
                  {detailData.seniorityByDepartment[0]?.comparisonLabel && (
                    <Legend />
                  )}
                  <Bar 
                    dataKey="avgSeniority" 
                    fill="#8884d8" 
                    name={detailData.seniorityByDepartment[0]?.comparisonLabel?.split(' vs ')[0] || 'Ancienneté moyenne'}
                  />
                  {detailData.seniorityByDepartment[0]?.avgSeniorityPrevious !== null && (
                    <Bar 
                      dataKey="avgSeniorityPrevious" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                      name={detailData.seniorityByDepartment[0]?.comparisonLabel?.split(' vs ')[1] || 'Ancienneté moyenne (précédent)'}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 4. Ancienneté par agence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-teams-purple" />
                <span>Ancienneté par agence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={detailData.seniorityByAgency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agency" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ans`, 
                      name === 'avgSeniority' ? 'Ancienneté moyenne' : 'Ancienneté moyenne (précédent)'
                    ]}
                    labelFormatter={(label) => `Agence: ${label}`}
                  />
                  {detailData.seniorityByAgency[0]?.comparisonLabel && (
                    <Legend />
                  )}
                  <Bar 
                    dataKey="avgSeniority" 
                    fill="#82ca9d" 
                    name={detailData.seniorityByAgency[0]?.comparisonLabel?.split(' vs ')[0] || 'Ancienneté moyenne'}
                  />
                  {detailData.seniorityByAgency[0]?.avgSeniorityPrevious !== null && (
                    <Bar 
                      dataKey="avgSeniorityPrevious" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                      name={detailData.seniorityByAgency[0]?.comparisonLabel?.split(' vs ')[1] || 'Ancienneté moyenne (précédent)'}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 5. Départs par ancienneté */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-teams-purple" />
                  <span>Départs par ancienneté</span>
                </CardTitle>
                <Select value={departureFilter} onValueChange={setDepartureFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départs</SelectItem>
                    <SelectItem value="resignation">Démissions</SelectItem>
                    <SelectItem value="dismissal">Licenciements</SelectItem>
                    <SelectItem value="retirement">Retraites</SelectItem>
                    <SelectItem value="other">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={detailData.departuresBySeniority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'count' ? 'Départs' : 
                      name === 'countPrevious' ? 'Départs (précédent)' : 'Pourcentage'
                    ]}
                    labelFormatter={(label) => `Ancienneté: ${label}`}
                  />
                  {detailData.departuresBySeniority[0]?.comparisonLabel && (
                    <Legend />
                  )}
                  <Bar 
                    dataKey="count" 
                    fill="#ff7300" 
                    name={detailData.departuresBySeniority[0]?.comparisonLabel?.split(' vs ')[0] || 'Départs'}
                  >
                    {detailData.departuresBySeniority.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  {detailData.departuresBySeniority[0]?.countPrevious !== null && (
                    <Bar 
                      dataKey="countPrevious" 
                      fill="#ff7300" 
                      fillOpacity={0.6}
                      name={detailData.departuresBySeniority[0]?.comparisonLabel?.split(' vs ')[1] || 'Départs (précédent)'}
                    >
                      {detailData.departuresBySeniority.map((entry: any, index: number) => (
                        <Cell key={`cell-prev-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
                      ))}
                    </Bar>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeniorityDetails;