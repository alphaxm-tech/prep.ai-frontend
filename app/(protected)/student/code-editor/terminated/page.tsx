"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CODE_EDITOR_ROUTE } from "@/constants/ui-routes";

// Modeled on the Quiz module's terminated page
// (app/(protected)/student/quiz/terminated/page.tsx) as a UI/UX pattern
// reference — copy says "test", never "quiz".
export default function CodeTestTerminatedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl border border-red-200 shadow-2xl rounded-3xl p-8 text-center space-y-4">
        <div className="text-5xl">🚫</div>

        <h1 className="text-2xl font-bold text-red-700">
          Your Test Was Stopped
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed">
          {title ? (
            <>
              Your attempt on <span className="font-semibold">{title}</span>{" "}
              was closed automatically because you switched tabs or left the
              test window while it was in progress.
            </>
          ) : (
            <>
              Your code test was closed automatically because you switched
              tabs or left the test window while it was in progress.
            </>
          )}
        </p>

        <p className="text-sm text-gray-500 leading-relaxed">
          Any questions you had already submitted before that point were
          saved and scored. Leaving the test window during an active attempt
          is treated as a violation of the test rules.
        </p>

        <button
          onClick={() => router.push(CODE_EDITOR_ROUTE)}
          className="mt-2 px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
