import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BarChart3, PieChart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { HRAnalytics, FilterOptions } from '../services/hrAnalytics';
import FilterPanel from '../components/FilterPanel';

interface EquityDetailsProps {
  analytics: HRAnalytics | null;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  showInsight: boolean;
  onShowInsightChange?: (enabled: boolean) => void;
}

const EquityDetails: React.FC<EquityDetailsProps> = ({ 
  analytics, 
  filters, 
  onFiltersChange,
  showInsight,
  onShowInsightChange
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [equityData, setEquityData] = useState<any>(null);

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
    if (!analytics) return;

    setLoading(true);
    try {
      // Récupérer les données d'équité
      const agePyramidData = analytics.getAgePyramidData(filters);
      const educationDistribution = analytics.getEducationDistribution(filters);
      const salaryGapByCategory = analytics.getSalaryGapByCategory(filters);
      const genderRatioByDept = analytics.getGenderRatioByDepartment(filters);
      const genderRatioByLevel = analytics.getGenderRatioByLevel(filters);

      setEquityData({
        agePyramidData,
        educationDistribution,
        salaryGapByCategory,
        genderRatioByDept,
        genderRatioByLevel
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'équité:', error);
    } finally {
      setLoading(false);
    }
  }, [analytics, filters]);

  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return <Minus className="h-5 w-5 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="h-5 w-5 text-success" />;
    if (trend < 0) return <TrendingDown className="h-5 w-5 text-destructive" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const COLORS = ['#5B5FC7', '#6264A7', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!equityData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
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
                  <span className="text-foreground">Équité</span>
                </div>
                <h1 className="text-2xl font-semibold text-foreground mt-1">
                  Détails - Équité, diversité et inclusion
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Section Filtres */}
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          departments={departments}
          agencies={agencies}
          onRefresh={handleRefresh}
        />

        {/* Pyramide des âges - Full width */}
        <Card className="teams-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Pyramide des âges</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Répartition des collaborateurs par tranche d'âge et par genre
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={equityData.agePyramidData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="ageRange" 
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Pourcentage (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, '']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="hommesPercentage" 
                    fill="hsl(var(--primary))" 
                    name="Hommes"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="femmesPercentage" 
                    fill="hsl(var(--success))" 
                    name="Femmes"
                    radius={[4, 4, 0, 0]}
                  />
                  {filters.compareWith && (
                    <>
                      <Bar 
                        dataKey="hommesPercentageN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name="Hommes (période précédente)"
                        opacity={0.5}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="femmesPercentageN1" 
                        fill="hsl(var(--muted-foreground))" 
                        name="Femmes (période précédente)"
                        opacity={0.3}
                        radius={[4, 4, 0, 0]}
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphiques en grille */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par niveau de formation */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Répartition par niveau de formation</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Part des collaborateurs selon leur niveau d'études ou diplômes
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={equityData.educationDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {equityData.educationDistribution.map((entry: any, index: number) => (
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

          {/* Ratio H/F par niveau hiérarchique */}
          <Card className="teams-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Ratio H/F par niveau hiérarchique</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Proportion hommes/femmes selon le niveau de responsabilité (manager ou collaborateur)
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equityData.genderRatioByLevel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="level" 
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="menPercentage" 
                      stackId="a" 
                      fill="hsl(var(--primary))" 
                      name="Hommes (%)"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar 
                      dataKey="womenPercentage" 
                      stackId="a" 
                      fill="hsl(var(--success))" 
                      name="Femmes (%)"
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <>
                        <Bar 
                          dataKey="menPercentageN1" 
                          stackId="b" 
                          fill="hsl(var(--muted-foreground))" 
                          name="Hommes - période précédente (%)"
                          opacity={0.5}
                        />
                        <Bar 
                          dataKey="womenPercentageN1" 
                          stackId="b" 
                          fill="hsl(var(--muted-foreground))" 
                          name="Femmes - période précédente (%)"
                          opacity={0.3}
                        />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ratio H/F par département */}
          <Card className="teams-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Ratio H/F par département</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Proportion hommes/femmes selon les équipes
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equityData.genderRatioByDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="department" 
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="menPercentage" 
                      stackId="a" 
                      fill="hsl(var(--primary))" 
                      name="Hommes (%)"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar 
                      dataKey="womenPercentage" 
                      stackId="a" 
                      fill="hsl(var(--success))" 
                      name="Femmes (%)"
                      radius={[4, 4, 0, 0]}
                    />
                    {filters.compareWith && (
                      <>
                        <Bar 
                          dataKey="menPercentageN1" 
                          stackId="b" 
                          fill="hsl(var(--muted-foreground))" 
                          name="Hommes - période précédente (%)"
                          opacity={0.5}
                        />
                        <Bar 
                          dataKey="womenPercentageN1" 
                          stackId="b" 
                          fill="hsl(var(--muted-foreground))" 
                          name="Femmes - période précédente (%)"
                          opacity={0.3}
                        />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Écart salarial H/F par catégorie - Pleine largeur */}
        <Card className="teams-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Écart salarial H/F par département</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparaison des salaires hommes/femmes par département
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equityData.salaryGapByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="category" 
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Écart salarial']}
                  />
                <Bar 
                  dataKey="gapPercentage" 
                  fill="hsl(var(--primary))"
                  name="Écart salarial (%)"
                  radius={[4, 4, 0, 0]}
                >
                  {equityData.salaryGapByCategory.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.gapPercentage > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--success))'} 
                    />
                  ))}
                </Bar>
                  {filters.compareWith && (
                    <Bar 
                      dataKey="gapPercentageN1" 
                      fill="hsl(var(--muted-foreground))"
                      name="Période précédente (%)"
                      opacity={0.5}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
};

export default EquityDetails;