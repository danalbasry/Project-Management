import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

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

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const result = await client.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    return NextResponse.json({ text: result.text ?? '' });
  } catch (err: any) {
    const message =
      err?.error?.message || err?.message || 'Transcription failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
