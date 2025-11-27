'use client';

import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '@/lib/types';
import { useKanban } from '@/context/KanbanContext';
import Card from './Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ColumnProps {
  column: ColumnType;
  onCardClick?: (cardId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onCardClick }) => {
  const { state, addCard, updateColumn, deleteColumn } = useKanban();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const columnCards = state.cards
    .filter((card) => card.columnId === column.id)
    .sort((a, b) => a.order - b.order);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle.trim(), '');
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      updateColumn(column.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="min-w-[320px] bg-transparent rounded-lg p-4 flex flex-col border-2 border-cosmic-border">
      {/* Column Header */}
      <div className="mb-4">
        {isEditingTitle ? (
          <div className="flex gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <Button
              onClick={handleUpdateTitle}
              size="sm"
              className="whitespace-nowrap"
            >
              Save
            </Button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center justify-between cursor-pointer group"
          >
            <h2 className="text-lg font-bold text-cosmic-text group-hover:text-cosmic-primary">
              {column.title}
            </h2>
            <span className="bg-cosmic-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
              {columnCards.length}
            </span>
          </div>
        )}
      </div>

      {/* Cards */}
      <SortableContext
        items={columnCards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col gap-3 mb-4">
          {columnCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick?.(card.id)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add Card Form */}
      {isAddingCard ? (
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Card title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCard();
              if (e.key === 'Escape') setIsAddingCard(false);
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <Button onClick={handleAddCard} size="sm" className="flex-1">
              Add
            </Button>
            <Button
              onClick={() => setIsAddingCard(false)}
              size="sm"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAddingCard(true)} className="w-full">
          + Add Card
        </Button>
      )}
    </div>
  );
};

export default Column;
