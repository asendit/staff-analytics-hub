
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
    if (kpi.trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (kpi.trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getCategoryColor = () => {
    switch (kpi.category) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTrendColor = () => {
    if (kpi.trend === null) return 'text-gray-500';
    if (kpi.trend > 0) return 'text-green-600';
    if (kpi.trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getCategoryColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {kpi.name}
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChartClick}
            className="h-8 w-8 p-0"
            title="Voir les graphiques"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="h-8 w-8 p-0"
            title="Voir les détails"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Valeur principale */}
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {kpi.unit}
            </div>
          </div>

          {/* Tendance - affichée seulement si kpi.trend n'est pas null */}
          {kpi.trend !== null && (
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
              </span>
              <span className="text-xs text-gray-500">
                vs période de comparaison
              </span>
            </div>
          )}

          {/* Insight IA - affiché seulement si showInsight est true */}
          {showInsight && kpi.insight && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
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
