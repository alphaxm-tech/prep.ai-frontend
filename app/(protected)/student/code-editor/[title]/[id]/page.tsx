"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { useGetCodingQuestionDetails } from "@/utils/queries/code-editor.queries";
import { useSubmitCode } from "@/utils/mutations/code-editor.mutation";
import Loader from "@/components/Loader";

export default function CodeEditorPage() {
  const params = useParams();
  const { title, id: question_id } = params;
  const [activeTab, setActiveTab] = useState("Description");

  const editorStateRef = useRef({ code: "", language: "javascript" });

  const { mutate: submitCode, isPending, isError, error, data: submitResult } =
    useSubmitCode();

  const { data: questionData, isLoading: questionLoading } =
    useGetCodingQuestionDetails(Number(question_id));

  const question = questionData?.question;
  console.log(questionData?.question);

  const difficultyStyles: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Loader show={questionLoading} />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* 🔹 TOP BAR */}
        <div className="h-14 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-gray-800">
              {question?.title ?? decodeURIComponent(title as string)}
            </h1>
            {question?.difficulty && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${difficultyStyles[question.difficulty] ?? "bg-gray-100 text-gray-600"}`}
              >
                {question.difficulty}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={isPending}
              onClick={() => {
                const { code, language } = editorStateRef.current;
                submitCode(
                  { question_id: Number(question_id), code, language },
                  {
                    onSuccess: (data) => {
                      console.log("job_id:", data.job_id);
                    },
                  },
                );
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Running..." : "Run"}
            </button>

            <button className="px-4 py-1.5 text-xs font-semibold rounded-md bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm transition">
              Submit
            </button>
          </div>
        </div>

        {/* DIVIDERS */}
        <div className="h-px w-full bg-gray-200/70" />
        <div className="h-px w-full bg-white/60" />

        {/* 🔹 MAIN */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* LEFT PANEL */}
          <div className="w-[50%] flex flex-col bg-white relative">
            {/* VERTICAL DIVIDER */}
            <div className="absolute right-0 top-0 h-full w-px bg-gray-200/70" />

            {/* 🔥 TABS HEADER (GRAYED + FIXED HEIGHT) */}
            <div className="h-10 flex items-center bg-gray-50/70">
              <div className="px-6 flex gap-6 text-xs font-medium text-gray-500 w-full">
                {["Description", "Editorial", "Solutions"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                    h-full flex items-center border-b-2 transition
                    ${
                      activeTab === tab
                        ? "text-gray-900 border-yellow-400"
                        : "border-transparent hover:text-gray-700"
                    }
                  `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* FULL WIDTH DIVIDER */}
            <div className="h-px w-full bg-gray-200/70" />

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-700 leading-relaxed">
              {activeTab === "Description" && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    {question?.title}
                  </h2>

                  <p className="whitespace-pre-line">
                    {question?.question_text}
                  </p>

                  {question?.test_cases && question.test_cases.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800">Examples:</h3>
                      {question.test_cases.map((tc) => (
                        <div
                          key={tc.test_case_id}
                          className="bg-gray-50 px-4 py-3 rounded-lg text-xs font-mono space-y-1"
                        >
                          <div>
                            <span className="font-semibold">Input:</span>{" "}
                            {tc.input_data}
                          </div>
                          <div>
                            <span className="font-semibold">Output:</span>{" "}
                            {tc.expected_output}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* {question?.languages_allowed &&
                    question.languages_allowed.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Allowed Languages:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {question.languages_allowed.map((lang) => (
                            <span
                              key={lang}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )} */}
                </div>
              )}

              {activeTab === "Editorial" && <p>Editorial coming soon...</p>}
              {activeTab === "Solutions" && <p>Solutions coming soon...</p>}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-[50%] flex flex-col bg-white">
            {/* 🔥 EDITOR HEADER (MATCH HEIGHT + GRAYED) */}
            <div className="h-10 flex items-center justify-between px-4 bg-gray-50/70 text-xs text-gray-600">
              <span>Code</span>

              {/* <select className="text-xs bg-transparent focus:outline-none text-gray-600">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Go</option>
            </select> */}
            </div>

            {/* FULL WIDTH DIVIDER */}
            <div className="h-px w-full bg-gray-200/70" />

            {/* MONACO */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                onCodeChange={(code, language) => {
                  editorStateRef.current = { code, language };
                }}
              />
            </div>

            {/* TEST PANEL */}
            <div className="h-32 bg-gray-50 text-xs px-4 py-2">
              {isPending && (
                <span className="text-gray-500">Running your code...</span>
              )}
              {isError && (
                <span className="text-red-500">
                  Error: {(error as Error)?.message ?? "Submission failed"}
                </span>
              )}
              {submitResult && (
                <span className="text-green-600">
                  Submitted! Job ID: {submitResult.job_id}
                </span>
              )}
              {!isPending && !isError && !submitResult && (
                <span className="text-gray-400">Test results will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
