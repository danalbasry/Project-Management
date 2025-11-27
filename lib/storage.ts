import { BoardState } from './types';
import { DEMO_BOARD_STATE, STORAGE_KEY } from './constants';

export const loadBoardState = (): BoardState => {
  if (typeof window === 'undefined') {
    return DEMO_BOARD_STATE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load board state:', error);
  }

  return DEMO_BOARD_STATE;
};

export const saveBoardState = (state: BoardState): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save board state:', error);
  }
};

export const clearDemoData = (): BoardState => {
  if (typeof window === 'undefined') {
    return DEMO_BOARD_STATE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = {
        ...parsed,
        cards: parsed.cards.filter((card: any) => !card.isDemo),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    }
  } catch (error) {
    console.error('Failed to clear demo data:', error);
  }

  return DEMO_BOARD_STATE;
};
