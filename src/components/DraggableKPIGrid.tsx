import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { KPIData, ExtendedHeadcountData } from '../services/hrAnalytics';
import KPICard from './KPICard';
import HeadcountCard from './HeadcountCard';

interface DraggableKPIGridProps {
  kpis: KPIData[];
  headcountData: ExtendedHeadcountData | null;
  kpiOrder: string[];
  onOrderChange: (newOrder: string[]) => void;
  onKPIInfoClick: (kpi: KPIData) => void;
  onKPIChartClick: (kpi: KPIData) => void;
  isAIEnabled: boolean;
}

const DraggableKPIGrid: React.FC<DraggableKPIGridProps> = ({
  kpis,
  headcountData,
  kpiOrder,
  onOrderChange,
  onKPIInfoClick,
  onKPIChartClick,
  isAIEnabled
}) => {
  // Créer une liste ordonnée des éléments (incluant headcount si présent)
  const allItems: Array<{id: string, type: 'kpi' | 'headcount', data: KPIData | ExtendedHeadcountData}> = [];
  
  // Construire la liste en respectant l'ordre défini (incluant 'headcount')
  kpiOrder.forEach(id => {
    if (id === 'headcount' && headcountData) {
      allItems.push({ id: 'headcount', type: 'headcount', data: headcountData });
    } else {
      const kpi = kpis.find(k => k.id === id);
      if (kpi) allItems.push({ id: kpi.id, type: 'kpi', data: kpi });
    }
  });
  
  // Ajouter les KPIs selon l'ordre défini
  kpiOrder.forEach(kpiId => {
    const kpi = kpis.find(k => k.id === kpiId);
    if (kpi) {
      allItems.push({
        id: kpi.id,
        type: 'kpi',
        data: kpi
      });
    }
  });
  
  // Ajouter les éléments non présents dans l'ordre (nouveaux KPIs ou headcount)
  if (headcountData && !allItems.find(item => item.id === 'headcount')) {
    allItems.push({ id: 'headcount', type: 'headcount', data: headcountData });
  }
  kpis.forEach(kpi => {
    if (!allItems.find(item => item.id === kpi.id)) {
      allItems.push({ id: kpi.id, type: 'kpi', data: kpi });
    }
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(allItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre (incluant headcount)
    const newOrder = items.map(item => item.id);
    onOrderChange(newOrder);
  };

  const createTempKPIFromHeadcount = (data: ExtendedHeadcountData): KPIData => ({
    id: 'headcount',
    name: 'Effectif - Vue d\'ensemble',
    value: data.totalHeadcount,
    unit: 'collaborateurs',
    trend: data.trend,
    comparison: data.comparison,
    category: data.category,
    insight: data.insight
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="kpi-grid" direction="vertical">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {allItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative animate-fade-in transition-transform cursor-grab active:cursor-grabbing select-none ${
                      snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl' : ''
                    } ${item.id === 'headcount' ? 'col-span-full lg:col-span-4 xl:col-span-4' : ''}`}
                    style={{
                      ...provided.draggableProps.style,
                      animationDelay: `${index * 100}ms`
                    }}
                    title="Déplacer cette carte"
                    aria-label="Déplacer cette carte"
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
                    {snapshot.isDragging && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full opacity-80">
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