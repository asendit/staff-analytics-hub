
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, TrendingUp, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';

interface GlobalInsightPanelProps {
  insight: string;
  kpis: KPIData[];
  isLoading?: boolean;
  onGenerateInsight: () => void;
}

const GlobalInsightPanel: React.FC<GlobalInsightPanelProps> = ({
  insight,
  kpis,
  isLoading = false,
  onGenerateInsight
}) => {
  const getInsightStats = () => {
    const positive = kpis.filter(kpi => kpi.category === 'positive').length;
    const negative = kpis.filter(kpi => kpi.category === 'negative').length;
    const neutral = kpis.filter(kpi => kpi.category === 'neutral').length;
    
    return { positive, negative, neutral };
  };

  const stats = getInsightStats();

  const getOverallStatus = () => {
    if (stats.negative > stats.positive) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        color: 'border-l-red-500 bg-red-50',
        status: 'Attention requise'
      };
    } else if (stats.positive > stats.negative) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        color: 'border-l-green-500 bg-green-50',
        status: 'Performance positive'
      };
    } else {
      return {
        icon: <Info className="h-5 w-5 text-blue-600" />,
        color: 'border-l-blue-500 bg-blue-50',
        status: 'Situation équilibrée'
      };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className={`border-l-4 ${overallStatus.color} mb-6`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Analyse IA Globale</span>
            {overallStatus.icon}
          </div>
          <Button 
            onClick={onGenerateInsight}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Génération...' : 'Régénérer'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.positive}</div>
            <div className="text-sm text-green-600">Indicateurs positifs</div>
          </div>
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.negative}</div>
            <div className="text-sm text-red-600">Points d'attention</div>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{stats.neutral}</div>
            <div className="text-sm text-blue-600">Indicateurs neutres</div>
          </div>
        </div>

        {/* Statut global */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-800">Statut global : {overallStatus.status}</span>
          </div>
        </div>

        {/* Insight principal */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-2">Analyse détaillée</h4>
              <p className="text-gray-700 leading-relaxed">
                {insight || "Cliquez sur 'Régénérer' pour obtenir une analyse IA de vos indicateurs RH."}
              </p>
            </div>
          </div>
        </div>

        {/* Recommandations rapides */}
        {stats.negative > 0 && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">Actions recommandées</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Analyser les causes des indicateurs en alerte</li>
                  <li>• Prioriser les actions correctives</li>
                  <li>• Planifier un suivi rapproché</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer avec timestamp */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Dernière analyse : {new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalInsightPanel;
