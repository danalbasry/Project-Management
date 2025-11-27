'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/lib/types';

interface CardProps {
  card: CardType;
  isDragging?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, isDragging, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (!isSortableDragging && onClick) {
      onClick();
    }
  };

  const isBeingDragged = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-cosmic-card rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border border-cosmic-border ${
        isBeingDragged ? 'opacity-75 scale-105' : ''
      } ${card.isDemo ? 'border-2 border-cosmic-primary' : ''}`}
    >
      {card.isDemo && (
        <div className="mb-2 inline-block bg-cosmic-primary bg-opacity-20 text-cosmic-primary text-xs font-semibold px-2 py-1 rounded">
          Demo
        </div>
      )}

      <h3 className="font-semibold text-cosmic-text mb-2">{card.title}</h3>

      {card.description && (
        <p className="text-cosmic-text-muted text-sm mb-3 line-clamp-3">
          {card.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {card.priority && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              card.priority === 'high'
                ? 'bg-red-100 text-red-700'
                : card.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
          </span>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
