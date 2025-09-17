import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Users, BarChart3, PieChart, Activity, UserPlus, UserMinus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { HRAnalytics, ExtendedHeadcountData, FilterOptions } from '../services/hrAnalytics';
import FilterPanel from '../components/FilterPanel';

interface KPIDetailsProps {
  analytics: HRAnalytics | null;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
}

const KPIDetails: React.FC<KPIDetailsProps> = ({ 
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

  useEffect(() => {
    if (!analytics || !kpiId) return;

    setLoading(true);
    try {
      // Simuler le chargement des données détaillées
      if (kpiId === 'headcount') {
        const headcountData = analytics.getExtendedHeadcount(filters);
        const chartData = analytics.getKPIChartData('headcount', filters);
        
        // Données simulées pour les graphiques détaillés
        const monthlyEvolution = [
          { month: 'Jan', effectif: 285, etp: 270 },
          { month: 'Fév', effectif: 292, etp: 275 },
          { month: 'Mar', effectif: 298, etp: 282 },
          { month: 'Avr', effectif: 305, etp: 288 },
          { month: 'Mai', effectif: 312, etp: 295 },
          { month: 'Jun', effectif: 318, etp: 301 }
        ];

        const genderDistribution = [
          { name: 'Femmes', value: 165, percentage: 52 },
          { name: 'Hommes', value: 153, percentage: 48 }
        ];

        const contractTypes = [
          { name: 'CDI', value: 280, percentage: 88 },
          { name: 'CDD', value: 25, percentage: 8 },
          { name: 'Intérim', value: 8, percentage: 2.5 },
          { name: 'Stage', value: 5, percentage: 1.5 }
        ];

        setDetailData({
          ...headcountData,
          monthlyEvolution,
          genderDistribution,
          contractTypes,
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
                  <p className="text-sm font-medium text-muted-foreground">Effectif Total</p>
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
                    <span className="text-3xl font-bold text-success">
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
                    <span className="text-3xl font-bold text-destructive">
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

        {/* Évolution mensuelle */}
        <Card className="teams-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Évolution mensuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={detailData.monthlyEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
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
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="etp" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="ETP"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartitions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par département */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Répartition par département</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailData.departmentBreakdown} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis 
                      type="category" 
                      dataKey="department" 
                      stroke="hsl(var(--muted-foreground))"
                      width={80}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      name="Effectif"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value, name) => [`${value} personnes (${detailData.genderDistribution.find((d: any) => d.name === name)?.percentage}%)`, name]}
                    />
                    <Pie
                      data={detailData.genderDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {detailData.genderDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {detailData.genderDistribution.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
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
                      outerRadius={100}
                      paddingAngle={2}
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
              <div className="mt-4 space-y-2">
                {detailData.contractTypes.map((item: any, index: number) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analyse IA */}
          {showInsight && detailData.insight && (
            <Card className="teams-card border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <span>Analyse IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {detailData.insight}
                </p>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Recommandations :</strong> Surveiller l'évolution des départs au trimestre prochain et renforcer les actions de rétention dans les départements les plus touchés.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIDetails;