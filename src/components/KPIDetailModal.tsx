
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Brain, BarChart3 } from 'lucide-react';
import { KPIData, FilterOptions } from '../services/hrAnalytics';

const getKPIDescription = (kpiId: string): string => {
  const descriptions: { [key: string]: string } = {
    'turnover': 'Indicateur de la mobilité des effectifs. Il mesure la proportion de collaborateurs ayant quitté l\'entreprise sur une période donnée, rapportée à l\'effectif théorique disponible (effectif au début de période + embauches). Il permet d\'évaluer la stabilité de l\'organisation et de détecter un éventuel turnover élevé.',
    'absenteeism': 'Indicateur mesurant le pourcentage d\'absences non prévues par rapport au temps de travail théorique. Il permet d\'identifier les problématiques de santé, d\'engagement ou d\'organisation du travail.',
    'remote-work': 'Indicateur du pourcentage de collaborateurs pratiquant le télétravail de manière régulière. Il mesure l\'adoption du travail à distance et son évolution dans l\'organisation.',
    'hr-expenses': 'Indicateur du montant total des notes de frais traitées par les services RH, reflétant les coûts opérationnels et les déplacements professionnels.',
    'task-completion': 'Indicateur du pourcentage de tâches RH administratives complétées dans les délais impartis, mesurant l\'efficacité opérationnelle des services.',
    'document-completion': 'Indicateur du pourcentage de dossiers collaborateurs complets et à jour, reflétant la qualité de la gestion administrative du personnel.',
    'onboarding': 'Indicateur du nombre de nouvelles arrivées et de leur intégration réussie, mesurant l\'efficacité du processus d\'accueil et d\'intégration.',
    'headcount': 'Indicateur central du nombre de collaborateurs présents dans l\'organisation. Il comprend l\'effectif total (tous contrats confondus) et l\'équivalent temps plein (ETP). Il permet de suivre l\'évolution des ressources humaines et de mesurer la capacité productive de l\'entreprise.',
    'edi': 'Ensemble d\'indicateurs mesurant la diversité des profils (âge, genre, nationalité, formation) et l\'équité salariale. Permet de s\'assurer du respect des principes d\'égalité des chances et de non-discrimination, et de piloter les actions en faveur de l\'inclusion.',
    'salary': 'Indicateur financier représentant le coût total des rémunérations versées aux collaborateurs. Elle inclut les salaires bruts, charges sociales et avantages. Permet de piloter les coûts RH et d\'optimiser la répartition budgétaire par département ou fonction.',
    'seniority-and-retention': 'Indicateurs mesurant l\'ancienneté moyenne des collaborateurs et le taux de rétention à long terme (supérieur à 5 ans). Ils permettent d\'évaluer la fidélisation des talents et la stabilité de l\'organisation.'
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
    'onboarding': 'Nouvelles arrivées = Nombre d\'embauches finalisées sur la période',
    'headcount': 'Effectif total = Nombre de collaborateurs actifs | ETP = Σ(Temps de travail / Temps plein)',
    'edi': 'Ratio genre = (Nombre H ou F / Effectif total) × 100 | Écart salarial = ((Salaire H - Salaire F) / Salaire H) × 100',
    'salary': 'Masse salariale = Σ(Salaires bruts + Charges sociales) | Par ETP = Masse totale / Nombre ETP',
    'seniority-and-retention': 'Ancienneté moy. = Σ(Années de service) / Effectif | Rétention 5ans et plus = (Collaborateurs anciens / Effectif) × 100'
  };
  return formulas[kpiId] || 'Formule = (Valeur mesurée / Valeur de référence) × 100';
};

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
          {/* Description et méthode de calcul */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description et méthode de calcul</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Description :</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {getKPIDescription(kpi.id)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Méthode de calcul :</h4>
                <div className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded border">
                  {getKPIFormula(kpi.id)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KPIDetailModal;
