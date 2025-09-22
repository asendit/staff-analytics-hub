import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, TrendingDown, Minus, Info, BarChart3, UserPlus, UserMinus, Clock } from 'lucide-react';
import { ExtendedHeadcountData } from '../services/hrAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HeadcountCardProps {
  data: ExtendedHeadcountData;
  onInfoClick: () => void;
  onChartClick: () => void;
  showInsight?: boolean;
}

const HeadcountCard: React.FC<HeadcountCardProps> = ({ 
  data, 
  onInfoClick, 
  onChartClick, 
  showInsight = true 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/kpi-details/headcount');
  };
  const getTrendIcon = () => {
    if (data.trend === null) return null;
    if (data.trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (data.trend < 0) return <TrendingDown className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (data.trend === null) return 'text-muted-foreground';
    if (data.trend > 0) return 'text-success';
    if (data.trend < 0) return 'text-danger';
    return 'text-muted-foreground';
  };

  // Préparer les données pour le graphique
  const chartData = data.departmentBreakdown.map(dept => ({
    name: dept.department,
    effectif: dept.count,
    etp: dept.etp
  }));

  return (
    <Card 
      className="teams-card border border-teams-purple/30 col-span-full lg:col-span-4 xl:col-span-4 cursor-pointer hover:border-teams-purple/50 transition-colors" 
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-1 h-6 bg-teams-purple rounded-full" />
          Effectif - Vue d'ensemble
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les graphiques détaillés"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick();
            }}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indicateurs principaux */}
          <div className="space-y-4">
            {/* Effectif total et ETP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Effectif total</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {data.totalHeadcount.toLocaleString('fr-FR')}
                  </div>
                  {data.trend !== null && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon()}
                      <span className={`text-sm font-medium ${getTrendColor()}`}>
                        {data.trend > 0 ? '+' : ''}{data.trend}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">collaborateurs</div>
              </div>

              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">ETP</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-semibold text-foreground">
                    {data.totalETP.toLocaleString('fr-FR')}
                  </div>
                  {data.trend !== null && (
                    <div className="flex items-center space-x-1">
                      {data.trend > 0 ? <TrendingUp className="h-4 w-4 text-success" /> : 
                       data.trend < 0 ? <TrendingDown className="h-4 w-4 text-danger" /> :
                       <Minus className="h-4 w-4 text-muted-foreground" />}
                      <span className={`text-sm font-medium ${
                        data.trend > 0 ? 'text-success' : 
                        data.trend < 0 ? 'text-danger' : 'text-muted-foreground'
                      }`}>
                        {data.trend > 0 ? '+' : ''}{Math.round(data.trend * 0.8)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">équivalent temps plein</div>
              </div>
            </div>

            {/* Mouvements de personnel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <UserPlus className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Nouvelles arrivées</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-xl font-semibold text-foreground">
                    +{data.newHires}
                  </div>
                  {data.trend !== null && data.newHires > 0 && (
                    <div className="flex items-center space-x-1">
                      {data.comparison === 'higher' ? <TrendingUp className="h-4 w-4 text-success" /> : 
                       data.comparison === 'lower' ? <TrendingDown className="h-4 w-4 text-danger" /> :
                       <Minus className="h-4 w-4 text-muted-foreground" />}
                      <span className={`text-sm font-medium ${
                        data.comparison === 'higher' ? 'text-success' : 
                        data.comparison === 'lower' ? 'text-danger' : 'text-muted-foreground'
                      }`}>
                        {data.comparison === 'higher' ? '+12%' : 
                         data.comparison === 'lower' ? '-8%' : '0%'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">sur la période</div>
              </div>

              <div className="teams-card p-4 border border-teams-purple/20">
                <div className="flex items-center space-x-2 mb-3">
                  <UserMinus className="h-4 w-4 text-teams-purple" />
                  <span className="text-sm font-semibold text-foreground">Départs</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-xl font-semibold text-foreground">
                    -{data.departures}
                  </div>
                  {data.trend !== null && data.departures > 0 && (
                    <div className="flex items-center space-x-1">
                      {data.comparison === 'lower' ? <TrendingUp className="h-4 w-4 text-success" /> : 
                       data.comparison === 'higher' ? <TrendingDown className="h-4 w-4 text-danger" /> :
                       <Minus className="h-4 w-4 text-muted-foreground" />}
                      <span className={`text-sm font-medium ${
                        data.comparison === 'lower' ? 'text-success' : 
                        data.comparison === 'higher' ? 'text-danger' : 'text-muted-foreground'
                      }`}>
                        {data.comparison === 'lower' ? '+5%' : 
                         data.comparison === 'higher' ? '-15%' : '0%'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">sur la période</div>
              </div>
            </div>
          </div>

          {/* Graphique département */}
          <div className="teams-card p-4 border border-teams-purple/20">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-4 w-4 text-teams-purple" />
              <span className="text-sm font-semibold text-foreground">Top 5 Départements</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'effectif' ? 'Effectif' : 'ETP']}
                    labelFormatter={(label) => `Département: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="effectif" 
                    fill="#5B5FC7" 
                    name="Effectif"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="etp" 
                    fill="#6264A7" 
                    name="ETP"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insight IA */}
        {showInsight && data.insight && (
          <div className="mt-4 p-4 bg-teams-purple/5 rounded-lg border border-teams-purple/20">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-teams-purple/10 rounded-full">
                <BarChart3 className="h-3 w-3 text-teams-purple" />
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                {data.insight}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeadcountCard;