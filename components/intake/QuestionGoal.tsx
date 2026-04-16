'use client';

import React from 'react';
import type { QuestionDepth } from '@/lib/intakePrompt';

interface QuestionGoalProps {
  goal: string;
  depth: QuestionDepth;
}

const depthLabel: Record<QuestionDepth, string> = {
  SURFACE: 'Brief is fine',
  MEDIUM: 'Some detail',
  HIGH: 'Specifics required',
};

const depthColor: Record<QuestionDepth, string> = {
  SURFACE: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
  MEDIUM: 'border-cosmic-primary-light/30 bg-cosmic-primary/10 text-cosmic-primary-light',
  HIGH: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
};

export default function QuestionGoal({ goal, depth }: QuestionGoalProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
        <span className="font-semibold uppercase tracking-widest text-white/50">
          Goal
        </span>
        <span className="text-white/85">{goal}</span>
      </span>
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 font-semibold uppercase tracking-widest ${depthColor[depth]}`}
      >
        {depthLabel[depth]}
      </span>
    </div>
  );
}
