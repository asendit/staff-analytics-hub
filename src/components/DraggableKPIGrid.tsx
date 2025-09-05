import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { KPIData, ExtendedHeadcountData } from '../services/hrAnalytics';
import KPICard from './KPICard';
import HeadcountCard from './HeadcountCard';

interface DraggableKPIGridProps {
  kpis: KPIData[];
  headcountData: ExtendedHeadcountData | null;
  kpiOrder: string[];
  enabled?: boolean;
  onOrderChange: (newOrder: string[]) => void;
  onKPIInfoClick: (kpi: KPIData) => void;
  onKPIChartClick: (kpi: KPIData) => void;
  isAIEnabled: boolean;
}

const DraggableKPIGrid: React.FC<DraggableKPIGridProps> = ({
  kpis,
  headcountData,
  kpiOrder,
  enabled = false,
  onOrderChange,
  onKPIInfoClick,
  onKPIChartClick,
  isAIEnabled
}) => {
  // Construit la liste des éléments dans l'ordre souhaité
  const buildAllItems = () => {
    const items: Array<{ id: string; type: 'kpi' | 'headcount'; data: KPIData | ExtendedHeadcountData }> = [];

    const pushed = new Set<string>();

    // 1) Respecter l'ordre fourni (incluant 'headcount')
    (kpiOrder || []).forEach((id) => {
      if (id === 'headcount' && headcountData) {
        items.push({ id: 'headcount', type: 'headcount', data: headcountData });
        pushed.add('headcount');
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

    // 3) Ajouter les autres KPIs non présents
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
            className={`relative animate-fade-in ${item.id === 'headcount' ? 'col-span-full lg:col-span-4 xl:col-span-4' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {item.type === 'headcount' ? (
              <HeadcountCard
                data={item.data as ExtendedHeadcountData}
                onInfoClick={() => onKPIInfoClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                onChartClick={() => onKPIChartClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                showInsight={isAIEnabled}
              />
            ) : (
              <KPICard
                kpi={item.data as KPIData}
                onInfoClick={() => onKPIInfoClick(item.data as KPIData)}
                onChartClick={() => onKPIChartClick(item.data as KPIData)}
                showInsight={isAIEnabled}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Mode réorganisation activé
  return (
    <DragDropContext
      onDragStart={() => (document.body.style.cursor = 'grabbing')}
      onDragEnd={(result) => {
        document.body.style.cursor = '';
        handleDragEnd(result);
      }}
    >
      <Droppable droppableId="kpi-grid" direction="vertical">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 md:gap-5 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {allItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`relative z-0 animate-fade-in transition-transform select-none min-h-[160px] ${
                      snapshot.isDragging ? 'scale-105 shadow-xl' : ''
                    } col-span-1`}
                    style={{
                      ...provided.draggableProps.style,
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Calque poignée couvrant toute la carte */}
                    <div
                      className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                      {...provided.dragHandleProps}
                      aria-label="Déplacer la carte"
                      title="Déplacer la carte"
                    />

                    {item.type === 'headcount' ? (
                      <HeadcountCard
                        data={item.data as ExtendedHeadcountData}
                        onInfoClick={() => onKPIInfoClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                        onChartClick={() => onKPIChartClick(createTempKPIFromHeadcount(item.data as ExtendedHeadcountData))}
                        showInsight={isAIEnabled}
                      />
                    ) : (
                      <KPICard
                        kpi={item.data as KPIData}
                        onInfoClick={() => onKPIInfoClick(item.data as KPIData)}
                        onChartClick={() => onKPIChartClick(item.data as KPIData)}
                        showInsight={isAIEnabled}
                      />
                    )}

                    {/* Badge indicateur en mode drag */}
                    {snapshot.isDragging && (
                      <div className="absolute top-2 right-2 z-30 bg-primary text-white text-xs px-2 py-1 rounded-full opacity-90">
                        Déplacer
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableKPIGrid;
