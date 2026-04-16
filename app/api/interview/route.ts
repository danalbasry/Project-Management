import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { INTAKE_SYSTEM_PROMPT } from '@/lib/intakePrompt';

export const runtime = 'nodejs';
export const maxDuration = 60;

type Turn = { role: 'user' | 'assistant'; content: string };

type InterviewResponse =
  | {
      phase: 'interviewing';
      current_question_number: number;
      current_question_title: string;
      is_follow_up: boolean;
      message: string;
    }
  | {
      phase: 'awaiting_confirmation';
      message: string;
      summary_markdown: string;
    }
  | {
      phase: 'complete';
      message: string;
      summary_markdown: string;
    };

function extractJson(text: string): InterviewResponse | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {}
  }

  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1));
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  let body: { history?: Turn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  const messages: { role: 'user' | 'assistant'; content: string }[] =
    history.length === 0
      ? [{ role: 'user', content: 'Begin the interview.' }]
      : history.map((t) => ({ role: t.role, content: t.content }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: INTAKE_SYSTEM_PROMPT,
      messages,
    });

    const textBlock = result.content.find((b) => b.type === 'text');
    const raw = textBlock && 'text' in textBlock ? textBlock.text : '';
    const parsed = extractJson(raw);

    if (!parsed) {
      return NextResponse.json(
        {
          error: 'Model returned an unparseable response.',
          raw,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    const message =
      err?.error?.message || err?.message || 'Interview call failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
