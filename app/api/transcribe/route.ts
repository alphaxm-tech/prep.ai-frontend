// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";

export const runtime = "nodejs"; // FIXED ✔ use nodejs

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing file in request (field 'file')" },
        { status: 400 }
      );
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fd = new FormData();
    fd.append("file", buffer, {
      filename: "recording.webm",
      contentType: file.type || "audio/webm",
    });

    fd.append("model", "whisper-1");

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json(
        { error: "Server missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: fd as any,
      }
    );

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("OpenAI transcript error", openaiRes.status, txt);
      return NextResponse.json(
        { error: "Transcription failed", detail: txt },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    return NextResponse.json({ text: data.text ?? "" });
  } catch (err: any) {
    console.error("transcribe route error", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
