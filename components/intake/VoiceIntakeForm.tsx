'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import AudioVisualizer from './AudioVisualizer';
import MicrophoneButton from './MicrophoneButton';
import ProgressTrack from './ProgressTrack';
import ConversationLog, { ChatTurn } from './ConversationLog';
import SummaryView from './SummaryView';

type Phase = 'interviewing' | 'awaiting_confirmation' | 'complete';

type AssistantState =
  | { phase: 'interviewing'; questionNumber: number; questionTitle: string; isFollowUp: boolean; message: string }
  | { phase: 'awaiting_confirmation'; message: string; summary: string }
  | { phase: 'complete'; message: string; summary: string };

type InterviewApiResponse =
  | {
      phase: 'interviewing';
      current_question_number: number;
      current_question_title: string;
      is_follow_up: boolean;
      message: string;
    }
  | { phase: 'awaiting_confirmation'; message: string; summary_markdown: string }
  | { phase: 'complete'; message: string; summary_markdown: string }
  | { error: string; raw?: string };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function VoiceIntakeForm() {
  const recorder = useVoiceRecorder();

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [assistant, setAssistant] = useState<AssistantState | null>(null);
  const [draftText, setDraftText] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const bootstrappedRef = useRef(false);

  const phase: Phase = assistant?.phase ?? 'interviewing';
  const currentQuestion =
    assistant && assistant.phase === 'interviewing'
      ? assistant.questionNumber
      : 1;

  const pushTurn = useCallback((turn: ChatTurn) => {
    setTurns((prev) => [...prev, turn]);
  }, []);

  const callInterview = useCallback(async () => {
    setThinking(true);
    setError(null);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyRef.current }),
      });
      const data: InterviewApiResponse = await res.json();
      if (!res.ok || 'error' in data) {
        setError(('error' in data && data.error) || 'Interview call failed.');
        return;
      }

      if (data.phase === 'interviewing') {
        setAssistant({
          phase: 'interviewing',
          questionNumber: data.current_question_number,
          questionTitle: data.current_question_title,
          isFollowUp: data.is_follow_up,
          message: data.message,
        });
        const meta = data.is_follow_up
          ? `Follow-up · Q${data.current_question_number} ${data.current_question_title}`
          : `Question ${data.current_question_number} · ${data.current_question_title}`;
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta,
        };
        pushTurn(assistantTurn);
        historyRef.current.push({ role: 'assistant', content: data.message });
      } else if (data.phase === 'awaiting_confirmation') {
        setAssistant({
          phase: 'awaiting_confirmation',
          message: data.message,
          summary: data.summary_markdown,
        });
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta: 'Review · Draft summary',
        };
        pushTurn(assistantTurn);
        historyRef.current.push({
          role: 'assistant',
          content: `${data.message}\n\n${data.summary_markdown}`,
        });
      } else if (data.phase === 'complete') {
        setAssistant({
          phase: 'complete',
          message: data.message,
          summary: data.summary_markdown,
        });
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta: 'Complete · Final summary',
        };
        pushTurn(assistantTurn);
        historyRef.current.push({
          role: 'assistant',
          content: `${data.message}\n\n${data.summary_markdown}`,
        });
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to contact interview service.');
    } finally {
      setThinking(false);
    }
  }, [pushTurn]);

  useEffect(() => {
    if (!started || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    callInterview();
  }, [started, callInterview]);

  const submitAnswer = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      const userTurn: ChatTurn = { id: uid(), role: 'user', content: clean };
      pushTurn(userTurn);
      historyRef.current.push({ role: 'user', content: clean });
      setDraftText('');
      await callInterview();
    },
    [callInterview, pushTurn]
  );

  const handleMicClick = useCallback(async () => {
    setError(null);
    if (recorder.status === 'recording') {
      const blob = await recorder.stop();
      if (!blob || blob.size === 0) return;
      setTranscribing(true);
      try {
        const ext = blob.type.includes('mp4')
          ? 'm4a'
          : blob.type.includes('ogg')
          ? 'ogg'
          : 'webm';
        const file = new File([blob], `answer.${ext}`, { type: blob.type });
        const form = new FormData();
        form.append('audio', file);
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Transcription failed.');
          return;
        }
        const text = (data.text || '').trim();
        if (!text) {
          setError("Didn't catch that — try recording again.");
          return;
        }
        setDraftText((prev) => (prev ? `${prev} ${text}` : text));
      } catch (e: any) {
        setError(e?.message || 'Transcription failed.');
      } finally {
        setTranscribing(false);
      }
    } else {
      await recorder.start();
    }
  }, [recorder]);

  const micState: 'idle' | 'recording' | 'transcribing' | 'thinking' | 'disabled' =
    thinking
      ? 'thinking'
      : transcribing
      ? 'transcribing'
      : recorder.status === 'recording'
      ? 'recording'
      : 'idle';

  const canSubmit = draftText.trim().length > 0 && !thinking && !transcribing;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!started) return;
      if (phase !== 'interviewing') return;
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleMicClick();
      }
    },
    [handleMicClick, phase, started]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const micDisabled = phase !== 'interviewing';

  const activeSummary =
    assistant && (assistant.phase === 'awaiting_confirmation' || assistant.phase === 'complete')
      ? assistant.summary
      : null;

  const currentPrompt =
    assistant && assistant.phase === 'interviewing' ? assistant.message : null;

  const currentLabel =
    assistant && assistant.phase === 'interviewing'
      ? assistant.isFollowUp
        ? `Follow-up on Question ${assistant.questionNumber}`
        : `Question ${assistant.questionNumber} · ${assistant.questionTitle}`
      : '';

  const recorderError = recorder.error;

  const displayError = error || recorderError;

  const canRestart = phase === 'complete';

  const restart = useCallback(() => {
    historyRef.current = [];
    bootstrappedRef.current = false;
    setTurns([]);
    setAssistant(null);
    setDraftText('');
    setError(null);
    setStarted(false);
  }, []);

  const beginInterview = useCallback(() => {
    setStarted(true);
  }, []);

  const heroMessage = useMemo(() => {
    if (!started) {
      return 'Ready to scope a GTM ops project? Click the mic and talk — an AI interviewer will walk you through 8 questions, ask follow-ups when your answer is vague, and hand back a clean summary you can paste into Teams.';
    }
    if (phase === 'complete') {
      return 'Interview complete. Copy the summary below and send it to whoever requested the intake.';
    }
    if (phase === 'awaiting_confirmation') {
      return 'Review the draft summary. Say or type any changes, or confirm to finalize.';
    }
    return currentPrompt ?? 'Listening…';
  }, [currentPrompt, phase, started]);

  return (
    <div className="flex flex-col gap-8">
      <ProgressTrack currentQuestion={currentQuestion} phase={phase} />

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 shadow-2xl backdrop-blur">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-cosmic-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cosmic-accent/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          {started && currentLabel && phase === 'interviewing' && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cosmic-primary-light">
              {currentLabel}
            </div>
          )}
          <p className="max-w-2xl text-lg leading-relaxed text-white/90">
            {heroMessage}
          </p>

          <AudioVisualizer
            levels={recorder.levels}
            active={recorder.status === 'recording'}
          />

          {!started ? (
            <button
              onClick={beginInterview}
              className="rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-8 py-3 text-base font-semibold text-white shadow-lg shadow-cosmic-primary/30 transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cosmic-primary-light/40"
            >
              Start the interview
            </button>
          ) : canRestart ? (
            <button
              onClick={restart}
              className="rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-primary/30 transition hover:scale-[1.02]"
            >
              Start a new intake
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <MicrophoneButton
                state={micState}
                onClick={handleMicClick}
                disabled={micDisabled && phase !== 'awaiting_confirmation'}
              />
              <div className="text-xs text-cosmic-text-muted">
                {recorder.status === 'recording'
                  ? 'Tap to stop · or press Space'
                  : transcribing
                  ? 'Transcribing with Whisper…'
                  : thinking
                  ? 'Claude is thinking…'
                  : 'Tap the mic to speak · or press Space · or type below'}
              </div>
            </div>
          )}

          {displayError && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
              {displayError}
            </div>
          )}
        </div>
      </section>

      {started && (
        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-cosmic-primary-light">
                Conversation
              </h2>
              <span className="text-xs text-cosmic-text-muted">
                {turns.length} turn{turns.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="max-h-[520px] overflow-y-auto pr-2">
              <ConversationLog turns={turns} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-cosmic-primary-light">
              Your answer
            </h2>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={
                phase === 'awaiting_confirmation'
                  ? 'Confirm, or describe what to change…'
                  : 'Transcribed text appears here. Edit before sending if you need to.'
              }
              rows={8}
              disabled={thinking || transcribing}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-cosmic-primary-light focus:outline-none focus:ring-2 focus:ring-cosmic-primary-light/40"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setDraftText('')}
                disabled={!draftText}
                className="text-xs text-cosmic-text-muted transition hover:text-white disabled:opacity-40"
              >
                Clear
              </button>
              <div className="flex gap-2">
                {phase === 'awaiting_confirmation' && (
                  <button
                    onClick={() => submitAnswer('Looks good, finalize it.')}
                    disabled={thinking || transcribing}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40"
                  >
                    Confirm &amp; finalize
                  </button>
                )}
                <button
                  onClick={() => submitAnswer(draftText)}
                  disabled={!canSubmit}
                  className="rounded-lg bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cosmic-primary/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSummary && (
        <SummaryView markdown={activeSummary} readOnly={phase === 'complete'} />
      )}
    </div>
  );
}
