import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { INTAKE_SYSTEM_PROMPT } from '@/lib/intakePrompt';

export const runtime = 'nodejs';
export const maxDuration = 60;

type Turn = { role: 'user' | 'assistant'; content: string };

type InterviewRequestBody = {
  history?: Turn[];
  currentQuestionNumber?: number;
  followUpCountForCurrent?: number;
};

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

function buildSystemPrompt(
  currentQuestionNumber: number | undefined,
  followUpCountForCurrent: number | undefined
) {
  if (
    typeof currentQuestionNumber !== 'number' ||
    typeof followUpCountForCurrent !== 'number'
  ) {
    return INTAKE_SYSTEM_PROMPT;
  }
  const atLimit = followUpCountForCurrent >= 2;
  const state = `\n\nCURRENT STATE (enforce this strictly):
- Current question number: ${currentQuestionNumber}
- Follow-ups already asked on this question: ${followUpCountForCurrent}
- ${
    atLimit
      ? 'FOLLOW-UP LIMIT REACHED. Do NOT ask another follow-up on this question. Accept the user\'s latest answer and either advance to the next question (set is_follow_up: false, current_question_number to the next one) or, if question 8 is already answered, move to the awaiting_confirmation phase.'
      : `You may ask up to ${2 - followUpCountForCurrent} more follow-up(s) on this question if the answer is vague or incomplete.`
  }`;
  return INTAKE_SYSTEM_PROMPT + state;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  let body: InterviewRequestBody;
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

  const system = buildSystemPrompt(
    body.currentQuestionNumber,
    body.followUpCountForCurrent
  );

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system,
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
