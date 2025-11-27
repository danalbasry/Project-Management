'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useKanban } from '@/context/KanbanContext';
import Column from '@/components/board/Column';
import Card from '@/components/board/Card';
import Button from '@/components/ui/Button';
import CardDetailModal from '@/components/modals/CardDetailModal';

export default function Home() {
  const { state, isLoaded, moveCard, clearDemoCards } = useKanban();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  const selectedCard = useMemo(
    () => state.cards.find((card) => card.id === selectedCardId),
    [state.cards, selectedCardId]
  );

  const hasDemoCards = useMemo(
    () => state.cards.some((card) => card.isDemo),
    [state.cards]
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-cosmic-text text-xl">Loading...</div>
      </div>
    );
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    // Handle reordering
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeCard = state.cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    // Find the target column
    const targetCard = state.cards.find((c) => c.id === over.id);
    const targetColumn = targetCard
      ? targetCard.columnId
      : state.columns.find((col) => col.id === over.id)?.id;

    if (!targetColumn) return;

    const cardsInTargetColumn = state.cards.filter(
      (c) => c.columnId === targetColumn
    );
    const newOrder = cardsInTargetColumn.length;

    moveCard(activeCard.id, targetColumn, newOrder);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cosmic-text mb-2">Project Board</h1>
          <p className="text-cosmic-text-muted">Manage your projects with ease</p>
        </div>

        {/* Clear Demo Data Button */}
        {hasDemoCards && (
          <div className="mb-4 flex gap-2">
            <Button
              onClick={clearDemoCards}
              variant="secondary"
              className="text-sm"
            >
              Clear Demo Data
            </Button>
          </div>
        )}

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {state.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onCardClick={setSelectedCardId}
              />
            ))}

            {/* Add Column Button */}
            <div className="min-w-[300px] flex items-start pt-0">
              <Button
                onClick={() => setShowAddColumn(!showAddColumn)}
                className="w-full"
                variant="secondary"
              >
                + Add Column
              </Button>
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <Card
                card={state.cards.find((c) => c.id === activeId)!}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCardId(null)}
        />
      )}
    </main>
  );
}
