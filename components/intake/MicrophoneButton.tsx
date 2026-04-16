'use client';

import React from 'react';

interface MicrophoneButtonProps {
  state: 'idle' | 'recording' | 'transcribing' | 'thinking' | 'disabled';
  onClick: () => void;
  disabled?: boolean;
}

export default function MicrophoneButton({
  state,
  onClick,
  disabled,
}: MicrophoneButtonProps) {
  const label =
    state === 'recording'
      ? 'Stop recording'
      : state === 'transcribing'
      ? 'Transcribing…'
      : state === 'thinking'
      ? 'Thinking…'
      : 'Start recording';

  const isBusy = state === 'transcribing' || state === 'thinking';
  const isRecording = state === 'recording';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isBusy}
      aria-label={label}
      className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-cosmic-primary-light/40 ${
        disabled || isBusy
          ? 'cursor-not-allowed opacity-60'
          : 'hover:scale-105 active:scale-95'
      }`}
    >
      {isRecording && (
        <>
          <span className="absolute inset-0 rounded-full bg-cosmic-primary/40 animate-ping" />
          <span className="absolute -inset-3 rounded-full bg-cosmic-accent/20 animate-pulse" />
        </>
      )}
      {isBusy && (
        <span className="absolute inset-0 rounded-full border-2 border-cosmic-primary-light/40 border-t-cosmic-primary-light animate-spin" />
      )}
      <span
        className={`relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl transition-colors ${
          isRecording
            ? 'bg-gradient-to-br from-rose-400 to-fuchsia-600'
            : 'bg-gradient-to-br from-cosmic-primary to-cosmic-accent'
        }`}
      >
        {isRecording ? <StopIcon /> : <MicIcon />}
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

function MicIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
