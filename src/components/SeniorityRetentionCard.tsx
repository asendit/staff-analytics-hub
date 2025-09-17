import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3, Brain, RotateCcw } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface SeniorityRetentionData {
  averageSeniority: KPIData;
  retentionRate: KPIData;
}

interface SeniorityRetentionCardProps {
  data: SeniorityRetentionData;
  onInfoClick: (kpi: KPIData) => void;
  onChartClick: (kpi: KPIData) => void;
  showInsight?: boolean;
  isLoadingInsight?: boolean;
  onRefreshInsight?: () => void;
}

const SeniorityRetentionCard: React.FC<SeniorityRetentionCardProps> = ({ 
  data, 
  onInfoClick, 
  onChartClick, 
  showInsight = true,
  isLoadingInsight = false,
  onRefreshInsight
}) => {
  const getTrendIcon = (trend: number | null) => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-muted-foreground" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    return 'text-muted-foreground';
  };

  return (
    <Card className="teams-card border border-teams-purple/30">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
          <div className="w-1 h-6 bg-teams-purple rounded-full" />
          Ancienneté et rétention
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChartClick(data.averageSeniority)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les graphiques"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInfoClick(data.averageSeniority)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          {/* Deux sous-KPI côte à côte */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ancienneté moyenne */}
            <div className="teams-card p-4 border border-teams-purple/20">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-4 w-4 text-teams-purple" />
                <span className="text-sm font-semibold text-foreground">Ancienneté moyenne</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <div className="text-2xl font-semibold text-foreground">
                  {typeof data.averageSeniority.value === 'number' ? data.averageSeniority.value.toLocaleString('fr-FR') : data.averageSeniority.value}
                </div>
                {data.averageSeniority.trend !== null && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(data.averageSeniority.trend)}
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                      {data.averageSeniority.trend > 0 ? '+' : ''}{data.averageSeniority.trend}%
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{data.averageSeniority.unit}</div>
            </div>

            {/* Taux de rétention */}
            <div className="teams-card p-4 border border-teams-purple/20">
              <div className="flex items-center space-x-2 mb-3">
                <RotateCcw className="h-4 w-4 text-teams-purple" />
                <span className="text-sm font-semibold text-foreground">+5 ans d'ancienneté</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <div className="text-2xl font-semibold text-foreground">
                  {typeof data.retentionRate.value === 'number' ? data.retentionRate.value.toLocaleString('fr-FR') : data.retentionRate.value}
                </div>
                {data.retentionRate.trend !== null && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(data.retentionRate.trend)}
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                      {data.retentionRate.trend > 0 ? '+' : ''}{data.retentionRate.trend}%
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{data.retentionRate.unit}</div>
            </div>
          </div>

          {/* Insight IA - affiché seulement si showInsight est true */}
          {showInsight && (
            <div className="mt-3 p-3 bg-teams-purple/5 rounded-md border border-teams-purple/20">
              <div className="flex items-start justify-between space-x-2">
                <div className="flex-1">
                  {isLoadingInsight ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teams-purple" />
                      <p className="text-xs text-muted-foreground font-medium">
                        Génération de l'analyse IA...
                      </p>
                    </div>
                  ) : data.averageSeniority.insight ? (
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {data.averageSeniority.insight}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground font-medium">
                      Aucune analyse IA disponible
                    </p>
                  )}
                </div>
                {onRefreshInsight && !isLoadingInsight && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefreshInsight}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10 flex-shrink-0"
                    title="Rafraîchir l'analyse IA"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeniorityRetentionCard;