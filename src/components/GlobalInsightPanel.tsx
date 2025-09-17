import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, TrendingUp, AlertCircle, CheckCircle2, Info, FileText, Download, Target, Zap, Users, DollarSign, Shield, Lightbulb, BarChart3, Clock, Award, Rocket, RotateCcw } from 'lucide-react';
import { KPIData } from '../services/hrAnalytics';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
        icon: <AlertCircle className="h-5 w-5 text-danger" />,
        status: 'Points d\'attention détectés'
      };
    } else if (stats.positive > stats.negative) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        status: 'Performance positive'
      };
    } else {
      return {
        icon: <Info className="h-5 w-5 text-teams-blue" />,
        status: 'Situation équilibrée'
      };
    }
  };

  const generateAIAnalysis = () => {
    const currentDate = new Date();
    const analysisId = `AI-${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Récupération des KPIs spécifiques
    const absenteeism = kpis.find(kpi => kpi.id === 'absenteeism');
    const turnover = kpis.find(kpi => kpi.id === 'turnover');
    const headcount = kpis.find(kpi => kpi.id === 'headcount');
    const overtime = kpis.find(kpi => kpi.id === 'overtime-hours');
    const expenses = kpis.find(kpi => kpi.id === 'hr-expenses');
    const ageSeniority = kpis.find(kpi => kpi.id === 'age-seniority');
    const tasks = kpis.find(kpi => kpi.id === 'task-completion');
    const documents = kpis.find(kpi => kpi.id === 'document-completion');
    const onboarding = kpis.find(kpi => kpi.id === 'onboarding');

    return {
      metadata: {
        analysisId,
        riskLevel: stats.negative > 3 ? "CRITIQUE" : stats.negative > 1 ? "MODÉRÉ" : "FAIBLE"
      },
      insights: {
        workforce: {
          title: "Analyse de l'Effectif",
          content: `L'effectif actuel de ${headcount?.value || 'N/A'} collaborateurs présente ${onboarding?.value || 0} nouvelle(s) arrivée(s) récente(s).`,
          metrics: [
            `Effectif total: ${headcount?.value || 'N/A'} ${headcount?.unit || ''}`,
            `Nouvelles arrivées: ${onboarding?.value || 'N/A'} ${onboarding?.unit || ''}`,
            `Turnover: ${turnover?.value || 'N/A'}${turnover?.unit || ''}`
          ],
          status: headcount?.category || 'neutral'
        },
        productivity: {
          title: "Performance Opérationnelle",
          content: `Les tâches RH affichent un taux de ${tasks?.value || 'N/A'}% de complétion, tandis que les dossiers collaborateurs atteignent ${documents?.value || 'N/A'}% de complétude.`,
          metrics: [
            `Tâches RH complétées: ${tasks?.value || 'N/A'}${tasks?.unit || ''}`,
            `Documents à jour: ${documents?.value || 'N/A'}${documents?.unit || ''}`,
            `Heures supplémentaires: ${overtime?.value || 'N/A'} ${overtime?.unit || ''}`
          ],
          status: tasks?.category || 'neutral'
        },
        attendance: {
          title: "Gestion des Présences",
          content: `Le taux d'absentéisme de ${absenteeism?.value || 'N/A'}% ${Number(absenteeism?.value) > 5 ? 'nécessite une attention immédiate' : 'reste dans les normes acceptables'}.`,
          metrics: [
            `Absentéisme: ${absenteeism?.value || 'N/A'}${absenteeism?.unit || ''}`,
            `Heures supplémentaires: ${overtime?.value || 'N/A'} ${overtime?.unit || ''}`,
            `Tendance: ${absenteeism?.trend ? (absenteeism.trend > 0 ? '+' : '') + absenteeism.trend + '%' : 'Stable'}`
          ],
          status: absenteeism?.category || 'neutral'
        },
        financial: {
          title: "Impact Budgétaire",
          content: `Les frais RH s'élèvent à ${expenses?.value || 'N/A'}€ cette période.`,
          metrics: [
            `Frais RH totaux: ${expenses?.value || 'N/A'}€`,
            `Évolution: ${expenses?.trend ? (expenses.trend > 0 ? '+' : '') + expenses.trend + '%' : 'Stable'}`,
            `Coût par collaborateur: ${expenses?.value && headcount?.value ? Math.round(Number(expenses.value) / Number(headcount.value)).toLocaleString() : 'N/A'}€`
          ],
          status: expenses?.category || 'neutral'
        }
      }
    };
  };

  const exportToPDF = () => {
    try {
      const pdf = new jsPDF();
      const analysis = generateAIAnalysis();
      
      pdf.setFont("helvetica");
      let currentY = 20;
      
      pdf.setFillColor(91, 95, 199);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text("ANALYSE RH PAR INTELLIGENCE ARTIFICIELLE", 20, 25);
      pdf.setFontSize(12);
      pdf.text("Rapport basé sur les données opérationnelles", 20, 35);
      
      currentY = 60;
      pdf.setTextColor(0, 0, 0);
      
      pdf.setFontSize(14);
      pdf.text("SYNTHÈSE EXÉCUTIVE", 20, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.text(`Indicateurs positifs: ${stats.positive}`, 30, currentY);
      currentY += 7;
      pdf.text(`Points d'attention: ${stats.negative}`, 30, currentY);
      currentY += 7;
      pdf.text(`Indicateurs neutres: ${stats.neutral}`, 30, currentY);
      
      const fileName = `analyse-rh-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Analyse exportée",
        description: "Le rapport d'analyse RH a été téléchargé"
      });
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer le rapport",
        variant: "destructive"
      });
    }
  };

  const overallStatus = getOverallStatus();
  const aiAnalysis = generateAIAnalysis();

  return (
    <Card className="teams-card-elevated border-0 mb-6">
      <CardHeader className="pb-4 pt-5 px-5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-teams-purple rounded-full" />
            <Brain className="h-5 w-5 text-teams-purple" />
            <span className="text-lg font-semibold text-foreground">Analyse IA sur les ressources humaines</span>
            {overallStatus.icon}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={exportToPDF}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10 border border-border"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Exporter l'analyse</span>
            </Button>
            <Button 
              onClick={onGenerateInsight}
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-teams-purple hover:bg-teams-purple/10"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teams-purple mr-2" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm font-medium">{isLoading ? 'Génération en cours...' : 'Regénérer l\'analyse IA'}</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 pb-5" id="ai-analysis-content">
        {/* Vue d'ensemble */}
        <div className="teams-card p-5 border border-teams-purple/30">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-teams-purple" />
            <h3 className="text-base font-semibold text-foreground">Vue d'Ensemble</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-teams-purple/5 rounded-lg border border-teams-purple/20">
              <div className="text-2xl font-semibold text-foreground">{stats.positive}</div>
              <div className="text-sm text-muted-foreground font-medium">Indicateurs positifs</div>
            </div>
            <div className="text-center p-4 bg-teams-purple/5 rounded-lg border border-teams-purple/20">
              <div className="text-2xl font-semibold text-foreground">{stats.negative}</div>
              <div className="text-sm text-muted-foreground font-medium">Points d'attention</div>
            </div>
            <div className="text-center p-4 bg-teams-purple/5 rounded-lg border border-teams-purple/20">
              <div className="text-2xl font-semibold text-foreground">{stats.neutral}</div>
              <div className="text-sm text-muted-foreground font-medium">Indicateurs neutres</div>
            </div>
          </div>
        </div>

        {/* Statut global */}
        <div className="teams-card p-4 border border-teams-purple/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-teams-purple/10">
              {overallStatus.icon}
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Statut global : {overallStatus.status}</h4>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Comparaison par rapport aux benchmarks sectoriels et standards RH.
              </p>
            </div>
          </div>
        </div>

        {/* Synthèse IA */}
        <div className="teams-card p-4 border border-teams-purple/30">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-teams-purple/10 rounded-full">
              <Brain className="h-4 w-4 text-teams-purple" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-3">Synthèse IA</h4>
              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teams-purple" />
                    <span className="text-sm text-muted-foreground font-medium">Analyse en cours...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-teams-purple/10 rounded w-full"></div>
                    <div className="h-3 bg-teams-purple/10 rounded w-3/4"></div>
                    <div className="h-3 bg-teams-purple/10 rounded w-5/6"></div>
                  </div>
                  <div className="bg-teams-purple/5 p-3 rounded-md border border-teams-purple/20">
                    <div className="space-y-2">
                      <div className="h-2 bg-teams-purple/10 rounded w-1/2"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-2 bg-teams-purple/10 rounded"></div>
                        <div className="h-2 bg-teams-purple/10 rounded"></div>
                        <div className="h-2 bg-teams-purple/10 rounded"></div>
                        <div className="h-2 bg-teams-purple/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : insight ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {insight}
                  </p>
                  
                  {/* Métriques clés */}
                  <div className="bg-teams-purple/5 p-3 rounded-md border border-teams-purple/20">
                    <h5 className="text-xs font-semibold text-foreground mb-2">Métriques clés identifiées :</h5>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Effectif total :</span>
                        <span className="ml-1 font-medium text-foreground">{kpis.find(k => k.id === 'headcount')?.value || 'N/A'} collaborateurs</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Absentéisme :</span>
                        <span className="ml-1 font-medium text-foreground">{kpis.find(k => k.id === 'absenteeism')?.value || 'N/A'}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Turnover :</span>
                        <span className="ml-1 font-medium text-foreground">{kpis.find(k => k.id === 'turnover')?.value || 'N/A'}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frais RH :</span>
                        <span className="ml-1 font-medium text-foreground">{kpis.find(k => k.id === 'hr-expenses')?.value || 'N/A'}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Tendances détectées */}
                  <div className="bg-teams-purple/5 p-3 rounded-md border border-teams-purple/20">
                    <h5 className="text-xs font-semibold text-foreground mb-2">Tendances détectées :</h5>
                    <div className="space-y-1">
                      {kpis.filter(kpi => kpi.trend && kpi.trend !== 0).slice(0, 3).map((kpi, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div className="w-1.5 h-1.5 rounded-full mr-2 bg-teams-purple"></div>
                          <span className="text-muted-foreground">{kpi.name} :</span>
                          <span className={`ml-1 font-medium ${kpi.trend && kpi.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {kpi.trend && kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  Actualisez l'analyse pour obtenir une synthèse IA détaillée de vos indicateurs RH.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions prioritaires suggérées */}
        {stats.negative > 0 && (
          <div className="teams-card p-4 border border-teams-purple/30 bg-teams-purple/5">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-teams-purple mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm mb-2">Actions prioritaires suggérées</h4>
                <div className="space-y-2">
                  <ul className="text-xs text-muted-foreground space-y-1 font-medium">
                    {kpis.filter(kpi => kpi.category === 'negative').map((kpi, index) => (
                      <li key={index}>• Investiguer les causes du {kpi.name.toLowerCase()} ({kpi.value}{kpi.unit})</li>
                    ))}
                    <li>• Prioriser les actions correctives selon la matrice des risques</li>
                    <li>• Planifier un suivi rapproché des métriques critiques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalInsightPanel;