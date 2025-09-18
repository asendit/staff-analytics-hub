import React, { useState, useEffect } from 'react';
import { generateHRData } from '../data/hrDataGenerator';
import { convertHRData } from '../utils/dataConverter';
import { HRAnalytics, KPIData, KPIChartData, FilterOptions, HRData, ExtendedHeadcountData } from '../services/hrAnalytics';
import KPICard from '../components/KPICard';
import HeadcountCard from '../components/HeadcountCard';
import DraggableKPIGrid from '../components/DraggableKPIGrid';
import KPIDetailModal from '../components/KPIDetailModal';
import KPIChartModal from '../components/KPIChartModal';
import FilterPanel from '../components/FilterPanel';
import BoardManager, { Board } from '../components/BoardManager';
import GlobalInsightPanel from '../components/GlobalInsightPanel';
import { Users, BarChart3, Brain, Sparkles, GripVertical, Settings, X, Download, FileText, FileSpreadsheet, FileBarChart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const Index = () => {
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [analytics, setAnalytics] = useState<HRAnalytics | null>(null);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [headcountData, setHeadcountData] = useState<ExtendedHeadcountData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({ period: 'year' });
  const [globalInsight, setGlobalInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [loadingKPIs, setLoadingKPIs] = useState<Set<string>>(new Set());
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null);
  const [selectedKPIChartData, setSelectedKPIChartData] = useState<KPIChartData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Initialisation des données
  useEffect(() => {
    console.log('Initialisation du module RH...');
    const generatedData = generateHRData();
    const convertedData = convertHRData(generatedData);
    setHrData(convertedData);
    setAnalytics(new HRAnalytics(convertedData));

    // Création des boards par défaut
    const hrMainBoard: Board = {
      id: 'hr-main',
      name: 'Tableau de bord principal (RH)',
      description: 'Vue d\'ensemble complète de tous les indicateurs RH',
      kpis: [
        'headcount', 'turnover', 'seniority-and-retention', 'absenteeism', 'remote-work',
        'hr-expenses', 'task-completion', 'document-completion'
      ],
      kpiOrder: [
        'headcount', 'turnover', 'seniority-and-retention', 'absenteeism', 'remote-work',
        'hr-expenses', 'task-completion', 'document-completion'
      ],
      createdAt: new Date().toISOString(),
      isDefault: true
    };

    const ceoBoard: Board = {
      id: 'ceo-view',
      name: 'Tableau de bord CEO',
      description: 'Indicateurs stratégiques pour la direction générale',
      kpis: [
        'headcount', 'turnover', 'hr-expenses', 'absenteeism', 'onboarding'
      ],
      kpiOrder: [
        'headcount', 'turnover', 'hr-expenses', 'absenteeism', 'onboarding'
      ],
      createdAt: new Date().toISOString(),
      isDefault: true
    };

    const managerBoard: Board = {
      id: 'manager-view',
      name: 'Tableau de bord Manager',
      description: 'Indicateurs opérationnels pour les managers',
      kpis: [
        'headcount', 'absenteeism', 'remote-work', 'task-completion', 'age-seniority'
      ],
      kpiOrder: [
        'headcount', 'remote-work', 'absenteeism', 'task-completion', 'age-seniority'
      ],
      createdAt: new Date().toISOString(),
      isDefault: true
    };

    const defaultBoards = [hrMainBoard, ceoBoard, managerBoard];
    setBoards(defaultBoards);
    setCurrentBoard(hrMainBoard);

    toast({
      title: "Module RH initialisé",
      description: "250 collaborateurs et leurs données ont été générés avec succès"
    });
  }, []);

  // Calcul des KPIs quand les filtres changent
  useEffect(() => {
    if (analytics && currentBoard) {
      console.log('Calcul des KPIs avec filtres:', filters);
      const allKPIs = analytics.getAllKPIs(filters);
      
      // Filtrer les KPIs selon le board actuel (exclure headcount qui est traité séparément)
      const filteredKPIs = allKPIs.filter(kpi => 
        currentBoard.kpis.includes(kpi.id) && kpi.id !== 'headcount' && kpi.id !== 'seniority-and-retention'
      );
      setKpis(filteredKPIs);

      // Calculer les données d'effectif étendues si headcount est dans le board
      if (currentBoard.kpis.includes('headcount')) {
        const extendedHeadcountData = analytics.getExtendedHeadcount(filters);
        setHeadcountData(extendedHeadcountData);
      } else {
        setHeadcountData(null);
      }

      // Génération de l'insight global
      const insight = analytics.generateGlobalInsight(filteredKPIs, filters);
      setGlobalInsight(insight);
    }
  }, [analytics, filters, currentBoard]);

  const handleGenerateInsight = async () => {
    if (!isAIEnabled) return;
    
    setIsLoadingInsight(true);
    
    // Simulation d'un appel à l'API IA
    setTimeout(() => {
      if (analytics) {
        const insight = analytics.generateGlobalInsight(kpis, filters);
        setGlobalInsight(insight);
      }
      setIsLoadingInsight(false);
      
      toast({
        title: "Analyse IA mise à jour",
        description: "Les insights ont été régénérés avec succès"
      });
    }, 2000);
  };

  const handleRefreshKPIInsight = async (kpiId: string) => {
    if (!isAIEnabled || !analytics) return;
    
    setLoadingKPIs(prev => new Set(prev).add(kpiId));
    
    // Simulation d'un appel à l'API IA pour un KPI spécifique
    setTimeout(() => {
      // Régénérer tous les KPIs pour avoir les insights mis à jour
      const allKPIs = analytics.getAllKPIs(filters);
      const filteredKPIs = currentBoard 
        ? allKPIs.filter(kpi => currentBoard.kpis.includes(kpi.id))
        : allKPIs;
      
      setKpis(filteredKPIs);
      setLoadingKPIs(prev => {
        const newSet = new Set(prev);
        newSet.delete(kpiId);
        return newSet;
      });
      
      toast({
        title: "Insight KPI mis à jour",
        description: "L'analyse IA de cet indicateur a été régénérée"
      });
    }, 1500);
  };

  const handleAIToggle = (enabled: boolean) => {
    setIsAIEnabled(enabled);
    
    if (!enabled) {
      setGlobalInsight('');
      toast({
        title: "IA désactivée",
        description: "Les analyses et insights IA ont été désactivés"
      });
    } else {
      toast({
        title: "IA activée",
        description: "Les analyses et insights IA sont maintenant disponibles"
      });
      
      // Générer les insights si l'IA est réactivée
      if (analytics) {
        const insight = analytics.generateGlobalInsight(kpis, filters);
        setGlobalInsight(insight);
      }
    }
  };

  const handleRefresh = () => {
    if (analytics && currentBoard) {
      const allKPIs = analytics.getAllKPIs(filters);
      const filteredKPIs = allKPIs.filter(kpi => 
        currentBoard.kpis.includes(kpi.id) && kpi.id !== 'headcount'
      );
      setKpis(filteredKPIs);
      
      // Recalculer les données d'effectif étendues si nécessaire
      if (currentBoard.kpis.includes('headcount')) {
        const extendedHeadcountData = analytics.getExtendedHeadcount(filters);
        setHeadcountData(extendedHeadcountData);
      }
      
      toast({
        title: "Données actualisées",
        description: "Les indicateurs ont été recalculés"
      });
    }
  };

  const handleBoardCreate = (boardData: Omit<Board, 'id' | 'createdAt'>) => {
    const newBoard: Board = {
      ...boardData,
      id: `board-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setBoards([...boards, newBoard]);
    setCurrentBoard(newBoard);
  };

  const handleBoardUpdate = (updatedBoard: Board) => {
    setBoards(boards.map(board => board.id === updatedBoard.id ? updatedBoard : board));
    setCurrentBoard(updatedBoard);
  };

  const handleKPIOrderChange = (newOrder: string[]) => {
    if (currentBoard) {
      const updatedBoard = { ...currentBoard, kpiOrder: newOrder };
      handleBoardUpdate(updatedBoard);
    }
  };

  const handleBoardDelete = (boardId: string) => {
    const filteredBoards = boards.filter(board => board.id !== boardId);
    setBoards(filteredBoards);
    
    if (currentBoard?.id === boardId) {
      setCurrentBoard(filteredBoards[0] || null);
    }
  };

  const handleKPIInfoClick = (kpi: KPIData) => {
    setSelectedKPI(kpi);
    setIsDetailModalOpen(true);
  };

  const handleKPIChartClick = (kpi: KPIData) => {
    if (analytics) {
      const chartData = analytics.getKPIChartData(kpi.id, filters);
      setSelectedKPI(kpi);
      setSelectedKPIChartData(chartData);
      setIsChartModalOpen(true);
    }
  };

  // Fonctions d'export
  const exportToCSV = () => {
    try {
      const csvData = kpis.map(kpi => ({
        'Indicateur': kpi.name,
        'Valeur': kpi.value,
        'Unité': kpi.unit,
        'Tendance': kpi.trend ? `${kpi.trend > 0 ? '+' : ''}${kpi.trend}%` : 'N/A',
        'Statut': kpi.category === 'positive' ? 'Positif' : kpi.category === 'negative' ? 'Négatif' : 'Neutre',
        'Analyse': kpi.insight || 'N/A'
      }));

      // Ajouter les données d'effectif si disponibles
      if (headcountData) {
        csvData.unshift({
          'Indicateur': 'Effectif total',
          'Valeur': headcountData.totalHeadcount,
          'Unité': 'collaborateurs',
          'Tendance': 'N/A',
          'Statut': 'Neutre',
          'Analyse': `${headcountData.totalETP} ETP, ${headcountData.newHires} nouvelles arrivées`
        });
      }

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `tableau-de-bord-${currentBoard.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export CSV réussi",
        description: "Le tableau de bord a été exporté en CSV"
      });
    } catch (error) {
      console.error('Erreur export CSV:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter en CSV",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    try {
      const excelData = kpis.map(kpi => ({
        'Indicateur': kpi.name,
        'Valeur': kpi.value,
        'Unité': kpi.unit,
        'Tendance (%)': kpi.trend || 0,
        'Statut': kpi.category === 'positive' ? 'Positif' : kpi.category === 'negative' ? 'Négatif' : 'Neutre',
        'Analyse IA': kpi.insight || 'N/A'
      }));

      // Ajouter les données d'effectif si disponibles
      if (headcountData) {
        excelData.unshift({
          'Indicateur': 'Effectif total',
          'Valeur': headcountData.totalHeadcount,
          'Unité': 'collaborateurs',
          'Tendance (%)': 0,
          'Statut': 'Neutre',
          'Analyse IA': `${headcountData.totalETP} ETP équivalent temps plein, ${headcountData.newHires} nouvelles arrivées récentes`
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tableau de bord');
      
      // Ajuster la largeur des colonnes
      const colWidths = [
        { wch: 25 }, // Indicateur
        { wch: 12 }, // Valeur
        { wch: 15 }, // Unité
        { wch: 12 }, // Tendance
        { wch: 10 }, // Statut
        { wch: 50 }  // Analyse IA
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, `tableau-de-bord-${currentBoard.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export Excel réussi",
        description: "Le tableau de bord a été exporté en Excel"
      });
    } catch (error) {
      console.error('Erreur export Excel:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter en Excel",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = () => {
    try {
      const pdf = new jsPDF();
      let currentY = 20;

      // En-tête
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text("TABLEAU DE BORD RH", 20, 25);
      pdf.setFontSize(12);
      pdf.text(currentBoard.name, 20, 35);
      
      currentY = 60;
      pdf.setTextColor(0, 0, 0);
      
      // Informations générales
      pdf.setFontSize(14);
      pdf.text("SYNTHÈSE GÉNÉRALE", 20, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, 20, currentY);
      currentY += 7;
      pdf.text(`Période analysée: ${filters.period}`, 20, currentY);
      currentY += 7;
      if (headcountData) {
        pdf.text(`Effectif total: ${headcountData.totalHeadcount} collaborateurs (${headcountData.totalETP} ETP)`, 20, currentY);
        currentY += 7;
      }
      pdf.text(`Nombre d'indicateurs: ${kpis.length}`, 20, currentY);
      currentY += 15;

      // Indicateurs
      pdf.setFontSize(14);
      pdf.text("INDICATEURS CLÉS", 20, currentY);
      currentY += 15;

      kpis.slice(0, 15).forEach((kpi, index) => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = 30;
        }

        pdf.setFontSize(12);
        pdf.text(`${kpi.name}`, 20, currentY);
        pdf.text(`${kpi.value} ${kpi.unit}`, 120, currentY);
        
        if (kpi.trend !== null) {
          pdf.text(`${kpi.trend > 0 ? '+' : ''}${kpi.trend}%`, 160, currentY);
        }
        
        currentY += 8;
        
        if (kpi.insight) {
          pdf.setFontSize(8);
          const splitText = pdf.splitTextToSize(kpi.insight, 170);
          pdf.text(splitText, 25, currentY);
          currentY += splitText.length * 3 + 5;
        }
        
        currentY += 3;
      });

      const fileName = `tableau-de-bord-${currentBoard.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Export PDF réussi",
        description: "Le tableau de bord a été exporté en PDF"
      });
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter en PDF",
        variant: "destructive"
      });
    }
  };

  const availableKPIs = [
    { id: 'absenteeism', name: 'Taux d\'absentéisme' },
    { id: 'turnover', name: 'Turnover' },
    { id: 'headcount', name: 'Effectif actif' },
    
    { id: 'remote-work', name: 'Télétravail' },
    { id: 'onboarding', name: 'Nouvelles arrivées' },
    { id: 'hr-expenses', name: 'Dépenses RH' },
    { id: 'age-seniority', name: 'Âge et ancienneté' },
    { id: 'seniority-and-retention', name: 'Ancienneté et rétention' },
    { id: 'task-completion', name: 'Tâches RH' },
    { id: 'document-completion', name: 'Dossiers collaborateurs' }
  ];

  const departments = hrData ? [...new Set(hrData.employees.map(emp => emp.department))] as string[] : [];
  const agencies = hrData ? [...new Set(hrData.employees.map(emp => emp.agency))] as string[] : [];

  if (!hrData || !analytics || !currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700">Initialisation du module RH...</h2>
          <p className="text-gray-500">Génération de 250 collaborateurs et analyse des données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Indicateurs RH</h1>
                <p className="text-sm text-gray-500">Module d'analyse et de pilotage RH</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gestion des boards */}
        <BoardManager
          boards={boards}
          currentBoard={currentBoard}
          onBoardChange={setCurrentBoard}
          onBoardCreate={handleBoardCreate}
          onBoardUpdate={handleBoardUpdate}
          onBoardDelete={handleBoardDelete}
          availableKPIs={availableKPIs}
        />

        {/* Filtres */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          departments={departments}
          agencies={agencies}
          onRefresh={handleRefresh}
        />

        {/* Grille des KPIs */}
        <div className="space-y-2 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {currentBoard.name}
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setIsReorderMode(!isReorderMode)}>
                    <GripVertical className="h-4 w-4 mr-2" />
                    {isReorderMode ? 'Arrêter' : 'Activer'} la réorganisation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter en CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exporter en Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Exporter en PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="text-sm text-gray-500 order-2 sm:order-1">
                {(kpis.length + (headcountData ? 1 : 0))} indicateur{(kpis.length + (headcountData ? 1 : 0)) > 1 ? 's' : ''} affiché{(kpis.length + (headcountData ? 1 : 0)) > 1 ? 's' : ''}
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 order-3 sm:order-2">
                <Users className="h-4 w-4" />
                <span>{hrData.employees.filter(emp => emp.status === 'active').length} collaborateurs actifs</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 order-1 sm:order-3">
                <Brain className="h-4 w-4" />
                <span>IA</span>
                <Switch
                  checked={isAIEnabled}
                  onCheckedChange={handleAIToggle}
                />
                {isAIEnabled && <Sparkles className="h-4 w-4 text-primary" />}
              </div>
            </div>
          </div>

          {/* Overlay de mode réorganisation */}
          {isReorderMode && (
            <div className="animate-fade-in bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <GripVertical className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Mode réorganisation activé</h3>
                    <p className="text-xs text-blue-700">Glissez et déposez les cartes pour les réorganiser</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReorderMode(false)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <X className="h-4 w-4 mr-1" />
                  Terminer
                </Button>
              </div>
            </div>
          )}

          {(kpis.length > 0 || headcountData) ? (
            <DraggableKPIGrid
              kpis={kpis}
              headcountData={headcountData}
              kpiOrder={currentBoard.kpiOrder || []}
              enabled={isReorderMode}
              onOrderChange={handleKPIOrderChange}
              onKPIInfoClick={handleKPIInfoClick}
              onKPIChartClick={handleKPIChartClick}
              isAIEnabled={isAIEnabled}
              loadingKPIs={loadingKPIs}
              onRefreshKPIInsight={handleRefreshKPIInsight}
              seniorityRetentionData={analytics && currentBoard.kpis.includes('seniority-and-retention') ? analytics.getSeniorityAndRetention(filters) : undefined}
            />
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun KPI sélectionné</h3>
              <p className="text-gray-500">Ajoutez des indicateurs à votre tableau de bord pour commencer l'analyse.</p>
            </div>
          )}
        </div>

        {/* Insight global - affiché seulement si IA activée */}
        {isAIEnabled && (
          <GlobalInsightPanel
            insight={globalInsight}
            kpis={kpis}
            isLoading={isLoadingInsight}
            onGenerateInsight={handleGenerateInsight}
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Module Indicateurs RH • Données générées automatiquement • IA intégrée</p>
          <p className="mt-1">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Modal des détails KPI */}
      <KPIDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        kpi={selectedKPI}
        filters={filters}
        showInsight={isAIEnabled}
      />

      {/* Modal des graphiques KPI */}
      <KPIChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        kpi={selectedKPI}
        chartData={selectedKPIChartData}
      />
    </div>
  );
};

export default Index;
