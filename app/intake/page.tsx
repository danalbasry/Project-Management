import Link from 'next/link';
import VoiceIntakeForm from '@/components/intake/VoiceIntakeForm';

export const metadata = {
  title: 'GTM Ops Project Intake · InfoTech Research Group',
  description:
    'Voice-first intake form for InfoTech GTM operations project requests. Powered by Whisper and Claude.',
};

export default function IntakePage() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-cosmic-primary-light sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cosmic-primary-light" />
              InfoTech Research Group · GTM Ops Intake
            </div>
            <h1 className="bg-gradient-to-r from-white via-cosmic-primary-light to-cosmic-accent bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl md:text-5xl">
              Request GTM Ops work. By voice.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-cosmic-text-muted sm:text-base">
              Speak your answers. Whisper transcribes them. Claude asks
              follow-ups when something's vague, then produces a PM-ready
              summary you can send straight to the team.
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

        <footer className="mt-10 text-center text-[11px] leading-relaxed text-cosmic-text-muted sm:mt-12 sm:text-xs">
          Audio is sent to OpenAI Whisper for transcription · Conversation is
          sent to Anthropic Claude for the interview logic · Data is not stored
          on InfoTech servers by this form.
        </footer>
      </div>
    </main>
  );
}
