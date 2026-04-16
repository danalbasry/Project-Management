'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'stopping';

export interface UseVoiceRecorderResult {
  status: RecorderStatus;
  error: string | null;
  levels: number[];
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  cancel: () => void;
}

const LEVEL_BARS = 32;

export function useVoiceRecorder(): UseVoiceRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() =>
    new Array(LEVEL_BARS).fill(0)
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setLevels(new Array(LEVEL_BARS).fill(0));
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const tickLevels = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const step = Math.floor(data.length / LEVEL_BARS);
    const next = new Array<number>(LEVEL_BARS);
    for (let i = 0; i < LEVEL_BARS; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0;
      const avg = sum / Math.max(1, step);
      next[i] = Math.min(1, avg / 180);
    }
    setLevels(next);
    rafRef.current = requestAnimationFrame(tickLevels);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setError('Microphone access is not supported in this browser.');
      return;
    }
    try {
      setStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mime = pickMime();
      const recorder = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined
      );
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mime || 'audio/webm',
        });
        const resolver = stopResolverRef.current;
        stopResolverRef.current = null;
        cleanup();
        setStatus('idle');
        resolver?.(blob);
      };
      recorder.onerror = (e: any) => {
        setError(e?.error?.message || 'Recorder error.');
        const resolver = stopResolverRef.current;
        stopResolverRef.current = null;
        cleanup();
        setStatus('idle');
        resolver?.(null);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setStatus('recording');
      rafRef.current = requestAnimationFrame(tickLevels);
    } catch (e: any) {
      const message =
        e?.name === 'NotAllowedError'
          ? 'Microphone permission denied. Allow mic access and try again.'
          : e?.message || 'Failed to start recording.';
      setError(message);
      cleanup();
      setStatus('idle');
    }
  }, [cleanup, tickLevels]);

  const stop = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      cleanup();
      setStatus('idle');
      return null;
    }
    setStatus('stopping');
    return new Promise<Blob | null>((resolve) => {
      stopResolverRef.current = resolve;
      try {
        recorder.stop();
      } catch {
        resolve(null);
      }
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const resolver = stopResolverRef.current;
    stopResolverRef.current = null;
    cleanup();
    setStatus('idle');
    resolver?.(null);
  }, [cleanup]);

  return { status, error, levels, start, stop, cancel };
}

function pickMime(): string | null {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return null;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return null;
}
