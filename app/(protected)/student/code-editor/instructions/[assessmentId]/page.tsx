"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/Loader";
import { CODE_EDITOR_ROUTE } from "@/constants/ui-routes";

// Modeled on the Quiz module's pre-quiz instructions page
// (app/(protected)/student/quiz/instructions/[assessmentId]/page.tsx) as a
// UI/UX pattern reference only — copy here says "test"/"code test", never
// "quiz", per the Code Editor feature's naming rule.
//
// Unlike the quiz flow, this page doesn't itself create the attempt: the
// code-editor test page (app/(protected)/student/code-editor/[title]/[id])
// already calls POST /code-editor/assessments/:id/start on mount to
// create-or-resume the attempt, so "Start Code Test" here just navigates
// there — no duplicate attempt-creation call.
export default function CodeTestInstructionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const assessmentId = params.assessmentId as string;
  const title = searchParams.get("title") || "This Code Test";
  const totalQuestions = searchParams.get("total_questions");
  const durationSec = searchParams.get("duration_sec");
  const minutes = durationSec
    ? Math.max(1, Math.ceil(Number(durationSec) / 60))
    : null;

  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    router.push(`${CODE_EDITOR_ROUTE}/${slug}/${assessmentId}`);
  };

  return (
    <>
      <Loader show={starting} message="Starting your code test..." />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Please read the instructions below carefully before you begin
            this code test.
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
              Use the question navigator on the left to move freely between
              questions.
            </li>
            <li>
              Each question shows its problem description and a few example
              test cases alongside the editor.
            </li>
            <li>
              Click &quot;Run&quot; to test your code against the visible
              example test cases, or &quot;Submit Question&quot; to grade it
              against the full test suite for that question.
            </li>
            <li>
              You may submit the complete test at any time before the timer
              runs out.
            </li>
            <li>
              The timer is enforced by the server — once time is up, this
              attempt is automatically closed and scored from whatever
              you&apos;ve submitted so far.
            </li>
            <li>Do not refresh or close this tab once the test has started.</li>
          </ul>

          <div className="mt-6 border-2 border-red-500 bg-red-50 rounded-xl p-4">
            <p className="text-red-700 font-bold text-sm sm:text-base">
              ⚠ Do not switch tabs or open another window during the test.
              Doing so will immediately stop the test and mark it as a
              violation. Any questions you had already submitted up to that
              point will still be scored, but you will not be able to
              continue.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => router.push(CODE_EDITOR_ROUTE)}
              className="px-5 py-2 rounded-lg text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleStart}
              disabled={starting}
              className="px-8 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-yellow-900 font-bold shadow-lg transition"
            >
              Start Code Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
