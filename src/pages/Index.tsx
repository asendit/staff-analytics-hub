import React, { useState, useEffect } from 'react';
import { generateHRData } from '../data/hrDataGenerator';
import { convertHRData } from '../utils/dataConverter';
import { HRAnalytics, KPIData, KPIChartData, FilterOptions, HRData } from '../services/hrAnalytics';
import KPICard from '../components/KPICard';
import KPIDetailModal from '../components/KPIDetailModal';
import KPIChartModal from '../components/KPIChartModal';
import FilterPanel from '../components/FilterPanel';
import BoardManager, { Board } from '../components/BoardManager';
import GlobalInsightPanel from '../components/GlobalInsightPanel';
import { Users, BarChart3, Brain, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [analytics, setAnalytics] = useState<HRAnalytics | null>(null);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ period: 'year' });
  const [globalInsight, setGlobalInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null);
  const [selectedKPIChartData, setSelectedKPIChartData] = useState<KPIChartData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  // Initialisation des données
  useEffect(() => {
    console.log('Initialisation du module RH...');
    const generatedData = generateHRData();
    const convertedData = convertHRData(generatedData);
    setHrData(convertedData);
    setAnalytics(new HRAnalytics(convertedData));

    // Création du board par défaut
    const defaultBoard: Board = {
      id: 'default',
      name: 'Tableau de Bord Principal',
      description: 'Vue d\'ensemble de tous les indicateurs RH',
      kpis: [
        'absenteeism', 'turnover', 'headcount', 'work-utilization', 'remote-work',
        'onboarding', 'hr-expenses', 'age-seniority', 'task-completion', 'document-completion'
      ],
      createdAt: new Date().toISOString(),
      isDefault: true
    };

    setBoards([defaultBoard]);
    setCurrentBoard(defaultBoard);

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
      
      // Filtrer les KPIs selon le board actuel
      const filteredKPIs = allKPIs.filter(kpi => currentBoard.kpis.includes(kpi.id));
      setKpis(filteredKPIs);

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
      const filteredKPIs = allKPIs.filter(kpi => currentBoard.kpis.includes(kpi.id));
      setKpis(filteredKPIs);
      
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

  const availableKPIs = [
    { id: 'absenteeism', name: 'Taux d\'absentéisme' },
    { id: 'turnover', name: 'Turnover' },
    { id: 'headcount', name: 'Effectif actif' },
    { id: 'work-utilization', name: 'Utilisation du temps' },
    { id: 'remote-work', name: 'Télétravail' },
    { id: 'onboarding', name: 'Durée d\'onboarding' },
    { id: 'hr-expenses', name: 'Dépenses RH' },
    { id: 'age-seniority', name: 'Âge et ancienneté' },
    { id: 'task-completion', name: 'Tâches RH' },
    { id: 'document-completion', name: 'Dossiers collaborateurs' }
  ];

  const departments = hrData ? [...new Set(hrData.employees.map(emp => emp.department))] as string[] : [];

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
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{hrData.employees.filter(emp => emp.status === 'active').length} collaborateurs actifs</span>
              </div>
              <div className="flex items-center space-x-3">
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
          onRefresh={handleRefresh}
        />

        {/* Grille des KPIs */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentBoard.name}
            </h2>
            <div className="text-sm text-gray-500">
              {kpis.length} indicateur{kpis.length > 1 ? 's' : ''} affiché{kpis.length > 1 ? 's' : ''}
            </div>
          </div>

          {kpis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <div key={kpi.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <KPICard 
                    kpi={kpi} 
                    onInfoClick={() => handleKPIInfoClick(kpi)}
                    onChartClick={() => handleKPIChartClick(kpi)}
                    showInsight={isAIEnabled}
                  />
                </div>
              ))}
            </div>
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
