import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Users, BarChart3, PieChart, Activity, UserPlus, UserMinus, Brain, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { HRAnalytics, ExtendedHeadcountData, FilterOptions } from '../services/hrAnalytics';
import FilterPanel from '../components/FilterPanel';
import { Switch } from '@/components/ui/switch';

interface KPIDetailsProps {
  analytics: HRAnalytics | null;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
  onShowInsightChange?: (enabled: boolean) => void;
}

const KPIDetails: React.FC<KPIDetailsProps> = ({ 
  analytics, 
  filters, 
  onFiltersChange,
  showInsight,
  onShowInsightChange
}) => {
  const { kpiId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExtendedDepartmentView, setIsExtendedDepartmentView] = useState(false);

  // Obtenir les labels de comparaison
  const comparisonLabels = analytics.getComparisonLabels(filters);

  // Données fictives pour les filtres
  const departments = ['RH', 'Commercial', 'Technique', 'Marketing', 'Finance', 'Support'];
  const agencies = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux'];

  const handleRefresh = () => {
    setLoading(true);
    // Simuler un rechargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleAIToggle = (enabled: boolean) => {
    localStorage.setItem('aiEnabled', String(enabled));
    if (onShowInsightChange) {
      onShowInsightChange(enabled);
    }
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'aiEnabled',
      newValue: String(enabled)
    }));
  };

  useEffect(() => {
    if (!analytics || !kpiId) return;

    setLoading(true);
    try {
      // Simuler le chargement des données détaillées
      if (kpiId === 'headcount') {
        const headcountData = analytics.getExtendedHeadcount(filters);
        const chartData = analytics.getKPIChartData('headcount', filters);
        
        // Utiliser les données d'évolution générées dynamiquement
        const evolutionData = analytics.getEvolutionData(filters);

        const genderDistributionCurrent = [
          { name: 'Femmes', value: 165, percentage: 52 },
          { name: 'Hommes', value: 153, percentage: 48 }
        ];

        const genderDistributionPrevious = [
          { name: 'Femmes', value: 148, percentage: 49 },
          { name: 'Hommes', value: 152, percentage: 51 }
        ];

        const contractTypes = [
          { name: 'CDI', value: 280, percentage: 88 },
          { name: 'CDD', value: 25, percentage: 8 },
          { name: 'Intérim', value: 8, percentage: 2.5 },
          { name: 'Stage', value: 5, percentage: 1.5 }
        ];

        const contractTypesPrevious = [
          { name: 'CDI', value: 265, percentage: 87 },
          { name: 'CDD', value: 22, percentage: 7 },
          { name: 'Intérim', value: 10, percentage: 3.5 },
          { name: 'Stage', value: 7, percentage: 2.5 }
        ];

        const agencyBreakdown = [
          { agency: 'Paris', count: 95, countN1: 88 },
          { agency: 'Lyon', count: 68, countN1: 65 },
          { agency: 'Marseille', count: 52, countN1: 48 },
          { agency: 'Toulouse', count: 41, countN1: 38 },
          { agency: 'Nantes', count: 28, countN1: 25 },
          { agency: 'Bordeaux', count: 34, countN1: 30 }
        ];

        const departmentBreakdown = headcountData.departmentBreakdown;

        setDetailData({
          ...headcountData,
          evolutionData,
          genderDistributionCurrent,
          genderDistributionPrevious,
          contractTypes,
          contractTypesPrevious,
          agencyBreakdown,
          departmentBreakdown,
          currentPeriod: filters.period,
          hasComparison: searchParams.get('compare') === 'true'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails KPI:', error);
    } finally {
      setLoading(false);
    }
  }, [analytics, kpiId, filters, searchParams]);

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return <Minus className="h-5 w-5 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="h-5 w-5 text-success" />;
    if (trend < 0) return <TrendingDown className="h-5 w-5 text-destructive" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getTrendColor = (trend: number | null) => {
    if (trend === null) return 'text-muted-foreground';
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const COLORS = ['#5B5FC7', '#6264A7', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
          <div className="text-center">
            <p className="text-muted-foreground">Données non disponibles</p>
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
                  <span className="text-foreground">Effectif</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground mt-1">
                  Détails - Effectif
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {filters.period}
              </Badge>
              {detailData.hasComparison && (
                <Badge variant="outline">
                  Avec comparaison
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Section Filtres et Options */}
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          departments={departments}
          agencies={agencies}
          onRefresh={handleRefresh}
        />

        {/* Valeurs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Effectif Total 
                    <span className="text-xs ml-1">(fin de période)</span>
                  </p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      {detailData.totalHeadcount.toLocaleString('fr-FR')}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(detailData.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(detailData.trend)}`}>
                        {detailData.trend > 0 ? '+' : ''}{detailData.trend}%
                      </span>
                    </div>
                  </div>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ETP</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      {detailData.totalETP.toLocaleString('fr-FR')}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(detailData.trend ? detailData.trend * 0.8 : null)}
                      <span className={`text-sm font-medium ${getTrendColor(detailData.trend ? detailData.trend * 0.8 : null)}`}>
                        {detailData.trend > 0 ? '+' : ''}{Math.round(detailData.trend * 0.8)}%
                      </span>
                    </div>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nouvelles arrivées</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      +{detailData.newHires}
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">+12%</span>
                    </div>
                  </div>
                </div>
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Départs</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      {detailData.departures}
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">-5%</span>
                    </div>
                  </div>
                </div>
                <UserMinus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

         {/* Évolution */}
        <Card className="teams-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Évolution {filters.period === 'year' ? 'mensuelle' : filters.period === 'quarter' ? 'mensuelle' : 'hebdomadaire'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {(filters.period === 'quarter' && filters.compareWith === 'previous') || 
                 (filters.period === 'month' && filters.compareWith === 'previous') ? (
                  // Cas spéciaux : une seule courbe continue avec styles distincts
                  <LineChart data={detailData.evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="period" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="effectif" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Effectif"
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        const isCurrentPeriod = filters.period === 'quarter' ? payload.isCurrentQuarter : payload.isCurrentMonth;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={isCurrentPeriod ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                            stroke={isCurrentPeriod ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </LineChart>
                ) : (
                  // Cas normaux
                  <LineChart data={detailData.evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="period" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="effectif" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name={filters.compareWith ? `Année ${new Date().getFullYear()}` : `Effectif ${comparisonLabels.current}`}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                    {filters.compareWith && (
                      <Line 
                        type="monotone" 
                        dataKey="effectifN1" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name={filters.compareWith === 'year-ago' ? `Année ${new Date().getFullYear() - 1}` : `Effectif ${comparisonLabels.comparison}`}
                        dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                      />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par agence */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Répartition par agence</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.agencyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="category" 
                      dataKey="agency" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--success))" 
                      name={`Effectif ${comparisonLabels.current}`}
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <Bar 
                        dataKey="countN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name={`Effectif ${comparisonLabels.comparison}`}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par département */}
          <Card className={`teams-card ${isExtendedDepartmentView ? 'col-span-full' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Répartition par département</span>
                  <Badge variant="outline" className="text-xs">
                    {isExtendedDepartmentView 
                      ? `${detailData.departmentBreakdown.length} départements` 
                      : `Top ${Math.min(5, detailData.departmentBreakdown.length)}`
                    }
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExtendedDepartmentView(!isExtendedDepartmentView)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
                >
                  {isExtendedDepartmentView ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="text-sm">Vue compacte</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="text-sm">Voir tout</span>
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${isExtendedDepartmentView ? 'h-96' : 'h-64'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={isExtendedDepartmentView 
                      ? detailData.departmentBreakdown 
                      : detailData.departmentBreakdown.slice(0, 5)
                    }
                    margin={{ 
                      top: 10, 
                      right: 10, 
                      left: 10, 
                      bottom: isExtendedDepartmentView ? 80 : 40 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="category" 
                      dataKey="department" 
                      stroke="hsl(var(--muted-foreground))"
                      angle={isExtendedDepartmentView ? -45 : 0}
                      textAnchor={isExtendedDepartmentView ? "end" : "middle"}
                      height={isExtendedDepartmentView ? 80 : 40}
                      fontSize={isExtendedDepartmentView ? 11 : 12}
                    />
                    <YAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      name={`Effectif ${comparisonLabels.current}`}
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && detailData.departmentBreakdown[0]?.countPrevious !== undefined && (
                      <Bar 
                        dataKey="countPrevious" 
                        fill="hsl(var(--muted-foreground))" 
                        fillOpacity={0.7}
                        name={`Effectif ${comparisonLabels.comparison}`}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                    {filters.compareWith && detailData.departmentBreakdown[0]?.countN1 !== undefined && (
                      <Bar 
                        dataKey="countN1" 
                        fill="hsl(var(--muted-foreground))" 
                        fillOpacity={0.7}
                        name={`Effectif ${comparisonLabels.comparison}`}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {isExtendedDepartmentView && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Affichage de tous les départements • Utilisez la vue compacte pour un aperçu rapide
                </div>
              )}
            </CardContent>
          </Card>

          {/* Répartition par genre */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Répartition Hommes/Femmes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filters.compareWith ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* 2024 */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">2024</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip 
                            formatter={(value, name) => [`${value} personnes (${detailData.genderDistributionCurrent.find((d: any) => d.name === name)?.percentage}%)`, name]}
                          />
                          <Pie
                            data={detailData.genderDistributionCurrent}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {detailData.genderDistributionCurrent.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2023 */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">2023</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip 
                            formatter={(value, name) => [`${value} personnes (${detailData.genderDistributionPrevious.find((d: any) => d.name === name)?.percentage}%)`, name]}
                          />
                          <Pie
                            data={detailData.genderDistributionPrevious}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {detailData.genderDistributionPrevious.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip 
                        formatter={(value, name) => [`${value} personnes (${detailData.genderDistributionCurrent.find((d: any) => d.name === name)?.percentage}%)`, name]}
                      />
                      <Pie
                        data={detailData.genderDistributionCurrent}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {detailData.genderDistributionCurrent.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Répartition par type de contrat */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Répartition par type de contrat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filters.compareWith ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* 2024 */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">2024</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip 
                            formatter={(value, name) => [`${value} personnes (${detailData.contractTypes.find((d: any) => d.name === name)?.percentage}%)`, name]}
                          />
                          <Pie
                            data={detailData.contractTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {detailData.contractTypes.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2023 */}
                  <div>
                    <h4 className="text-sm font-medium text-center mb-2">2023</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip 
                            formatter={(value, name) => [`${value} personnes (${detailData.contractTypesPrevious.find((d: any) => d.name === name)?.percentage}%)`, name]}
                          />
                          <Pie
                            data={detailData.contractTypesPrevious}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {detailData.contractTypesPrevious.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip 
                        formatter={(value, name) => [`${value} personnes (${detailData.contractTypes.find((d: any) => d.name === name)?.percentage}%)`, name]}
                      />
                      <Pie
                        data={detailData.contractTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {detailData.contractTypes.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analyse IA */}
        {showInsight && detailData.insight && (
          <Card className="teams-card-elevated border-0 mb-6">
            <CardHeader className="pb-4 pt-5 px-5">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold text-foreground">Analyse IA - Effectif</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => onFiltersChange({ ...filters })}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Regénérer l'analyse</span>
                  </Button>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <span>IA</span>
                    <Switch
                      checked={showInsight}
                      onCheckedChange={handleAIToggle}
                    />
                    {showInsight && <Sparkles className="h-4 w-4 text-primary" />}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-5 pb-5">
              {/* Synthèse IA */}
              <div className="teams-card p-4 border border-primary/30">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm mb-3">Synthèse IA</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                      {detailData.insight}
                    </p>
                    
                    {/* Métriques clés */}
                    <div className="bg-primary/5 p-3 rounded-md border border-primary/20 mt-4">
                      <h5 className="text-xs font-semibold text-foreground mb-2">Métriques clés :</h5>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Effectif total :</span>
                          <span className="ml-1 font-medium text-foreground">{detailData.totalHeadcount} personnes</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nouvelles arrivées :</span>
                          <span className="ml-1 font-medium text-foreground">+{detailData.newHires} personnes</span>
                        </div>
                        {detailData.trend !== null && (
                          <div>
                            <span className="text-muted-foreground">Évolution :</span>
                            <span className={`ml-1 font-medium ${detailData.trend > 0 ? 'text-success' : 'text-destructive'}`}>
                              {detailData.trend > 0 ? '+' : ''}{detailData.trend}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        💡 <strong>Recommandations :</strong> Maintenir le rythme de recrutement dans les départements en croissance et optimiser l'intégration des nouveaux arrivants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message si l'IA est désactivée */}
        {!showInsight && (
          <Card className="teams-card-elevated border-0 mb-6">
            <CardHeader className="pb-4 pt-5 px-5">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-muted-foreground rounded-full" />
                  <Brain className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold text-muted-foreground">Analyse IA désactivée</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>IA</span>
                  <Switch
                    checked={showInsight}
                    onCheckedChange={handleAIToggle}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="teams-card p-4 border border-muted">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-muted/10 rounded-full">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      L'analyse par intelligence artificielle est actuellement désactivée. Activez-la dans les paramètres pour obtenir des insights personnalisés sur vos données d'effectif.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KPIDetails;