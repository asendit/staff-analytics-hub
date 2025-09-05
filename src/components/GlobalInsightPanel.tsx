import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, TrendingUp, AlertCircle, CheckCircle2, Info, FileText, Download, Target, Zap, Users, DollarSign, Shield, Lightbulb, BarChart3, Clock, Award, Rocket } from 'lucide-react';
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

    const healthScore = Math.round(((stats.positive * 3 + stats.neutral * 2 + stats.negative * 0.5) / (stats.positive + stats.neutral + stats.negative)) * 20);
    const stabilityIndex = Math.round((1 - (stats.negative / (stats.positive + stats.negative + stats.neutral))) * 100);
    
    return {
      metadata: {
        analysisId,
        healthScore,
        stabilityIndex,
        riskLevel: stats.negative > 3 ? "CRITIQUE" : stats.negative > 1 ? "MODÉRÉ" : "FAIBLE",
        growthPotential: stats.positive > stats.negative ? "ÉLEVÉ" : "LIMITÉ"
      },
      insights: {
        workforce: {
          title: "Analyse de l'Effectif",
          content: `L'effectif actuel de ${headcount?.value || 'N/A'} collaborateurs présente ${onboarding?.value || 0} nouvelle(s) arrivée(s) récente(s). L'âge moyen de ${ageSeniority?.value || 'N/A'} révèle ${ageSeniority?.category === 'positive' ? 'un équilibre générationnel optimal' : 'un défi de renouvellement des compétences'}.`,
          metrics: [
            `Effectif total: ${headcount?.value || 'N/A'} ${headcount?.unit || ''}`,
            `Nouvelles arrivées: ${onboarding?.value || 'N/A'} ${onboarding?.unit || ''}`,
            `Âge/Ancienneté: ${ageSeniority?.value || 'N/A'}`,
            `Turnover: ${turnover?.value || 'N/A'}${turnover?.unit || ''}`
          ],
          status: headcount?.category || 'neutral'
        },
        productivity: {
          title: "Performance Opérationnelle",
          content: `Les tâches RH affichent un taux de ${tasks?.value || 'N/A'}% de complétion, tandis que les dossiers collaborateurs atteignent ${documents?.value || 'N/A'}% de complétude. ${Number(tasks?.value) > 85 ? 'L\'efficacité opérationnelle est excellente.' : 'Des améliorations processus sont recommandées.'}`,
          metrics: [
            `Tâches RH complétées: ${tasks?.value || 'N/A'}${tasks?.unit || ''}`,
            `Documents à jour: ${documents?.value || 'N/A'}${documents?.unit || ''}`,
            `Heures supplémentaires: ${overtime?.value || 'N/A'} ${overtime?.unit || ''}`
          ],
          status: tasks?.category || 'neutral'
        },
        attendance: {
          title: "Gestion des Présences",
          content: `Le taux d'absentéisme de ${absenteeism?.value || 'N/A'}% ${Number(absenteeism?.value) > 5 ? 'nécessite une attention immédiate avec mise en place d\'actions préventives' : 'reste dans les normes acceptables du secteur'}. Les ${overtime?.value || 'N/A'} heures supplémentaires reflètent ${Number(overtime?.value) > 300 ? 'une surcharge de travail préoccupante' : 'une charge de travail maîtrisée'}.`,
          metrics: [
            `Absentéisme: ${absenteeism?.value || 'N/A'}${absenteeism?.unit || ''}`,
            `Heures supplémentaires: ${overtime?.value || 'N/A'} ${overtime?.unit || ''}`,
            `Tendance absentéisme: ${absenteeism?.trend ? (absenteeism.trend > 0 ? '+' : '') + absenteeism.trend + '%' : 'Stable'}`
          ],
          status: absenteeism?.category || 'neutral'
        },
        financial: {
          title: "Impact Budgétaire",
          content: `Les frais RH s'élèvent à ${expenses?.value || 'N/A'}€ cette période. ${expenses?.trend && expenses.trend > 0 ? `L'augmentation de ${expenses.trend}% nécessite un contrôle budgétaire renforcé` : expenses?.trend && expenses.trend < 0 ? `La réduction de ${Math.abs(expenses.trend)}% optimise les coûts` : 'Les dépenses restent stables'}.`,
          metrics: [
            `Frais RH totaux: ${expenses?.value || 'N/A'}€`,
            `Évolution: ${expenses?.trend ? (expenses.trend > 0 ? '+' : '') + expenses.trend + '%' : 'Stable'}`,
            `Coût par collaborateur: ${expenses?.value && headcount?.value ? Math.round(Number(expenses.value) / Number(headcount.value)).toLocaleString() : 'N/A'}€`
          ],
          status: expenses?.category || 'neutral'
        },
        risks: [
          {
            category: "Alertes Prioritaires",
            items: stats.negative > 0 ? [
              ...(Number(absenteeism?.value) > 5 ? [{ risk: "Taux d'absentéisme élevé", level: "ÉLEVÉ", impact: "CRITIQUE" }] : []),
              ...(Number(turnover?.value) > 10 ? [{ risk: "Turnover préoccupant", level: "MOYEN", impact: "ÉLEVÉ" }] : []),
              ...(Number(overtime?.value) > 300 ? [{ risk: "Surcharge de travail", level: "ÉLEVÉ", impact: "MOYEN" }] : []),
              ...(Number(tasks?.value) < 80 ? [{ risk: "Efficacité RH dégradée", level: "MOYEN", impact: "MOYEN" }] : [])
            ] : [{ risk: "Aucune alerte critique détectée", level: "FAIBLE", impact: "FAIBLE" }]
          },
          {
            category: "Actions Recommandées",
            items: [
              "Audit des processus RH inefficaces",
              "Plan d'action anti-absentéisme si nécessaire",
              "Optimisation charge de travail équipes",
              "Digitalisation complète dossiers collaborateurs"
            ]
          }
        ],
        recommendations: [
          {
            priority: stats.negative > 2 ? "P0 - CRITIQUE" : "P2 - IMPORTANT",
            action: stats.negative > 2 ? "Intervention immédiate sur indicateurs critiques" : "Optimisation continue des processus",
            timeline: stats.negative > 2 ? "0-15 jours" : "1-3 mois",
            impact: stats.negative > 2 ? "Stabilisation urgente" : "Amélioration performance +15%"
          },
          {
            priority: "P1 - URGENT",
            action: Number(documents?.value) < 90 ? "Digitalisation complète dossiers RH" : "Maintien excellence administrative",
            timeline: "2-6 semaines",
            impact: "Conformité 100% + gain temps 40%"
          },
          {
            priority: "P2 - IMPORTANT",
            action: "Formation continue managers RH",
            timeline: "2-4 mois",
            impact: "Efficacité managériale +25%"
          }
        ]
      }
    };
  };

  const exportToPDF = () => {
    try {
      const analysisElement = document.getElementById('ai-analysis-content');
      if (!analysisElement) {
        toast({
          title: "Erreur d'export",
          description: "Impossible de trouver le contenu de l'analyse",
          variant: "destructive"
        });
        return;
      }

      const pdf = new jsPDF();
      const analysis = generateAIAnalysis();
      
      // Configuration de base
      pdf.setFont("helvetica");
      let currentY = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      
      // Fonction pour ajouter une nouvelle page si nécessaire
      const checkNewPage = (requiredSpace: number = 20) => {
        if (currentY + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          currentY = 20;
        }
      };
      
      // Fonction pour ajouter du texte avec gestion des retours à la ligne
      const addText = (text: string, fontSize: number = 10, isBold: boolean = false, indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        
        const maxWidth = 170 - indent;
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          checkNewPage();
          pdf.text(line, margin + indent, currentY);
          currentY += lineHeight;
        });
      };
      
      // En-tête du document
      pdf.setFillColor(41, 128, 185);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      addText("ANALYSE RH PAR INTELLIGENCE ARTIFICIELLE", 16, true);
      addText("Rapport basé sur les données opérationnelles", 12, false);
      currentY += 10;
      
      pdf.setTextColor(0, 0, 0);
      
      // Métadonnées
      addText("MÉTADONNÉES DE L'ANALYSE", 12, true);
      addText(`ID: ${analysis.metadata.analysisId}`, 9);
      addText(`Score santé RH: ${analysis.metadata.healthScore}/100`, 9);
      addText(`Stabilité: ${analysis.metadata.stabilityIndex}%`, 9);
      addText(`Niveau de risque: ${analysis.metadata.riskLevel}`, 9);
      currentY += 15;

      // Statistiques
      addText("SYNTHÈSE EXÉCUTIVE", 14, true);
      addText(`Indicateurs positifs: ${stats.positive}`, 10, false, 10);
      addText(`Points d'attention: ${stats.negative}`, 10, false, 10);
      addText(`Indicateurs neutres: ${stats.neutral}`, 10, false, 10);
      currentY += 10;

      // Analyses détaillées
      Object.values(analysis.insights).forEach((section: any) => {
        if (section.title) {
          addText(section.title.toUpperCase(), 12, true);
          if (section.content) addText(section.content, 9, false, 5);
          if (section.metrics) {
            section.metrics.forEach((metric: string) => {
              addText(`• ${metric}`, 9, false, 10);
            });
          }
          currentY += 8;
        }
      });

      // Risques et recommandations
      analysis.insights.risks.forEach((section: any) => {
        addText(section.category.toUpperCase(), 12, true);
        section.items.forEach((item: any) => {
          if (typeof item === 'object') {
            addText(`• ${item.risk} (${item.level}/${item.impact})`, 9, false, 10);
          } else {
            addText(`• ${item}`, 9, false, 10);
          }
        });
        currentY += 5;
      });

      addText("RECOMMANDATIONS PRIORITAIRES", 12, true);
      analysis.insights.recommendations.forEach((rec: any) => {
        addText(`[${rec.priority}] ${rec.action}`, 10, true, 5);
        addText(`Délai: ${rec.timeline} | Impact: ${rec.impact}`, 9, false, 10);
        currentY += 3;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.text(
          `Analyse RH IA • ${analysis.metadata.analysisId} • Page ${i}/${totalPages}`,
          margin,
          pageHeight - 10
        );
      }
      
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
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm font-medium">{isLoading ? 'Actualiser l\'analyse' : 'Actualiser'}</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 pb-5" id="ai-analysis-content">
        {/* Vue d'ensemble */}
        <div className="teams-card p-5">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-teams-blue" />
            <h3 className="text-base font-semibold text-foreground">Vue d'Ensemble</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success-light rounded-lg border border-success/20">
              <div className="text-2xl font-semibold text-success">{stats.positive}</div>
              <div className="text-sm text-success font-medium">Indicateurs positifs</div>
            </div>
            <div className="text-center p-4 bg-warning-light rounded-lg border border-warning/20">
              <div className="text-2xl font-semibold text-warning">{stats.negative}</div>
              <div className="text-sm text-warning font-medium">Points d'attention</div>
            </div>
            <div className="text-center p-4 bg-teams-blue/10 rounded-lg border border-teams-blue/20">
              <div className="text-2xl font-semibold text-teams-blue">{stats.neutral}</div>
              <div className="text-sm text-teams-blue font-medium">Indicateurs neutres</div>
            </div>
          </div>
        </div>

        {/* Statut global */}
        <div className={`teams-card p-4 border-l-4 ${
          stats.negative > stats.positive 
            ? 'border-l-danger bg-danger/5' 
            : stats.positive > stats.negative 
              ? 'border-l-success bg-success/5' 
              : 'border-l-teams-blue bg-teams-blue/5'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-background">
              {overallStatus.icon}
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Statut global : {overallStatus.status}</h4>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                La majorité des indicateurs sont positifs, ce qui indique une bonne performance globale.
              </p>
            </div>
          </div>
        </div>

        {/* Synthèse IA */}
        <div className="teams-card p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-teams-purple/10 rounded-full">
              <Brain className="h-4 w-4 text-teams-purple" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm mb-2">Synthèse IA</h4>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {insight || "Actualisez l'analyse pour obtenir une synthèse IA de vos indicateurs RH."}
              </p>
            </div>
          </div>
        </div>

        {/* Analyses sectorielles */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Analyse de l'Effectif */}
          <div className="teams-card p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-4 w-4 text-teams-purple" />
              <h3 className="text-sm font-semibold text-foreground">{aiAnalysis.insights.workforce.title}</h3>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md border-l-2 border-teams-purple/50 mb-3">
              <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-2">{aiAnalysis.insights.workforce.content}</p>
              <div className="space-y-1">
                {aiAnalysis.insights.workforce.metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      aiAnalysis.insights.workforce.status === 'positive' ? 'bg-success' : 
                      aiAnalysis.insights.workforce.status === 'negative' ? 'bg-danger' : 'bg-teams-blue'
                    }`}></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Opérationnelle */}
          <div className="teams-card p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="h-4 w-4 text-teams-indigo" />
              <h3 className="text-sm font-semibold text-foreground">{aiAnalysis.insights.productivity.title}</h3>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md border-l-2 border-teams-indigo/50 mb-3">
              <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-2">{aiAnalysis.insights.productivity.content}</p>
              <div className="space-y-1">
                {aiAnalysis.insights.productivity.metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      aiAnalysis.insights.productivity.status === 'positive' ? 'bg-success' : 
                      aiAnalysis.insights.productivity.status === 'negative' ? 'bg-danger' : 'bg-teams-blue'
                    }`}></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gestion des Présences */}
          <div className="teams-card p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-teams-blue" />
              <h3 className="text-sm font-semibold text-foreground">{aiAnalysis.insights.attendance.title}</h3>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md border-l-2 border-teams-blue/50">
              <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-2">{aiAnalysis.insights.attendance.content}</p>
              <div className="space-y-1">
                {aiAnalysis.insights.attendance.metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      aiAnalysis.insights.attendance.status === 'positive' ? 'bg-success' : 
                      aiAnalysis.insights.attendance.status === 'negative' ? 'bg-danger' : 'bg-teams-blue'
                    }`}></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Budgétaire */}
          <div className="teams-card p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="h-4 w-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">{aiAnalysis.insights.financial.title}</h3>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-md border-l-2 border-success/50">
              <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-2">{aiAnalysis.insights.financial.content}</p>
              <div className="space-y-1">
                {aiAnalysis.insights.financial.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center text-xs text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      aiAnalysis.insights.financial.status === 'positive' ? 'bg-success' : 
                      aiAnalysis.insights.financial.status === 'negative' ? 'bg-danger' : 'bg-teams-blue'
                    }`}></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">{aiAnalysis.insights.productivity.title}</h3>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-l-4 border-green-400 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{aiAnalysis.insights.productivity.content}</p>
            <div className="grid md:grid-cols-2 gap-2">
              {aiAnalysis.insights.productivity.metrics.map((metric, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    aiAnalysis.insights.productivity.status === 'positive' ? 'bg-green-500' : 
                    aiAnalysis.insights.productivity.status === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gestion des Présences */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">{aiAnalysis.insights.attendance.title}</h3>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{aiAnalysis.insights.attendance.content}</p>
            <div className="grid md:grid-cols-2 gap-2">
              {aiAnalysis.insights.attendance.metrics.map((metric, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    aiAnalysis.insights.attendance.status === 'positive' ? 'bg-green-500' : 
                    aiAnalysis.insights.attendance.status === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Budgétaire */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">{aiAnalysis.insights.financial.title}</h3>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{aiAnalysis.insights.financial.content}</p>
            <div className="grid md:grid-cols-2 gap-2">
              {aiAnalysis.insights.financial.metrics.map((metric, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    aiAnalysis.insights.financial.status === 'positive' ? 'bg-green-500' : 
                    aiAnalysis.insights.financial.status === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gestion des Risques */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Analyse des Risques</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {aiAnalysis.insights.risks.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">{section.category}</h4>
                <div className="space-y-2">
                  {section.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm">
                      {typeof item === 'object' ? (
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-700">{item.risk}</span>
                          <div className="flex space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.level === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                              item.level === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.level}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {item}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-4">
            <Rocket className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">Plan d'Action Recommandé</h3>
          </div>
          
          <div className="space-y-3">
            {aiAnalysis.insights.recommendations.map((rec, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-indigo-400">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      rec.priority.includes('P0') ? 'bg-red-100 text-red-700' :
                      rec.priority.includes('P1') ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.priority}
                    </span>
                    <h4 className="font-medium text-gray-800">{rec.action}</h4>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{rec.timeline}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Impact: {rec.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statut global */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-800">Statut global : {overallStatus.status}</span>
          </div>
        </div>

        {stats.negative > 0 && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">Actions prioritaires détectées</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Analyser les causes des indicateurs en alerte</li>
                  <li>• Prioriser les actions correctives selon la matrice des risques</li>
                  <li>• Planifier un suivi rapproché des métriques critiques</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <span>Analyse: {aiAnalysis.metadata.analysisId}</span>
            <span>•</span>
            <span>Mise à jour: {new Date().toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalInsightPanel;
