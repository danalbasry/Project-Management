'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { INTAKE_QUESTIONS } from '@/lib/intakePrompt';
import AudioVisualizer from './AudioVisualizer';
import MicrophoneButton from './MicrophoneButton';
import ProgressTrack from './ProgressTrack';
import ConversationLog, { ChatTurn } from './ConversationLog';
import SummaryView from './SummaryView';
import QuestionGoal from './QuestionGoal';

type Phase = 'interviewing' | 'awaiting_confirmation' | 'complete';

type AssistantState =
  | {
      phase: 'interviewing';
      questionNumber: number;
      questionTitle: string;
      isFollowUp: boolean;
      message: string;
    }
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

type HistoryTurn = { role: 'user' | 'assistant'; content: string };

type DraftSnapshot = {
  version: 1;
  turns: ChatTurn[];
  assistant: AssistantState | null;
  history: HistoryTurn[];
  followUpCounts: Record<number, number>;
  savedAt: string;
};

const DRAFT_KEY = 'gtm-intake-draft-v1';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadDraft(): DraftSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftSnapshot;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(snapshot: DraftSnapshot) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
  } catch {}
}

function clearDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.round(mins / 60);
  if (hrs === 1) return '1 hour ago';
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
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
  const [pendingDraft, setPendingDraft] = useState<DraftSnapshot | null>(null);

  const turnsRef = useRef<ChatTurn[]>([]);
  const assistantRef = useRef<AssistantState | null>(null);
  const historyRef = useRef<HistoryTurn[]>([]);
  const followUpCountsRef = useRef<Record<number, number>>({});
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    const existing = loadDraft();
    if (existing && existing.turns.length > 0) {
      setPendingDraft(existing);
    } else {
      setStarted(true);
    }
  }, []);

  const persist = useCallback(() => {
    if (turnsRef.current.length === 0 && !assistantRef.current) {
      clearDraft();
      return;
    }
    saveDraft({
      version: 1,
      turns: turnsRef.current,
      assistant: assistantRef.current,
      history: historyRef.current,
      followUpCounts: { ...followUpCountsRef.current },
      savedAt: new Date().toISOString(),
    });
  }, []);

  const applyTurns = useCallback((next: ChatTurn[]) => {
    turnsRef.current = next;
    setTurns(next);
  }, []);

  const applyAssistant = useCallback((next: AssistantState | null) => {
    assistantRef.current = next;
    setAssistant(next);
  }, []);

  const callInterview = useCallback(async () => {
    setThinking(true);
    setError(null);
    try {
      const lastAssistant = assistantRef.current;
      const lastAssistantQuestion =
        lastAssistant && lastAssistant.phase === 'interviewing'
          ? lastAssistant.questionNumber
          : undefined;
      const currentQuestionNumber =
        lastAssistantQuestion ??
        (historyRef.current.length === 0 ? 1 : undefined);
      const followUpCountForCurrent =
        currentQuestionNumber != null
          ? followUpCountsRef.current[currentQuestionNumber] ?? 0
          : 0;

      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyRef.current,
          currentQuestionNumber,
          followUpCountForCurrent,
        }),
      });
      const data: InterviewApiResponse = await res.json();
      if (!res.ok || 'error' in data) {
        setError(('error' in data && data.error) || 'Interview call failed.');
        return;
      }

      if (data.phase === 'interviewing') {
        if (data.is_follow_up) {
          followUpCountsRef.current[data.current_question_number] =
            (followUpCountsRef.current[data.current_question_number] ?? 0) + 1;
        } else {
          followUpCountsRef.current[data.current_question_number] =
            followUpCountsRef.current[data.current_question_number] ?? 0;
        }
        const meta = data.is_follow_up
          ? `Follow-up · Q${data.current_question_number} ${data.current_question_title}`
          : `Question ${data.current_question_number} · ${data.current_question_title}`;
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta,
        };
        applyTurns([...turnsRef.current, assistantTurn]);
        historyRef.current = [
          ...historyRef.current,
          { role: 'assistant', content: data.message },
        ];
        applyAssistant({
          phase: 'interviewing',
          questionNumber: data.current_question_number,
          questionTitle: data.current_question_title,
          isFollowUp: data.is_follow_up,
          message: data.message,
        });
      } else if (data.phase === 'awaiting_confirmation') {
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta: 'Review · Draft summary',
        };
        applyTurns([...turnsRef.current, assistantTurn]);
        historyRef.current = [
          ...historyRef.current,
          {
            role: 'assistant',
            content: `${data.message}\n\n${data.summary_markdown}`,
          },
        ];
        applyAssistant({
          phase: 'awaiting_confirmation',
          message: data.message,
          summary: data.summary_markdown,
        });
      } else if (data.phase === 'complete') {
        const assistantTurn: ChatTurn = {
          id: uid(),
          role: 'assistant',
          content: data.message,
          meta: 'Complete · Final summary',
        };
        applyTurns([...turnsRef.current, assistantTurn]);
        historyRef.current = [
          ...historyRef.current,
          {
            role: 'assistant',
            content: `${data.message}\n\n${data.summary_markdown}`,
          },
        ];
        applyAssistant({
          phase: 'complete',
          message: data.message,
          summary: data.summary_markdown,
        });
      }
      persist();
    } catch (e: any) {
      setError(e?.message || 'Failed to contact interview service.');
    } finally {
      setThinking(false);
    }
  }, [applyAssistant, applyTurns, persist]);

  useEffect(() => {
    if (!started || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    if (turnsRef.current.length === 0) {
      callInterview();
    }
  }, [started, callInterview]);

  const submitAnswer = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      const userTurn: ChatTurn = { id: uid(), role: 'user', content: clean };
      applyTurns([...turnsRef.current, userTurn]);
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: clean },
      ];
      setDraftText('');
      persist();
      await callInterview();
    },
    [applyTurns, callInterview, persist]
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

  const phase: Phase = assistant?.phase ?? 'interviewing';
  const currentQuestion =
    assistant && assistant.phase === 'interviewing'
      ? assistant.questionNumber
      : 1;
  const currentQuestionMeta = useMemo(
    () =>
      INTAKE_QUESTIONS.find((q) => q.number === currentQuestion) ??
      INTAKE_QUESTIONS[0],
    [currentQuestion]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!started) return;
      if (phase !== 'interviewing' && phase !== 'awaiting_confirmation') return;
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

  const activeSummary =
    assistant &&
    (assistant.phase === 'awaiting_confirmation' || assistant.phase === 'complete')
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

  const resetAll = useCallback(() => {
    historyRef.current = [];
    followUpCountsRef.current = {};
    bootstrappedRef.current = false;
    turnsRef.current = [];
    assistantRef.current = null;
    setTurns([]);
    setAssistant(null);
    setDraftText('');
    setError(null);
    setStarted(false);
    setPendingDraft(null);
    clearDraft();
  }, []);

  const resumeDraft = useCallback(() => {
    if (!pendingDraft) return;
    historyRef.current = [...pendingDraft.history];
    followUpCountsRef.current = { ...pendingDraft.followUpCounts };
    bootstrappedRef.current = true;
    turnsRef.current = [...pendingDraft.turns];
    assistantRef.current = pendingDraft.assistant;
    setTurns(pendingDraft.turns);
    setAssistant(pendingDraft.assistant);
    setPendingDraft(null);
    setStarted(true);
  }, [pendingDraft]);

  const discardDraft = useCallback(() => {
    setPendingDraft(null);
    clearDraft();
    setStarted(true);
  }, []);

  const heroMessage = useMemo(() => {
    if (phase === 'complete') {
      return 'Interview complete. Copy the summary below.';
    }
    if (phase === 'awaiting_confirmation') {
      return 'Review the draft summary. Say or type any corrections, or confirm to finalize.';
    }
    return currentPrompt ?? 'Listening…';
  }, [currentPrompt, phase]);

  const showQuestionMeta =
    started && phase === 'interviewing' && currentQuestionMeta;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {pendingDraft && !started && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-amber-100">
            <div className="font-semibold">Unfinished intake found</div>
            <div className="text-amber-200/80">
              Last activity {relativeTime(pendingDraft.savedAt)} ·{' '}
              {pendingDraft.turns.filter((t) => t.role === 'user').length}{' '}
              answer(s) so far
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resumeDraft}
              className="flex-1 rounded-lg bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-4 py-2 text-sm font-semibold text-white sm:flex-initial"
            >
              Resume
            </button>
            <button
              onClick={discardDraft}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 sm:flex-initial"
            >
              Start new
            </button>
          </div>
        </div>
      )}

      {started && <ProgressTrack currentQuestion={currentQuestion} phase={phase} />}

      {started && (
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-2xl backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-cosmic-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cosmic-accent/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-4 text-center sm:gap-6">
          {started && currentLabel && phase === 'interviewing' && (
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cosmic-primary-light">
              {currentLabel}
            </div>
          )}
          {showQuestionMeta && (
            <QuestionGoal
              goal={currentQuestionMeta.goal}
              depth={currentQuestionMeta.depth}
            />
          )}
          <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {heroMessage}
          </p>

          <AudioVisualizer
            levels={recorder.levels}
            active={recorder.status === 'recording'}
          />

          {phase === 'complete' ? (
            <button
              onClick={resetAll}
              className="rounded-full bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-primary/30 transition hover:scale-[1.02]"
            >
              Start a new intake
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <MicrophoneButton
                state={micState}
                onClick={handleMicClick}
                disabled={false}
              />
              <div className="text-xs text-cosmic-text-muted">
                {recorder.status === 'recording'
                  ? 'Tap to stop · or press Space'
                  : transcribing
                  ? 'Transcribing…'
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
      )}

      {started && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="order-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur sm:p-6 lg:order-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-cosmic-primary-light">
                Conversation
              </h2>
              <span className="text-xs text-cosmic-text-muted">
                {turns.length} turn{turns.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="max-h-[460px] overflow-y-auto pr-1 sm:max-h-[520px] sm:pr-2">
              <ConversationLog turns={turns} />
            </div>
          </div>

          <div className="order-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur sm:p-6 lg:order-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-cosmic-primary-light">
                Your answer
              </h2>
              <span className="text-[11px] text-cosmic-text-muted">
                Editable · Whisper transcript appears here
              </span>
            </div>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={
                phase === 'awaiting_confirmation'
                  ? 'Confirm, or describe what to change…'
                  : 'Speak or type your answer. Edit before sending if Whisper mis-hears something.'
              }
              rows={6}
              disabled={thinking || transcribing}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-cosmic-primary-light focus:outline-none focus:ring-2 focus:ring-cosmic-primary-light/40 sm:p-4"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setDraftText('')}
                disabled={!draftText}
                className="text-xs text-cosmic-text-muted transition hover:text-white disabled:opacity-40"
              >
                Clear
              </button>
              <div className="flex flex-1 flex-wrap justify-end gap-2 sm:flex-initial">
                {phase === 'interviewing' && (
                  <button
                    onClick={() => submitAnswer('Skip — not applicable')}
                    disabled={thinking || transcribing}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-40"
                    title="Mark this question as not applicable and move on"
                  >
                    Skip
                  </button>
                )}
                {phase === 'awaiting_confirmation' && (
                  <button
                    onClick={() => submitAnswer('Looks good, finalize it.')}
                    disabled={thinking || transcribing}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-40 sm:px-4"
                  >
                    Confirm &amp; finalize
                  </button>
                )}
                <button
                  onClick={() => submitAnswer(draftText)}
                  disabled={!canSubmit}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cosmic-primary to-cosmic-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cosmic-primary/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-initial"
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
