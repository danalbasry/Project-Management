import Link from 'next/link';
import VoiceIntakeForm from '@/components/intake/VoiceIntakeForm';

export const metadata = {
  title: 'Voice Intake · GTM Ops',
  description:
    'A voice-first intake form for GTM operations project requests. Powered by Whisper and Claude.',
};

export default function IntakePage() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cosmic-primary-light">
              <span className="h-1.5 w-1.5 rounded-full bg-cosmic-primary-light" />
              GTM Ops · Voice Intake
            </div>
            <h1 className="bg-gradient-to-r from-white via-cosmic-primary-light to-cosmic-accent bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Describe your project. Out loud.
            </h1>
            <p className="mt-3 max-w-2xl text-cosmic-text-muted">
              Whisper transcribes your voice. Claude asks smart follow-ups. You
              walk away with a PM-ready summary — no typing marathon required.
            </p>
          </div>
          <Link
            href="/"
            className="hidden rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 md:inline-block"
          >
            ← Back to board
          </Link>
        </header>

        <VoiceIntakeForm />

        <footer className="mt-12 text-center text-xs text-cosmic-text-muted">
          Speech is transcribed via OpenAI Whisper · Interview logic powered by
          Claude · Your answers are sent only to these two APIs.
        </footer>
      </div>
    </main>
  );
}
