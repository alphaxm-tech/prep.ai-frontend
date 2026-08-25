"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetPendingSkills } from "@/server-api/queries/resume.queries";
import { useReviewSkill } from "@/server-api/mutations/resume.mutations";
import type { SkillsMaster } from "@/server-api/api/types/resume.types";

export default function SkillReviewPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetPendingSkills();
  const reviewMutation = useReviewSkill();

  // Track which skill row is being acted on so only that row's buttons
  // show a busy state while the mutation is in flight.
  const [actingOn, setActingOn] = useState<number | null>(null);

  const skills = data?.skills ?? [];

  const handleReview = (skill: SkillsMaster, action: "approve" | "reject") => {
    setActingOn(skill.SkillID);
    reviewMutation.mutate(
      { skillId: skill.SkillID, action },
      { onSettled: () => setActingOn(null) },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              ⚡ Super Admin · Skill Review
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Pending Skills
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Skills added by students from the resume builder. Approving a
              skill adds it to the shared dropdown; rejecting hides it from the
              dropdown but keeps it on resumes that already use it.
            </p>
          </div>

          <button
            onClick={() => router.push("/platform")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Dashboard
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h3 className="font-semibold text-gray-900">Review Queue</h3>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {skills.length} pending
            </span>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              Loading pending skills…
            </div>
          ) : isError ? (
            <div className="px-6 py-10 text-center text-sm text-red-600">
              Couldn&apos;t load the review queue. Please refresh.
            </div>
          ) : skills.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              🎉 No skills waiting for review.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {skills.map((skill) => {
                const busy = actingOn === skill.SkillID;
                return (
                  <div
                    key={skill.SkillID}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {skill.DisplayName}
                      </div>
                      <div className="text-xs text-gray-500">
                        key: {skill.SkillKey}
                        {skill.Category ? ` · ${skill.Category}` : ""}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        disabled={busy}
                        onClick={() => handleReview(skill, "approve")}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleReview(skill, "reject")}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
