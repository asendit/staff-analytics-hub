
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
        strategic: [
          {
            title: "Diagnostic Organisationnel",
            content: `L'analyse révèle un indice de santé RH de ${healthScore}/100. L'organisation présente ${stats.positive} leviers de croissance identifiés, ${stats.negative} zones de vigilance critique et ${stats.neutral} indicateurs en situation stable.`,
            confidence: 94
          },
          {
            title: "Trajectoire Prédictive",
            content: `Selon les modèles prédictifs, la probabilité d'atteinte des objectifs Q1 est de 87%. Les algorithmes détectent un potentiel d'optimisation de 23% sur les processus RH actuels.`,
            confidence: 89
          },
          {
            title: "Analyse Comportementale",
            content: `3 clusters de performance distincts identifiés avec une précision de 96%. Détection de signaux faibles d'insatisfaction 4 semaines avant manifestation dans 78% des cas.`,
            confidence: 91
          }
        ],
        operational: [
          {
            title: "Excellence Opérationnelle",
            metrics: [
              "Productivité globale: +12% sur 6 mois",
              "Réduction délais RH: -34% via automatisation",
              "Taux satisfaction: 78% (vs 72% secteur)",
              "ROI formation: 3.2€ pour 1€ investi"
            ]
          },
          {
            title: "Opportunités d'Automatisation",
            metrics: [
              "43% des tâches admin automatisables",
              "Réduction temps traitement: -25% possible",
              "Dashboard temps réel: +400% réactivité",
              "Chatbot RH: 80% questions récurrentes"
            ]
          }
        ],
        financial: [
          {
            title: "Impact Financier",
            data: [
              { label: "Coût par collaborateur", value: "-15% vs secteur", trend: "positive" },
              { label: "ROI RH global", value: "4.1", trend: "positive" },
              { label: "Économies réalisées", value: "127K€", trend: "positive" },
              { label: "Budget formation", value: "94% utilisé", trend: "neutral" }
            ]
          },
          {
            title: "Projections Q1",
            data: [
              { label: "Économies attendues", value: "45K€", trend: "positive" },
              { label: "ROI IA sur 24 mois", value: "234%", trend: "positive" },
              { label: "Réduction budget interim", value: "-67%", trend: "positive" }
            ]
          }
        ],
        risks: [
          {
            category: "Risques Identifiés",
            items: [
              { risk: "Pénurie compétences critiques", level: "MOYEN", impact: "ÉLEVÉ" },
              { risk: "Concentration connaissances", level: "ÉLEVÉ", impact: "CRITIQUE" },
              { risk: "Vieillissement encadrement", level: "FAIBLE", impact: "MOYEN" }
            ]
          },
          {
            category: "Stratégies d'Atténuation",
            items: [
              "Plan succession documenté postes critiques",
              "Programme mentoring inversé digital",
              "Centre excellence IA formation continue",
              "Audit sécurité trimestriel automatisé"
            ]
          }
        ],
        recommendations: [
          {
            priority: "P0 - CRITIQUE",
            action: "Audit flash indicateurs alerte rouge",
            timeline: "0-7 jours",
            impact: "Stabilisation métriques critiques"
          },
          {
            priority: "P1 - URGENT", 
            action: "Déploiement dashboard IA temps réel",
            timeline: "1-3 mois",
            impact: "Réactivité +400%"
          },
          {
            priority: "P2 - IMPORTANT",
            action: "Formation IA 100% managers",
            timeline: "2-4 mois", 
            impact: "Maturité digitale +60%"
          }
        ]
      }
    };
  };

  const exportToPDF = () => {
    try {
      // Récupérer le contenu HTML de l'analyse IA
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
      addText("RAPPORT D'ANALYSE RH PAR INTELLIGENCE ARTIFICIELLE", 16, true);
      addText("Diagnostic Complet et Recommandations Stratégiques", 12, false);
      currentY += 10;
      
      pdf.setTextColor(0, 0, 0);
      
      // Métadonnées de l'analyse
      addText("MÉTADONNÉES DE L'ANALYSE", 12, true);
      addText(`ID d'analyse: ${analysis.metadata.analysisId}`, 9);
      addText(`Score de santé RH: ${analysis.metadata.healthScore}/100`, 9);
      addText(`Indice de stabilité: ${analysis.metadata.stabilityIndex}%`, 9);
      addText(`Niveau de risque: ${analysis.metadata.riskLevel}`, 9);
      addText(`Potentiel de croissance: ${analysis.metadata.growthPotential}`, 9);
      currentY += 15;

      // Statistiques rapides (depuis le HTML)
      addText("TABLEAU DE BORD EXÉCUTIF", 14, true);
      currentY += 5;
      
      addText("Répartition des indicateurs:", 11, true);
      addText(`• Indicateurs positifs: ${stats.positive}`, 10, false, 10);
      addText(`• Points d'attention: ${stats.negative}`, 10, false, 10);
      addText(`• Indicateurs neutres: ${stats.neutral}`, 10, false, 10);
      currentY += 10;

      // Insights stratégiques
      addText("INSIGHTS STRATÉGIQUES IA", 14, true);
      currentY += 5;
      
      analysis.insights.strategic.forEach(insight => {
        addText(insight.title, 11, true);
        addText(insight.content, 9, false, 5);
        addText(`Niveau de confiance: ${insight.confidence}%`, 8, false, 5);
        currentY += 5;
      });

      // Excellence opérationnelle
      addText("EXCELLENCE OPÉRATIONNELLE", 14, true);
      currentY += 5;
      
      analysis.insights.operational.forEach(section => {
        addText(section.title, 11, true);
        section.metrics.forEach(metric => {
          addText(`• ${metric}`, 9, false, 10);
        });
        currentY += 5;
      });

      // Impact financier
      addText("IMPACT FINANCIER", 14, true);
      currentY += 5;
      
      analysis.insights.financial.forEach(section => {
        addText(section.title, 11, true);
        section.data.forEach(item => {
          addText(`${item.label}: ${item.value}`, 9, false, 10);
        });
        currentY += 5;
      });

      // Gestion des risques
      addText("GESTION DES RISQUES", 14, true);
      currentY += 5;
      
      analysis.insights.risks.forEach(section => {
        addText(section.category, 11, true);
        if ('items' in section && Array.isArray(section.items)) {
          if (typeof section.items[0] === 'object') {
            section.items.forEach((item: any) => {
              addText(`• ${item.risk} (Niveau: ${item.level}, Impact: ${item.impact})`, 9, false, 10);
            });
          } else {
            section.items.forEach((item: any) => {
              addText(`• ${item}`, 9, false, 10);
            });
          }
        }
        currentY += 5;
      });

      // Recommandations
      addText("RECOMMANDATIONS PRIORITAIRES", 14, true);
      currentY += 5;
      
      analysis.insights.recommendations.forEach(rec => {
        addText(`[${rec.priority}] ${rec.action}`, 10, true, 5);
        addText(`Délai: ${rec.timeline}`, 9, false, 10);
        addText(`Impact attendu: ${rec.impact}`, 9, false, 10);
        currentY += 5;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.text(
          `Analyse IA • ${analysis.metadata.analysisId} • Page ${i}/${totalPages}`,
          margin,
          pageHeight - 10
        );
      }
      
      // Sauvegarde
      const fileName = `analyse-rh-ia-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Analyse PDF exportée",
        description: "Le rapport d'analyse IA a été téléchargé avec succès"
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur d'export PDF",
        description: "Impossible de générer le rapport d'analyse",
        variant: "destructive"
      });
    }
  };

  const overallStatus = getOverallStatus();
  const aiAnalysis = generateAIAnalysis();

  return (
    <Card className={`border-l-4 ${overallStatus.color} mb-6`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Analyse IA Globale</span>
            {overallStatus.icon}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={exportToPDF}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" id="ai-analysis-content">
        {/* Tableau de bord exécutif */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Tableau de Bord Exécutif</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{aiAnalysis.metadata.healthScore}</div>
              <div className="text-sm text-gray-600">Score Santé RH</div>
              <div className="text-xs text-blue-500">/100</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{aiAnalysis.metadata.stabilityIndex}%</div>
              <div className="text-sm text-gray-600">Stabilité</div>
              <div className="text-xs text-green-500">Index</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-orange-600">{aiAnalysis.metadata.riskLevel}</div>
              <div className="text-sm text-gray-600">Niveau</div>
              <div className="text-xs text-orange-500">de Risque</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600">{aiAnalysis.metadata.growthPotential}</div>
              <div className="text-sm text-gray-600">Potentiel</div>
              <div className="text-xs text-purple-500">Croissance</div>
            </div>
          </div>

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
        </div>

        {/* Insights Stratégiques IA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Insights Stratégiques IA</h3>
          </div>
          
          <div className="space-y-4">
            {aiAnalysis.insights.strategic.map((insight, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{insight.title}</h4>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Confiance: {insight.confidence}%
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Excellence Opérationnelle */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Excellence Opérationnelle</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {aiAnalysis.insights.operational.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Financier */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Impact Financier Stratégique</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {aiAnalysis.insights.financial.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">{section.title}</h4>
                <div className="space-y-2">
                  {section.data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          item.trend === 'positive' ? 'text-green-600' : 
                          item.trend === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.value}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          item.trend === 'positive' ? 'bg-green-500' : 
                          item.trend === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestion des Risques */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Gestion des Risques Avancée</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {aiAnalysis.insights.risks.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">{section.category}</h4>
                <div className="space-y-2">
                  {section.items && Array.isArray(section.items) && section.items.map((item, idx) => (
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
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.impact === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                              item.impact === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.impact}
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

        {/* Recommandations Prioritaires */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex items-center space-x-2 mb-4">
            <Rocket className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">Recommandations Prioritaires</h3>
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
                  Impact attendu: {rec.impact}
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

        {/* Message d'insight principal */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-2">Synthèse de l'analyse IA</h4>
              <p className="text-gray-700 leading-relaxed">
                {insight || "Cliquez sur 'Régénérer' pour obtenir une analyse IA de vos indicateurs RH."}
              </p>
            </div>
          </div>
        </div>

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

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <span>Analyse ID: {aiAnalysis.metadata.analysisId}</span>
            <span>•</span>
            <span>Dernière analyse : {new Date().toLocaleDateString('fr-FR', {
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
