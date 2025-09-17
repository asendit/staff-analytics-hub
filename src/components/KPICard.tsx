
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3, Brain, RotateCcw } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface KPICardProps {
  kpi: KPIData;
  onInfoClick: () => void;
  onChartClick: () => void;
  showInsight?: boolean;
  isLoadingInsight?: boolean;
  onRefreshInsight?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ 
  kpi, 
  onInfoClick, 
  onChartClick, 
  showInsight = true,
  isLoadingInsight = false,
  onRefreshInsight
}) => {
  const getTrendIcon = () => {
    if (kpi.trend === null) return null;
    if (kpi.trend > 0) return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    if (kpi.trend < 0) return <TrendingDown className="h-4 w-4 text-muted-foreground" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    return 'text-muted-foreground';
  };

  return (
    <Card className="teams-card border border-teams-purple/30">
      <CardHeader className="flex flex-row items-start justify-between pb-3 pt-4 px-4">
        <div className="flex items-start space-x-3">
          <div className="w-1 h-12 rounded-full bg-teams-purple" />
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-foreground leading-tight">
              {kpi.name}
            </CardTitle>
            {kpi.trend !== null && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChartClick}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les graphiques"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">
          {/* Valeur principale */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <div className="text-2xl font-semibold text-foreground">
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString('fr-FR') : kpi.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {kpi.unit}
              </div>
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
                  ) : kpi.insight ? (
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {kpi.insight}
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

export default KPICard;
