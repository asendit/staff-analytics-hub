
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Brain, BarChart3 } from 'lucide-react';
import { KPIData, FilterOptions } from '../services/hrAnalytics';

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPIData | null;
  filters: FilterOptions;
  showInsight?: boolean;
}

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  kpi, 
  filters,
  showInsight = true 
}) => {
  if (!kpi) return null;

  const getTrendIcon = () => {
    if (kpi.trend > 0) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (kpi.trend < 0) return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-400" />;
  };

  const getCategoryColor = () => {
    switch (kpi.category) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Détails - {kpi.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Valeur principale */}
          <Card className={`border-l-4 ${getCategoryColor()}`}>
            <CardHeader>
              <CardTitle className="text-lg">Valeur actuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-3">
                <div className="text-4xl font-bold text-gray-900">
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </div>
                <div className="text-lg text-gray-500 font-medium">
                  {kpi.unit}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                {getTrendIcon()}
                <span className={`text-lg font-medium ${
                  kpi.trend > 0 ? 'text-green-600' : 
                  kpi.trend < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </span>
                <span className="text-sm text-gray-500">
                  vs période précédente
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contexte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contexte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Période :</span>
                  <span className="ml-2 text-gray-600 capitalize">{filters.period}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Catégorie :</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    kpi.category === 'positive' ? 'bg-green-100 text-green-800' :
                    kpi.category === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {kpi.category === 'positive' ? 'Positif' :
                     kpi.category === 'negative' ? 'Attention' : 'Neutre'}
                  </span>
                </div>
                {filters.department && (
                  <div>
                    <span className="font-medium text-gray-700">Département :</span>
                    <span className="ml-2 text-gray-600">{filters.department}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Comparaison :</span>
                  <span className="ml-2 text-gray-600 capitalize">{kpi.comparison}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyse IA - affiché seulement si showInsight est true */}
          {showInsight && kpi.insight && (
            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Analyse IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {kpi.insight}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Message si IA désactivée */}
          {!showInsight && (
            <Card className="border-l-4 border-l-gray-300 bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Brain className="h-5 w-5" />
                  <span>Analyse IA désactivée - Activez l'IA pour voir les insights détaillés</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailModal;
