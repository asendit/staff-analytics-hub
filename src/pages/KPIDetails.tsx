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
        const evolutionData = filters.period === 'year' ? [
          { period: 'Jan', effectif: 285, effectifN1: 270 },
          { period: 'Fév', effectif: 292, effectifN1: 275 },
          { period: 'Mar', effectif: 298, effectifN1: 282 },
          { period: 'Avr', effectif: 305, effectifN1: 288 },
          { period: 'Mai', effectif: 312, effectifN1: 295 },
          { period: 'Jun', effectif: 318, effectifN1: 301 },
          { period: 'Jul', effectif: 322, effectifN1: 305 },
          { period: 'Aoû', effectif: 325, effectifN1: 308 },
          { period: 'Sep', effectif: 318, effectifN1: 302 },
          { period: 'Oct', effectif: 320, effectifN1: 304 },
          { period: 'Nov', effectif: 315, effectifN1: 299 },
          { period: 'Déc', effectif: 318, effectifN1: 301 }
        ] : [
          { period: 'S48', effectif: 318, effectifN1: 301 },
          { period: 'S49', effectif: 320, effectifN1: 303 },
          { period: 'S50', effectif: 322, effectifN1: 305 },
          { period: 'S51', effectif: 325, effectifN1: 308 },
          { period: 'S52', effectif: 318, effectifN1: 302 },
          { period: 'S1', effectif: 320, effectifN1: 304 },
          { period: 'S2', effectif: 315, effectifN1: 299 },
          { period: 'S3', effectif: 318, effectifN1: 301 }
        ];

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

        const departmentBreakdown = [
          { department: 'Technique', count: 142, countN1: 135 },
          { department: 'Commercial', count: 89, countN1: 82 },
          { department: 'Marketing', count: 45, countN1: 40 },
          { department: 'RH', count: 23, countN1: 21 },
          { department: 'Finance', count: 19, countN1: 17 }
        ];

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
              <span>Évolution {filters.period === 'year' ? 'mensuelle' : 'hebdomadaire'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
                    name="Effectif 2024"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                  {filters.compareWith && (
                    <Line 
                      type="monotone" 
                      dataKey="effectifN1" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Effectif 2023"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
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
                      name="Effectif 2024"
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <Bar 
                        dataKey="countN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name="Effectif 2023"
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
                <span>Répartition par département</span>
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
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      name="Effectif 2024"
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <Bar 
                        dataKey="countN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name="Effectif 2023"
                        radius={[4, 4, 0, 0]}
                      />
                    )}
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
                            outerRadius={70}
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
                            outerRadius={70}
                            paddingAngle={2}
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
              )}
            </CardContent>
          </Card>
        </div>

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
  );
};

export default KPIDetails;