import VoiceIntakeForm from '@/components/intake/VoiceIntakeForm';

export const metadata = {
  title: 'Project Intake',
  description: 'Voice-first project intake form.',
};

export default function IntakePage() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <VoiceIntakeForm />
      </div>
    </main>
  );
}
