import Image from 'next/image';
import VoiceIntakeForm from '@/components/intake/VoiceIntakeForm';

export const metadata = {
  title: 'Project Intake · Info-Tech Research Group',
  description:
    'Info-Tech Research Group · GTM Ops project intake form. Speak your answers; Claude drafts the brief.',
};

export default function IntakePage() {
  return (
    <main className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 flex items-center gap-4 sm:mb-10">
          <div className="relative h-10 w-36 sm:h-12 sm:w-44">
            <Image
              src="/infotech-logo.svg"
              alt="Info-Tech Research Group"
              fill
              priority
              sizes="(max-width: 640px) 144px, 176px"
              className="object-contain object-left"
            />
          </div>
          <div className="ml-auto text-right sm:text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cosmic-primary-light sm:text-[11px]">
              GTM Ops · Project Intake
            </div>
          </div>
        </header>

        <VoiceIntakeForm />
      </div>
    </main>
  );
}
