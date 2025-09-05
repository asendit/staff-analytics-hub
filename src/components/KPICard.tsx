
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Info, BarChart3 } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface KPICardProps {
  kpi: KPIData;
  onInfoClick: () => void;
  onChartClick: () => void;
  showInsight?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, onInfoClick, onChartClick, showInsight = true }) => {
  const getTrendIcon = () => {
    if (kpi.trend === null) return null;
    if (kpi.trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (kpi.trend < 0) return <TrendingDown className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getCategoryBadgeStyle = () => {
    switch (kpi.category) {
      case 'positive': return 'status-positive';
      case 'negative': return 'status-attention';
      default: return 'status-neutral';
    }
  };

  const getTrendColor = () => {
    if (kpi.trend === null) return 'text-muted-foreground';
    if (kpi.trend > 0) return 'text-success';
    if (kpi.trend < 0) return 'text-danger';
    return 'text-muted-foreground';
  };

  return (
    <Card className="teams-card border-0">
      <CardHeader className="flex flex-row items-start justify-between pb-3 pt-4 px-4">
        <div className="flex items-start space-x-3">
          <div className={`w-1 h-12 rounded-full ${
            kpi.category === 'positive' ? 'bg-success' : 
            kpi.category === 'negative' ? 'bg-danger' : 'bg-teams-blue'
          }`} />
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
            className="h-7 w-7 p-0 text-muted-foreground hover:text-teams-blue hover:bg-teams-blue/10"
            title="Voir les graphiques"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-teams-blue hover:bg-teams-blue/10"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">
          {/* Valeur principale */}
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-semibold text-foreground">
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString('fr-FR') : kpi.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {kpi.unit}
            </div>
          </div>

          {/* Insight IA - affiché seulement si showInsight est true */}
          {showInsight && kpi.insight && (
            <div className="mt-3 p-3 bg-muted/30 rounded-md border-0">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {kpi.insight}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
