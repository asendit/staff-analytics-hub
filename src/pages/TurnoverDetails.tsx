import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, UserMinus, BarChart3, PieChart, Activity, Building, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { HRAnalytics, FilterOptions } from '../services/hrAnalytics';
import FilterPanel from '../components/FilterPanel';

interface TurnoverDetailsProps {
  analytics: HRAnalytics | null;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
}

const TurnoverDetails: React.FC<TurnoverDetailsProps> = ({ 
  analytics, 
  filters, 
  onFiltersChange,
  showInsight 
}) => {
  const { kpiId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtenir les labels de comparaison
  const comparisonLabels = analytics?.getComparisonLabels(filters) || { current: '', comparison: '' };

  // Données fictives pour les filtres
  const departments = ['RH', 'Commercial', 'Technique', 'Marketing', 'Finance', 'Support'];
  const agencies = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux'];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (!analytics || kpiId !== 'turnover') return;

    setLoading(true);
    try {
      const turnoverData = analytics.getExtendedTurnover(filters);
      const evolutionData = analytics.getTurnoverEvolutionData(filters);
      const agencyBreakdown = analytics.getTurnoverByAgency(filters);
      const departmentBreakdown = analytics.getTurnoverByDepartment(filters);
      const hierarchicalLevelCurrent = analytics.getTurnoverByHierarchicalLevel(filters);
      const hierarchicalLevelPrevious = analytics.getTurnoverByHierarchicalLevelPrevious(filters);
      const contractTypeCurrent = analytics.getTurnoverByContractType(filters);
      const contractTypePrevious = analytics.getTurnoverByContractTypePrevious(filters);

      setDetailData({
        ...turnoverData,
        evolutionData,
        agencyBreakdown,
        departmentBreakdown,
        hierarchicalLevelCurrent,
        hierarchicalLevelPrevious,
        contractTypeCurrent,
        contractTypePrevious,
        currentPeriod: filters.period,
        hasComparison: searchParams.get('compare') === 'true'
      });
    } catch (error) {
      console.error('Erreur lors du chargement des détails turnover:', error);
    } finally {
      setLoading(false);
    }
  }, [analytics, kpiId, filters, searchParams]);

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return <Minus className="h-5 w-5 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="h-5 w-5 text-muted-foreground" />;
    if (trend < 0) return <TrendingDown className="h-5 w-5 text-muted-foreground" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getTrendColor = (trend: number | null) => {
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
                  <span className="text-foreground">Turnover</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground mt-1">
                  Détails - Turnover
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Taux de Turnover
                  </p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      {detailData.totalTurnoverRate.toFixed(1)}%
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(detailData.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(detailData.trend)}`}>
                        {detailData.trend > 0 ? '+' : ''}{detailData.trend}%
                      </span>
                    </div>
                  </div>
                </div>
                <UserMinus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="teams-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Départs Total</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">
                      {detailData.departures}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        personnes
                      </span>
                    </div>
                  </div>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Évolution */}
        {detailData.evolutionData && (
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Évolution {filters.period === 'year' || filters.period === 'quarter' ? 'mensuelle' : 'N/A'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {(filters.period === 'quarter' && filters.compareWith === 'previous') ? (
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
                        dataKey="turnover" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name="Turnover (%)"
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const isCurrentPeriod = payload.isCurrentQuarter;
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
                        dataKey="turnover" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        name={filters.compareWith ? `Année ${new Date().getFullYear()}` : `Turnover ${comparisonLabels.current}`}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                      />
                      {filters.compareWith && (
                        <Line 
                          type="monotone" 
                          dataKey="turnoverN1" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name={filters.compareWith === 'year-ago' ? `Année ${new Date().getFullYear() - 1}` : `Turnover ${comparisonLabels.comparison}`}
                          dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                        />
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Répartitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par agence */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Turnover par agence</span>
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
                      dataKey="turnover" 
                      fill="hsl(var(--primary))" 
                      name={`Turnover ${comparisonLabels.current}`}
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <Bar 
                        dataKey="turnoverN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name={`Turnover ${comparisonLabels.comparison}`}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par département */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Turnover par département</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.departmentBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="category" 
                      dataKey="department" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar 
                      dataKey="turnover" 
                      fill="hsl(var(--primary))" 
                      name={`Turnover ${comparisonLabels.current}`}
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <Bar 
                        dataKey="turnoverN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name={`Turnover ${comparisonLabels.comparison}`}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Niveau hiérarchique */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Turnover par niveau hiérarchique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={detailData.hierarchicalLevelCurrent}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {detailData.hierarchicalLevelCurrent.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Type de contrat */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Turnover par type de contrat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={detailData.contractTypeCurrent}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {detailData.contractTypeCurrent.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insight IA */}
        {showInsight && (
          <Card className="teams-card border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Activity className="h-5 w-5" />
                <span>Analyse IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {detailData.insight}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TurnoverDetails;