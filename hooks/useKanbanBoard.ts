'use client';

import { useState, useEffect, useCallback } from 'react';
import { BoardState, Card, Column } from '@/lib/types';
import { loadBoardState, saveBoardState } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const useKanbanBoard = () => {
  const [state, setState] = useState<BoardState>({ columns: [], cards: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state
  useEffect(() => {
    const initialState = loadBoardState();
    setState(initialState);
    setIsLoaded(true);
  }, []);

  // Save state with debounce
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      saveBoardState(state);
    }, 300);

    return () => clearTimeout(timer);
  }, [state, isLoaded]);

  const addCard = useCallback((columnId: string, title: string, description: string = '') => {
    setState((prev) => {
      const newCard: Card = {
        id: uuidv4(),
        title,
        description,
        columnId,
        order: prev.cards.filter((c) => c.columnId === columnId).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        cards: [...prev.cards, newCard],
      };
    });
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<Card>) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      ),
    }));
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));
  }, []);

  const moveCard = useCallback(
    (cardId: string, newColumnId: string, newOrder: number) => {
      setState((prev) => {
        const card = prev.cards.find((c) => c.id === cardId);
        if (!card) return prev;

        const cardsInNewColumn = prev.cards.filter(
          (c) => c.columnId === newColumnId && c.id !== cardId
        );

        return {
          ...prev,
          cards: prev.cards.map((c) => {
            if (c.id === cardId) {
              return { ...c, columnId: newColumnId, order: newOrder };
            }
            if (c.columnId === newColumnId && c.order >= newOrder) {
              return { ...c, order: c.order + 1 };
            }
            return c;
          }),
        };
      });
    },
    []
  );

  const addColumn = useCallback((title: string) => {
    setState((prev) => {
      const newColumn: Column = {
        id: uuidv4(),
        title,
        order: prev.columns.length,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        columns: [...prev.columns, newColumn],
      };
    });
  }, []);

  const updateColumn = useCallback((columnId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title } : col
      ),
    }));
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setState((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
      cards: prev.cards.filter((card) => card.columnId !== columnId),
    }));
  }, []);

  const clearDemoCards = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => !card.isDemo),
    }));
  }, []);

  return {
    state,
    isLoaded,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addColumn,
    updateColumn,
    deleteColumn,
    clearDemoCards,
  };
};
