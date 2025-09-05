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

  // Mode réorganisation activé avec repositionnement visuel pendant le drag
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
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 transition-all duration-300 ${
              snapshot.isDraggingOver ? 'bg-muted/30 rounded-xl p-3' : ''
            }`}
          >
            {allItems.map((item, index) => {
              // Calculer le nombre de colonnes selon le type et la taille d'écran
              const getColSpan = () => {
                if (item.id === 'headcount') {
                  return 'col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8'; // Toute la largeur
                }
                return 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2'; // 2 colonnes sur la grille fine
              };

              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    const isDragging = snapshot.isDragging;
                    const isDraggedOver = snapshot.combineTargetFor !== null;
                    
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative animate-fade-in transition-all duration-300 ease-out select-none ${
                          isDragging 
                            ? 'scale-110 shadow-2xl z-50 rotate-1 opacity-90' 
                            : isDraggedOver 
                              ? 'scale-95 opacity-70 transform translate-x-2'
                              : 'hover:shadow-lg scale-100 opacity-100'
                        } ${getColSpan()}`}
                        style={{
                          ...provided.draggableProps.style,
                          animationDelay: `${index * 100}ms`,
                          transform: isDragging 
                            ? `${provided.draggableProps.style?.transform || ''} rotate(2deg) scale(1.05)` 
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        {/* Zone de drop visible entre les éléments */}
                        {!isDragging && (
                          <div className="absolute -left-2 top-0 bottom-0 w-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <div className="w-1 h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 rounded-full" />
                          </div>
                        )}

                        {/* Poignée de drag avec feedback amélioré */}
                        <div
                          className={`absolute inset-0 z-20 transition-all duration-200 ${
                            isDragging 
                              ? 'cursor-grabbing bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/40 rounded-xl backdrop-blur-sm' 
                              : 'cursor-grab hover:bg-primary/5 rounded-lg opacity-0 hover:opacity-100'
                          }`}
                          {...provided.dragHandleProps}
                          aria-label="Déplacer la carte"
                          title="Cliquez et maintenez pour déplacer"
                        >
                          {/* Indicateur de grip subtil */}
                          {!isDragging && (
                            <div className="absolute top-3 right-3 opacity-0 hover:opacity-60 transition-opacity">
                              <div className="grid grid-cols-2 gap-1">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              </div>
                            </div>
                          )}
                        </div>

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

                        {/* Indicateur de position pendant le drag */}
                        {isDragging && (
                          <div className="absolute -top-3 -right-3 z-30 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full shadow-xl border border-primary-foreground/20 animate-bounce">
                            <span className="flex items-center gap-1">
                              <span>📍</span>
                              Déplacer ici
                            </span>
                          </div>
                        )}

                        {/* Zone de drop visible à droite */}
                        {!isDragging && (
                          <div className="absolute -right-2 top-0 bottom-0 w-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <div className="w-1 h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
            {provided.placeholder && (
              <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 min-h-[100px] border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Déposez ici</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableKPIGrid;
