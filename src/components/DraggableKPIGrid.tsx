import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  
  // Ajouter headcount en premier si présent
  if (headcountData) {
    allItems.push({
      id: 'headcount',
      type: 'headcount',
      data: headcountData
    });
  }
  
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
  
  // Ajouter les KPIs qui ne sont pas dans l'ordre (nouveaux KPIs)
  kpis.forEach(kpi => {
    if (!kpiOrder.includes(kpi.id) && !allItems.find(item => item.id === kpi.id)) {
      allItems.push({
        id: kpi.id,
        type: 'kpi',
        data: kpi
      });
    }
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(allItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre (exclure headcount car il est géré séparément)
    const newOrder = items
      .filter(item => item.type === 'kpi')
      .map(item => item.id);
    
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
      <Droppable droppableId="kpi-grid" direction="horizontal">
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
                    className={`animate-fade-in transition-transform ${
                      snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl' : ''
                    } ${item.id === 'headcount' ? 'col-span-full lg:col-span-4 xl:col-span-4' : ''}`}
                    style={{
                      ...provided.draggableProps.style,
                      animationDelay: `${index * 100}ms`
                    }}
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
                    
                    {/* Indicateur de drag */}
                    {snapshot.isDragging && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full opacity-75">
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