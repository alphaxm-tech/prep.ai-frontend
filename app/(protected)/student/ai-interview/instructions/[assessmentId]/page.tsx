"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStartInterview } from "@/server-api/mutations/ai-interview.mutation";
import Loader from "@/components/Loader";
import {
  AI_INTERVIEW_ROUTE,
  AI_INTERVIEW_SESSION,
} from "@/constants/ui-routes";

export default function AIInterviewInstructionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const assessmentId = Number(params.assessmentId as string);
  const title = searchParams.get("title") || "This AI Interview";
  const totalQuestions = searchParams.get("total_questions");
  const durationSec = searchParams.get("duration_sec");
  const minutes = durationSec
    ? Math.max(1, Math.ceil(Number(durationSec) / 60))
    : null;

  const [starting, setStarting] = useState(false);
  const startInterviewMutation = useStartInterview();

  const handleStart = () => {
    setStarting(true);
    startInterviewMutation.mutate(assessmentId, {
      onSuccess: (data) => {
        const attemptId = data.attempt.AttemptID;
        router.push(
          `${AI_INTERVIEW_ROUTE}${AI_INTERVIEW_SESSION}?attemptId=${attemptId}`,
        );
      },
      onError: () => {
        setStarting(false);
      },
    });
  };

  return (
    <>
      <Loader show={starting} message="Starting your interview..." />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Please read the instructions below carefully before you begin.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {totalQuestions && (
              <div className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
                <span className="font-semibold">{totalQuestions}</span>{" "}
                questions
              </div>
            )}
            {minutes && (
              <div className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
                Time limit: <span className="font-semibold">{minutes}</span>{" "}
                minutes
              </div>
            )}
          </div>

          <ul className="mt-6 space-y-3 text-sm text-gray-700 list-disc list-inside">
            <li>
              Camera and microphone access are mandatory for this interview
              and cannot be skipped.
            </li>
            <li>
              Questions are shown and read aloud one at a time by the AI —
              please wait until it finishes asking before you start
              answering.
            </li>
            <li>
              Once it&apos;s your turn, your answer is recorded automatically;
              use the &quot;Next&quot; button if you finish early.
            </li>
            <li>
              The timer is enforced by the server — once time is up, your
              interview is automatically submitted with whatever you&apos;ve
              answered so far.
            </li>
            <li>
              After the last question, the AI evaluates your answers and
              shows your score and feedback.
            </li>
            <li>Do not refresh or close this tab once the interview has started.</li>
          </ul>

          <div className="mt-6 border-2 border-red-500 bg-red-50 rounded-xl p-4">
            <p className="text-red-700 font-bold text-sm sm:text-base">
              ⚠ Do not switch tabs or open another window during the
              interview. Doing so will immediately end your interview and
              mark it as a violation. Any answers you had submitted up to
              that point will still be scored, but you will not be able to
              continue.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => router.push(AI_INTERVIEW_ROUTE)}
              className="px-5 py-2 rounded-lg text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleStart}
              disabled={starting}
              className="px-8 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-yellow-900 font-bold shadow-lg transition"
            >
              OK, Start Interview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
