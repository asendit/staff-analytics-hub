import React from 'react';
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
  const getTrendIcon = () => {
    if (data.trend === null) return null;
    if (data.trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (data.trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getCategoryColor = () => {
    switch (data.category) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTrendColor = () => {
    if (data.trend === null) return 'text-gray-500';
    if (data.trend > 0) return 'text-green-600';
    if (data.trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  // Préparer les données pour le graphique
  const chartData = data.departmentBreakdown.map(dept => ({
    name: dept.department,
    effectif: dept.count,
    etp: dept.etp
  }));

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getCategoryColor()} col-span-full lg:col-span-4 xl:col-span-4`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Effectif - Vue d'ensemble
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onChartClick}
            className="h-8 w-8 p-0"
            title="Voir les graphiques détaillés"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indicateurs principaux */}
          <div className="space-y-4">
            {/* Effectif total et ETP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Effectif total</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {data.totalHeadcount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">collaborateurs</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">ETP</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {data.totalETP.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">équivalent temps plein</div>
              </div>
            </div>

            {/* Mouvements de personnel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Nouvelles arrivées</span>
                </div>
                <div className="text-xl font-bold text-green-700">
                  +{data.newHires}
                </div>
                <div className="text-sm text-gray-500">sur la période</div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserMinus className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Départs</span>
                </div>
                <div className="text-xl font-bold text-red-700">
                  -{data.departures}
                </div>
                <div className="text-sm text-gray-500">sur la période</div>
              </div>
            </div>

            {/* Tendance globale */}
            {data.trend !== null && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon()}
                    <span className={`text-sm font-medium ${getTrendColor()}`}>
                      Évolution
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${getTrendColor()}`}>
                    {data.trend > 0 ? '+' : ''}{data.trend}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  vs période de comparaison
                </div>
              </div>
            )}
          </div>

          {/* Graphique département */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Top 5 Départements</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={10} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'effectif' ? 'Effectif' : 'ETP']}
                    labelFormatter={(label) => `Département: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="effectif" 
                    fill="#3b82f6" 
                    name="Effectif"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="etp" 
                    fill="#8b5cf6" 
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
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-blue-100 rounded-full">
                <BarChart3 className="h-3 w-3 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
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