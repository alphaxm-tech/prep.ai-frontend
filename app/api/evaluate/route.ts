// app/api/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "node";

type QIn = {
  questionId: number;
  questionText: string;
  transcript: string;
  durationSec?: number;
  suggestedTimeSec?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, title, questions } = body as {
      company?: string;
      title?: string;
      questions: QIn[];
    };

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions provided" },
        { status: 400 }
      );
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json(
        { error: "Server missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // system prompt: strict JSON-only response
    const systemPrompt = `
You are an objective technical interviewer and grader. For each answered question, give a numeric score from 0 to 10 (integer or one decimal) using this rubric:
- Content correctness/relevance (0-4)
- Structure & clarity (0-2)
- Depth / examples & tradeoffs (0-2)
- Time management & conciseness (0-1)
- Communication confidence & language (0-1)

Return ONLY a JSON object and NOTHING ELSE with this exact schema:
{
  "perQuestion": [
    {
      "questionId": number,
      "score": number,
      "strengths": [string],
      "improvements": [string]
    }
  ],
  "overallScore": number,
  "overallFeedback": string
}

If a transcript is empty or too short to evaluate, give a low score and a short improvement indicating missing content. Be concise and use neutral, actionable language.
`.trim();

    // build user content including question transcripts
    const userContent = `
Company: ${company ?? "N/A"}
Title: ${title ?? "N/A"}

Evaluate these answered questions. Provide the per-question score, 1-3 strengths, and 1-3 improvements per question.

Questions:
${questions
  .map(
    (q, i) =>
      `\n[${i + 1}] questionId: ${q.questionId}
questionText: ${q.questionText}
transcript: ${q.transcript ?? ""}
durationSec: ${q.durationSec ?? "N/A"}
suggestedTimeSec: ${q.suggestedTimeSec ?? "N/A"}`
  )
  .join("\n\n")}
`.trim();

    // call OpenAI Chat Completions
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // change to whichever model you prefer/allowed
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.0,
          max_tokens: 1000,
        }),
      }
    );

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("OpenAI evaluate error", openaiRes.status, txt);
      return NextResponse.json(
        { error: "Evaluation request failed", detail: txt },
        { status: 502 }
      );
    }

    const resJson = await openaiRes.json();
    const text = resJson?.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "Empty evaluation response" },
        { status: 502 }
      );
    }

    // Try to parse JSON directly, or extract trailing JSON block as fallback
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      const match = text.match(/\{[\s\S]*\}$/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e) {
          console.error(
            "Failed parsing JSON from model response:",
            e,
            "raw:",
            text
          );
          return NextResponse.json(
            { error: "Failed parsing evaluation JSON", raw: text },
            { status: 502 }
          );
        }
      } else {
        console.error("Model returned non-JSON:", text);
        return NextResponse.json(
          { error: "Model returned non-JSON", raw: text },
          { status: 502 }
        );
      }
    }

    // Basic validation
    if (!parsed || !Array.isArray(parsed.perQuestion)) {
      return NextResponse.json(
        { error: "Unexpected evaluation format", parsed },
        { status: 502 }
      );
    }

    // safe normalization: ensure overallScore is average of per-question scores
    try {
      const scores = parsed.perQuestion.map((p: any) => Number(p.score) || 0);
      const avg =
        scores.reduce((a: number, b: number) => a + b, 0) /
        Math.max(1, scores.length);
      parsed.overallScore = Math.round(avg * 10) / 10; // 1 decimal
    } catch {}

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("evaluate route error", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
