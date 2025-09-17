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
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-4 w-4 text-teams-purple" />
            <span className="text-base font-semibold text-foreground">Analyse IA</span>
            {overallStatus.icon}
          </div>
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
            <span className="text-sm font-medium">Actualiser</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {/* Synthèse rapide */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-4">
            <span className="text-green-600 font-medium">{stats.positive} positifs</span>
            <span className="text-red-600 font-medium">{stats.negative} alertes</span>
            <span className="text-gray-600 font-medium">{stats.neutral} neutres</span>
          </div>
          <div className="text-xs text-muted-foreground">{overallStatus.status}</div>
        </div>

        {/* Insight principal */}
        <div className="teams-card p-3 border border-teams-purple/30">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight || "Actualisez l'analyse pour obtenir une synthèse IA de vos indicateurs RH."}
          </p>
        </div>

        {/* Actions si alertes */}
        {stats.negative > 0 && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
            <AlertCircle className="h-3 w-3 inline mr-1" />
            {stats.negative} indicateur{stats.negative > 1 ? 's' : ''} nécessite{stats.negative > 1 ? 'nt' : ''} une attention
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalInsightPanel;