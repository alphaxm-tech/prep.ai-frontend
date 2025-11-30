// app/api/modify-description/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      description = "",
      keywords = [],
      tone = "neutral",
      type = "polish",
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Map the 'type' to a short instruction to control the output style.
    const typeInstructions: Record<string, string> = {
      polish:
        "Polish the text: improve clarity, grammar, flow, and professionalism.",
      concise:
        "Make the text concise and punchy while retaining meaning and impact.",
      technical:
        "Make the text more technical: include relevant jargon, highlight technical skills and measurable outcomes.",
      recruiter:
        "Make it recruiter-friendly: emphasize results, role, technologies, keywords, and measurable impact in short sentences.",
    };

    const extraInstruction = typeInstructions[type] ?? typeInstructions.polish;

    const kwStr =
      Array.isArray(keywords) && keywords.length
        ? `Include/mention these keywords where relevant: ${keywords.join(
            ", "
          )}.`
        : "";

    // Build a clean message set for chat completion.
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful professional resume copywriter. Keep answers succinct and suitable for a resume/objective.",
      },
      {
        role: "user",
        content: `Rewrite the following objective / summary. ${extraInstruction} ${kwStr}\n\nOriginal:\n${description}`,
      },
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 300,
        temperature: 0.6,
        n: 1,
      }),
    });

    const data = await resp.json();

    // Handle OpenAI errors gracefully
    if (!resp.ok) {
      const message = data?.error?.message ?? "OpenAI error";
      return NextResponse.json({ error: message }, { status: resp.status });
    }

    // Extract the assistant text
    const modified =
      data?.choices && data.choices[0] && data.choices[0].message
        ? (data.choices[0].message.content as string)
        : "";

    return NextResponse.json({ modified }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
