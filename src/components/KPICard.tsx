
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface KPICardProps {
  kpi: KPIData;
  onInfoClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, onInfoClick }) => {
  const getTrendIcon = () => {
    if (kpi.comparison === 'higher') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (kpi.comparison === 'lower') {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getCategoryIcon = () => {
    switch (kpi.category) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCategoryColor = () => {
    switch (kpi.category) {
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTrendColor = () => {
    if (kpi.comparison === 'higher') {
      return kpi.category === 'negative' ? 'text-red-600' : 'text-green-600';
    } else if (kpi.comparison === 'lower') {
      return kpi.category === 'negative' ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-500';
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg border-l-4 ${getCategoryColor()}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          <span>{kpi.name}</span>
          <div className="flex items-center space-x-2">
            {getCategoryIcon()}
            <button
              onClick={onInfoClick}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="Voir les détails"
            >
              <Info className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Valeur principale */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {kpi.value}
              <span className="text-lg font-normal text-gray-500 ml-1">{kpi.unit}</span>
            </div>
          </div>
          
          {/* Tendance */}
          {kpi.trend !== 0 && (
            <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {Math.abs(kpi.trend)}
                {kpi.unit === '%' ? 'pp' : kpi.unit === 'jours' ? ' jours' : kpi.unit === 'collaborateurs' ? '' : '%'}
              </span>
              <span className="text-gray-500 text-xs">vs période précédente</span>
            </div>
          )}
          
          {/* Insight court */}
          <div className="bg-white p-2 rounded-lg border border-gray-200 text-center">
            <p className="text-xs text-gray-700">
              {kpi.insight.split('.')[0]}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
