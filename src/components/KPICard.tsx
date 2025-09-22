
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, BarChart3, Brain, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KPIData } from '../services/hrAnalytics';

const getKPIDescription = (kpiId: string): string => {
  const descriptions: { [key: string]: string } = {
    'turnover': 'Indicateur de la mobilité des effectifs. Il mesure la proportion de collaborateurs ayant quitté l\'entreprise sur une période donnée, rapportée à l\'effectif théorique disponible (effectif au début de période + embauches). Il permet d\'évaluer la stabilité de l\'organisation et de détecter un éventuel turnover élevé.',
    'absenteeism': 'Indicateur mesurant le pourcentage d\'absences non prévues par rapport au temps de travail théorique. Il permet d\'identifier les problématiques de santé, d\'engagement ou d\'organisation du travail.',
    'remote-work': 'Indicateur du pourcentage de collaborateurs pratiquant le télétravail de manière régulière. Il mesure l\'adoption du travail à distance et son évolution dans l\'organisation.',
    'hr-expenses': 'Indicateur du montant total des notes de frais traitées par les services RH, reflétant les coûts opérationnels et les déplacements professionnels.',
    'task-completion': 'Indicateur du pourcentage de tâches RH administratives complétées dans les délais impartis, mesurant l\'efficacité opérationnelle des services.',
    'document-completion': 'Indicateur du pourcentage de dossiers collaborateurs complets et à jour, reflétant la qualité de la gestion administrative du personnel.',
    'onboarding': 'Indicateur du nombre de nouvelles arrivées et de leur intégration réussie, mesurant l\'efficacité du processus d\'accueil et d\'intégration.'
  };
  return descriptions[kpiId] || 'Description de cet indicateur RH et de son utilité dans le pilotage des ressources humaines.';
};

const getKPIFormula = (kpiId: string): string => {
  const formulas: { [key: string]: string } = {
    'turnover': 'Taux de turnover (%) = (Départs / (Effectif début de période + Arrivées)) × 100',
    'absenteeism': 'Taux d\'absentéisme (%) = (Heures d\'absence / Heures théoriques travaillées) × 100',
    'remote-work': 'Taux de télétravail (%) = (Collaborateurs en télétravail / Effectif total éligible) × 100',
    'hr-expenses': 'Notes de frais = Σ(Montants validés et remboursés sur la période)',
    'task-completion': 'Taux de completion (%) = (Tâches terminées / Tâches totales) × 100',
    'document-completion': 'Complétude dossiers (%) = (Dossiers complets / Total dossiers) × 100',
    'onboarding': 'Nouvelles arrivées = Nombre d\'embauches finalisées sur la période'
  };
  return formulas[kpiId] || 'Formule = (Valeur mesurée / Valeur de référence) × 100';
};

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
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (kpi.id === 'turnover') {
      navigate('/kpi-details/turnover');
    } else {
      onChartClick();
    }
  };

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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetailsClick}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
          title="Voir les graphiques détaillés"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
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

          {/* Description et méthode de calcul */}
          <div className="mt-3 p-3 bg-muted/30 rounded-md border border-border/50">
            <div className="space-y-2">
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {getKPIDescription(kpi.id)}
              </p>
              <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded border">
                {getKPIFormula(kpi.id)}
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
