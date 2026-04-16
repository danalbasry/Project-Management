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
import Link from 'next/link';
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
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-cosmic-text mb-2">Project Board</h1>
            <p className="text-cosmic-text-muted">Manage your projects with ease</p>
          </div>
          <Link
            href="/intake"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cosmic-primary/30 transition hover:scale-[1.02]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
            Voice Intake
          </Link>
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
