export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  tags?: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  createdAt: string;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}
