'use client';

import React, { useEffect, useRef } from 'react';

export type ChatTurn = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  meta?: string;
};

interface ConversationLogProps {
  turns: ChatTurn[];
}

export default function ConversationLog({ turns }: ConversationLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length]);

  return (
    <div className="flex flex-col gap-4">
      {turns.map((turn) => (
        <div
          key={turn.id}
          className={`flex ${
            turn.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
              turn.role === 'assistant'
                ? 'bg-white/5 text-white border border-white/10 backdrop-blur'
                : 'bg-gradient-to-br from-cosmic-primary to-cosmic-accent text-white'
            }`}
          >
            {turn.meta && (
              <div
                className={`mb-1 text-[10px] font-semibold uppercase tracking-widest ${
                  turn.role === 'assistant'
                    ? 'text-cosmic-primary-light'
                    : 'text-white/80'
                }`}
              >
                {turn.meta}
              </div>
            )}
            <p className="whitespace-pre-wrap">{turn.content}</p>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
