"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AI_INTERVIEW_ROUTE } from "@/constants/ui-routes";

export default function AIInterviewTerminatedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const scoreParam = searchParams.get("score");
  const maxScoreParam = searchParams.get("maxScore");
  const hasScore = scoreParam !== null && maxScoreParam !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl border border-red-200 shadow-2xl rounded-3xl p-8 text-center space-y-4">
        <div className="text-5xl">🚫</div>

        <h1 className="text-2xl font-bold text-red-700">
          Your Interview Was Closed
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed">
          {title ? (
            <>
              Your attempt on <span className="font-semibold">{title}</span>{" "}
              was closed automatically because you switched tabs or left the
              interview window while it was in progress.
            </>
          ) : (
            <>
              Your interview was closed automatically because you switched
              tabs or left the interview window while it was in progress.
            </>
          )}
        </p>

        {hasScore ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Your Score So Far
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {scoreParam} / {maxScoreParam}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Based on whatever questions you had answered before the
              interview was closed.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 leading-relaxed">
            Any answers you had submitted before that point were saved and
            scored — check the Attempted Interviews list for the details.
          </p>
        )}

        <p className="text-sm text-gray-500 leading-relaxed">
          Leaving the interview window during an active attempt is treated as
          a violation of the interview rules.
        </p>

        <button
          onClick={() => router.push(AI_INTERVIEW_ROUTE)}
          className="mt-2 px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold shadow-lg"
        >
          Back to Interviews
        </button>
      </div>
    </div>
  );
}
