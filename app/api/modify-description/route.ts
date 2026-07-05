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
      section = "objective", // "objective" | "project" | "experience"
      context = {},
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

    // What section this text belongs to changes both the framing given to
    // the model and what supporting context (project title, role/company/
    // dates, etc.) is worth mentioning alongside the text being rewritten.
    const sectionInstructions: Record<string, string> = {
      objective:
        "You are rewriting the professional objective / summary section of a resume.",
      project:
        "You are rewriting a project description for a resume's projects section.",
      experience:
        "You are rewriting a work experience description/bullet points for a resume's work experience section.",
    };
    const sectionInstruction =
      sectionInstructions[section] ?? sectionInstructions.objective;

    let contextStr = "";
    if (section === "project" && context?.title) {
      contextStr = `Project title: ${context.title}.`;
    } else if (section === "experience") {
      const parts: string[] = [];
      if (context?.role) parts.push(`Role: ${context.role}`);
      if (context?.company) parts.push(`Company: ${context.company}`);
      if (context?.start_year || context?.end_year) {
        parts.push(
          `Duration: ${context.start_year || "?"} - ${context.end_year || "?"}`
        );
      }
      contextStr = parts.join(". ");
    }

    // Build a clean message set for chat completion.
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful professional resume copywriter. Keep answers succinct and suitable for the specified resume section.",
      },
      {
        role: "user",
        content: `${sectionInstruction} ${extraInstruction} ${kwStr} ${contextStr}\n\nOriginal:\n${description}`,
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
