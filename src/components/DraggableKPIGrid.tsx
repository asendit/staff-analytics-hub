import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { KPIData, ExtendedHeadcountData } from '../services/hrAnalytics';
import KPICard from './KPICard';
import HeadcountCard from './HeadcountCard';
import SeniorityRetentionCard from './SeniorityRetentionCard';

interface DraggableKPIGridProps {
  kpis: KPIData[];
  headcountData: ExtendedHeadcountData | null;
  kpiOrder: string[];
  enabled?: boolean;
  onOrderChange: (newOrder: string[]) => void;
  onKPIInfoClick: (kpi: KPIData) => void;
  onKPIChartClick: (kpi: KPIData) => void;
  isAIEnabled: boolean;
  loadingKPIs?: Set<string>;
  onRefreshKPIInsight?: (kpiId: string) => void;
  seniorityRetentionData?: any;
}

const DraggableKPIGrid: React.FC<DraggableKPIGridProps> = ({
  kpis,
  headcountData,
  kpiOrder,
  enabled = false,
  onOrderChange,
  onKPIInfoClick,
  onKPIChartClick,
  isAIEnabled,
  loadingKPIs = new Set(),
  onRefreshKPIInsight,
  seniorityRetentionData
}) => {
  // Construit la liste des éléments dans l'ordre souhaité
  const buildAllItems = () => {
    const items: Array<{ id: string; type: 'kpi' | 'headcount' | 'seniority-retention'; data: any }> = [];

    const pushed = new Set<string>();

    // 1) Respecter l'ordre fourni (incluant 'headcount' et 'seniority-and-retention')
    (kpiOrder || []).forEach((id) => {
      if (id === 'headcount' && headcountData) {
        items.push({ id: 'headcount', type: 'headcount', data: headcountData });
        pushed.add('headcount');
      } else if (id === 'seniority-and-retention' && seniorityRetentionData) {
        items.push({ id: 'seniority-and-retention', type: 'seniority-retention', data: seniorityRetentionData });
        pushed.add('seniority-and-retention');
      } else {
        const kpi = kpis.find((k) => k.id === id);
        if (kpi) {
          items.push({ id: kpi.id, type: 'kpi', data: kpi });
          pushed.add(kpi.id);
        }
      }
    });

    // 2) Ajouter headcount s'il n'est pas encore dans la liste
    if (headcountData && !pushed.has('headcount')) {
      items.push({ id: 'headcount', type: 'headcount', data: headcountData });
      pushed.add('headcount');
    }

    // 3) Ajouter seniority-and-retention s'il n'est pas encore dans la liste
    if (seniorityRetentionData && !pushed.has('seniority-and-retention')) {
      items.push({ id: 'seniority-and-retention', type: 'seniority-retention', data: seniorityRetentionData });
      pushed.add('seniority-and-retention');
    }

    // 4) Ajouter les autres KPIs non présents
    kpis.forEach((kpi) => {
      if (!pushed.has(kpi.id)) {
        items.push({ id: kpi.id, type: 'kpi', data: kpi });
        pushed.add(kpi.id);
      }
    });

    return items;
  };

  const allItems = buildAllItems();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(allItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre incluant éventuellement 'headcount'
    const newOrder = items.map((item) => item.id);
    onOrderChange(newOrder);
  };

  const createTempKPIFromHeadcount = (data: ExtendedHeadcountData): KPIData => ({
    id: 'headcount',
    name: "Effectif - Vue d'ensemble",
    value: data.totalHeadcount,
    unit: 'collaborateurs',
    trend: data.trend,
    comparison: data.comparison,
    category: data.category,
    insight: data.insight,
  });

  // Rendu statique quand le mode réorganisation n'est pas activé
  if (!enabled) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {allItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative animate-fade-in ${
              item.id === 'headcount' ? 'col-span-full lg:col-span-4 xl:col-span-4' : 
              item.id === 'seniority-and-retention' ? 'col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2' : 
              ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {item.type === 'headcount' ? (
              <HeadcountCard
                data={item.data as ExtendedHeadcountData}
                onInfoClick={() => onKPIInfoClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                onChartClick={() => onKPIChartClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                showInsight={isAIEnabled}
              />
            ) : item.type === 'seniority-retention' ? (
              <SeniorityRetentionCard
                data={item.data}
                onInfoClick={onKPIInfoClick}
                onChartClick={onKPIChartClick}
                showInsight={isAIEnabled}
                isLoadingInsight={loadingKPIs.has(item.id)}
                onRefreshInsight={onRefreshKPIInsight ? () => onRefreshKPIInsight(item.id) : undefined}
              />
            ) : (
              <KPICard
                kpi={item.data as KPIData}
                onInfoClick={() => onKPIInfoClick(item.data as KPIData)}
                onChartClick={() => onKPIChartClick(item.data as KPIData)}
                showInsight={isAIEnabled}
                isLoadingInsight={loadingKPIs.has(item.id)}
                onRefreshInsight={onRefreshKPIInsight ? () => onRefreshKPIInsight(item.id) : undefined}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Mode réorganisation activé avec positionnement clair
  return (
    <DragDropContext
      onDragStart={() => (document.body.style.cursor = 'grabbing')}
      onDragEnd={(result) => {
        document.body.style.cursor = '';
        handleDragEnd(result);
      }}
    >
      <Droppable droppableId="kpi-grid">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-muted/20 rounded-lg p-2' : ''
            }`}
          >
            {allItems.map((item, index) => {
              // Calculer le nombre de colonnes selon le type et la taille d'écran
              const getColSpan = () => {
                if (item.id === 'headcount') {
                  return 'col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8'; // Toute la largeur
                }
                if (item.id === 'seniority-and-retention') {
                  return 'col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4'; // Taille double
                }
                return 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2'; // 2 colonnes sur la grille fine
              };

              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    const isDragging = snapshot.isDragging;
                    
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative animate-fade-in transition-all duration-200 select-none ${
                          isDragging 
                            ? 'scale-105 shadow-lg z-50 opacity-80' 
                            : 'hover:shadow-md'
                        } ${getColSpan()}`}
                        style={{
                          ...provided.draggableProps.style,
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        {/* Poignée de drag simple */}
                        <div
                          className={`absolute inset-0 z-20 transition-all duration-150 ${
                            isDragging 
                              ? 'cursor-grabbing bg-primary/5 border border-primary/30 rounded-lg' 
                              : 'cursor-grab hover:bg-primary/5 rounded-lg opacity-0 hover:opacity-100'
                          }`}
                          {...provided.dragHandleProps}
                          aria-label="Déplacer la carte"
                          title="Cliquez et glissez pour réorganiser"
                        />

                        {item.type === 'headcount' ? (
                          <HeadcountCard
                            data={item.data as ExtendedHeadcountData}
                            onInfoClick={() => onKPIInfoClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                            onChartClick={() => onKPIChartClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                            showInsight={isAIEnabled}
                          />
                        ) : item.type === 'seniority-retention' ? (
                          <SeniorityRetentionCard
                            data={item.data}
                            onInfoClick={onKPIInfoClick}
                            onChartClick={onKPIChartClick}
                            showInsight={isAIEnabled}
                            isLoadingInsight={loadingKPIs.has(item.id)}
                            onRefreshInsight={onRefreshKPIInsight ? () => onRefreshKPIInsight(item.id) : undefined}
                          />
                        ) : (
                          <KPICard
                            kpi={item.data as KPIData}
                            onInfoClick={() => onKPIInfoClick(item.data as KPIData)}
                            onChartClick={() => onKPIChartClick(item.data as KPIData)}
                            showInsight={isAIEnabled}
                            isLoadingInsight={loadingKPIs.has(item.id)}
                            onRefreshInsight={onRefreshKPIInsight ? () => onRefreshKPIInsight(item.id) : undefined}
                          />
                        )}

                        {/* Indicateur simple pendant le drag */}
                        {isDragging && (
                          <div className="absolute -top-2 -right-2 z-30 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow-md">
                            En déplacement
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
            
            {/* Placeholder pour montrer l'emplacement de drop */}
            {provided.placeholder && (
              <div 
                className="transition-all duration-200"
                style={{ 
                  gridColumn: snapshot.isDraggingOver ? 'span 2' : 'span 1'
                }}
              >
                {provided.placeholder}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableKPIGrid;
