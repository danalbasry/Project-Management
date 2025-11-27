'use client';

import React, { useState, useEffect } from 'react';
import { Card as CardType } from '@/lib/types';
import { useKanban } from '@/context/KanbanContext';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface CardDetailModalProps {
  card: CardType;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const { updateCard, deleteCard } = useKanban();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [priority, setPriority] = useState(card.priority || 'medium');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    updateCard(card.id, {
      title: title || 'Untitled',
      description,
      priority: priority as 'low' | 'medium' | 'high',
    });
    onClose();
  };

  const handleDelete = () => {
    if (isDeleting) {
      deleteCard(card.id);
      onClose();
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Card</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Card title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Card description"
                  rows={4}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'low' | 'medium' | 'high')
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Tags Display */}
              {card.tags && card.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Badge */}
              {card.isDemo && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    This is a demo card. Click "Clear Demo Data" to remove all demo cards.
                  </p>
                </div>
              )}

              {/* Created Date */}
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                <p>
                  Created: {new Date(card.createdAt).toLocaleDateString()}{' '}
                  {new Date(card.createdAt).toLocaleTimeString()}
                </p>
                <p>
                  Updated: {new Date(card.updatedAt).toLocaleDateString()}{' '}
                  {new Date(card.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button onClick={onClose} variant="secondary" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className={`flex-1 ${isDeleting ? 'bg-red-700 hover:bg-red-800' : ''}`}
              >
                {isDeleting ? 'Confirm Delete?' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardDetailModal;
