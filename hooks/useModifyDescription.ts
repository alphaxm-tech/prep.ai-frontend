import { useState } from "react";

// hooks/useModifyDescription.ts
export function useModifyDescription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modifyDescription = async (
    description: string,
    keywords: string[],
    tone: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const model = "openai/gpt-4o-mini";

      const prompt = `Rewrite this: ${description}
Include: ${keywords.join(", ")}
Tone: ${tone}`;

      const resp = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: "You are a helpful copywriter." },
              { role: "user", content: prompt },
            ],
            max_tokens: 256,
            temperature: 0.7,
          }),
        }
      );

      const data = await resp.json();
      const output = data?.choices?.[0]?.message?.content ?? null;
      return output;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { modifyDescription, loading, error };
}
