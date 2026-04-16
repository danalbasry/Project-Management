'use client';

import React from 'react';

interface AudioVisualizerProps {
  levels: number[];
  active: boolean;
}

export default function AudioVisualizer({
  levels,
  active,
}: AudioVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-20 w-full">
      {levels.map((level, i) => {
        const height = active ? 8 + level * 64 : 6;
        return (
          <span
            key={i}
            className="rounded-full bg-gradient-to-b from-cosmic-primary-light to-cosmic-accent transition-[height] duration-75 ease-out"
            style={{
              width: 4,
              height: `${height}px`,
              opacity: active ? 0.6 + level * 0.4 : 0.25,
            }}
          />
        );
      })}
    </div>
  );
}
