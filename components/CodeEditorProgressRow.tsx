"use client";

import { useRouter } from "next/navigation";
import { AssessmentResponse } from "@/server-api/api/types/assessment.types";
import { useGetAssessmentResult } from "@/server-api/queries/code-editor.queries";
import CompactAssessmentRow from "@/components/CompactAssessmentRow";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// CodeEditorProgressRow wraps the shared CompactAssessmentRow (also used by
// Quiz and AI Interview) with Code Editor-specific data: how many questions
// were answered correctly, and the total score for that attempt. Kept as
// its own component (rather than fetching inside CompactAssessmentRow
// itself) so Quiz/AI Interview's usage of the shared row stays untouched —
// only Code Editor's "Your Progress" list pulls in this extra fetch.
export default function CodeEditorProgressRow({
  quiz,
}: {
  quiz: AssessmentResponse;
}) {
  const router = useRouter();
  const { data } = useGetAssessmentResult(quiz.assessment_id);
  const result = data?.data;

  const scoreLabel = result
    ? (() => {
        const correct = result.questions.filter(
          (q) => q.status === "accepted",
        ).length;
        return `${correct}/${result.questions.length} correct • ${result.total_score}/${result.max_score} marks`;
      })()
    : undefined;

  return (
    <CompactAssessmentRow
      quiz={quiz}
      scoreLabel={scoreLabel}
      onReview={(q) => {
        const slug = slugify(q.title);
        router.push(`/student/code-editor/${slug}/${q.assessment_id}/result`);
      }}
    />
  );
}
