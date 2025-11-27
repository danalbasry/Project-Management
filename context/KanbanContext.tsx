'use client';

import React, { createContext, useContext } from 'react';
import { BoardState, Card } from '@/lib/types';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

interface KanbanContextType {
  state: BoardState;
  isLoaded: boolean;
  addCard: (columnId: string, title: string, description?: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, newColumnId: string, newOrder: number) => void;
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  clearDemoCards: () => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const kanban = useKanbanBoard();

  return (
    <KanbanContext.Provider value={kanban}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within KanbanProvider');
  }
  return context;
};
