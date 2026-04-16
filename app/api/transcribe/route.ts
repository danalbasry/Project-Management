import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const HALLUCINATION_PATTERNS: RegExp[] = [
  /\b(hey|hi|hello)[,!.\s]*\s*(please\s+)?(make sure to|don['’]t forget to|be sure to)\s+(like(,|\s)?\s*)?(comment(,|\s)?\s*and\s*)?subscribe[^.!?\n]*[.!?]?/gi,
  /\b(please\s+)?(like(,|\s)?\s*)?(comment(,|\s)?\s*)?(and\s+)?subscribe( to (my|the|our) channel)?[^.!?\n]*[.!?]?/gi,
  /\bit['’]s a big help[^.!?\n]*[.!?]?/gi,
  /\bthanks? (for|so much for) watching[^.!?\n]*[.!?]?/gi,
  /\b(don['’]t forget to\s+)?(hit|tap|smash) the (like|bell|subscribe) (button|icon)[^.!?\n]*[.!?]?/gi,
  /\bsee you (in the next (video|one)|next time)[^.!?\n]*[.!?]?/gi,
  /\b(bye|goodbye)[,!.\s]*$/gi,
];

function sanitize(raw: string): string {
  let text = raw;
  for (const re of HALLUCINATION_PATTERNS) {
    text = text.replace(re, '');
  }
  return text.replace(/\s+/g, ' ').trim();
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be multipart/form-data.' },
      { status: 400 }
    );
  }

  const audio = formData.get('audio');
  if (!(audio instanceof File)) {
    return NextResponse.json(
      { error: 'Missing "audio" file field.' },
      { status: 400 }
    );
  }

  if (audio.size < 2000) {
    return NextResponse.json({ text: '' });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const result = await client.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
      temperature: 0,
      prompt:
        'Business project intake interview. The speaker is answering questions about a work project: outcomes, data, ownership, deadlines, and success criteria.',
    });

    const cleaned = sanitize(result.text ?? '');
    return NextResponse.json({ text: cleaned });
  } catch (err: any) {
    const message =
      err?.error?.message || err?.message || 'Transcription failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
