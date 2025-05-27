
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface KPICardProps {
  kpi: KPIData;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, onClick }) => {
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
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${getCategoryColor()}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
          <span>{kpi.name}</span>
          {getCategoryIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {kpi.value}
            </span>
            <span className="text-sm text-gray-500">{kpi.unit}</span>
          </div>
          
          {kpi.trend !== 0 && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {Math.abs(kpi.trend)}
                {kpi.unit === '%' ? 'pp' : kpi.unit === 'jours' ? ' jours' : kpi.unit === 'collaborateurs' ? '' : '%'}
              </span>
              <span className="text-gray-500">vs période précédente</span>
            </div>
          )}
          
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700 leading-relaxed">
              {kpi.insight}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
