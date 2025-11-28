// utils/services/resume.service.ts
export type ResumeFormat = {
  format_id: string;
  format_key: string;
  title: string;
};

export type ResumePayload = {
  format: string;
  payload: any; // tighten this type if you have a schema
};

const API_BASE = "/api"; // change to your real base URL if needed

async function getResumeFormats(): Promise<{ resumeFormats: ResumeFormat[] }> {
  // Example: fetch formats from your backend. If you don't have an endpoint,
  // return a fallback list so the UI still works.
  try {
    const res = await fetch(`${API_BASE}/resume-formats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // fallback if server returns error
      return {
        resumeFormats: [
          { format_id: "modern", format_key: "modern", title: "Modern" },
          { format_id: "classic", format_key: "classic", title: "Classic" },
          { format_id: "creative", format_key: "creative", title: "Creative" },
          { format_id: "minimal", format_key: "minimal", title: "Minimal" },
          { format_id: "standard", format_key: "standard", title: "Standard" },
        ],
      };
    }
    return (await res.json()) as { resumeFormats: ResumeFormat[] };
  } catch (err) {
    // network error -> return fallback
    return {
      resumeFormats: [
        { format_id: "modern", format_key: "modern", title: "Modern" },
        { format_id: "classic", format_key: "classic", title: "Classic" },
        { format_id: "creative", format_key: "creative", title: "Creative" },
        { format_id: "minimal", format_key: "minimal", title: "Minimal" },
        { format_id: "standard", format_key: "standard", title: "Standard" },
      ],
    };
  }
}

async function saveResume(body: ResumePayload): Promise<{ id: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/resumes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to save resume: ${res.status} ${text}`);
    }
    return (await res.json()) as { id: string };
  } catch (err) {
    console.error("resume.service.saveResume error:", err);
    // bubble up or return null to indicate failure
    throw err;
  }
}

export const resumeService = {
  getResumeFormats,
  saveResume,
};

export default resumeService;
