'use client';

import React from 'react';
import { INTAKE_QUESTIONS } from '@/lib/intakePrompt';

interface ProgressTrackProps {
  currentQuestion: number;
  phase: 'interviewing' | 'awaiting_confirmation' | 'complete';
}

export default function ProgressTrack({
  currentQuestion,
  phase,
}: ProgressTrackProps) {
  const total = INTAKE_QUESTIONS.length;
  const reviewing = phase !== 'interviewing';

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-cosmic-text-muted">
        <span>
          {reviewing
            ? phase === 'complete'
              ? 'Complete'
              : 'Reviewing summary'
            : `Question ${Math.min(currentQuestion, total)} of ${total}`}
        </span>
        <span>{reviewing ? '' : INTAKE_QUESTIONS[currentQuestion - 1]?.title ?? ''}</span>
      </div>
      <div className="flex gap-1.5">
        {INTAKE_QUESTIONS.map((q) => {
          const isDone = reviewing || q.number < currentQuestion;
          const isActive = !reviewing && q.number === currentQuestion;
          return (
            <div
              key={q.number}
              title={`${q.number}. ${q.title}`}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                isDone
                  ? 'bg-gradient-to-r from-cosmic-primary to-cosmic-accent'
                  : isActive
                  ? 'bg-cosmic-primary-light/70 animate-pulse'
                  : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
