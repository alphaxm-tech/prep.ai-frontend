import { AssessmentResponse } from "@/server-api/api/types/assessment.types";

export default function CompactAssessmentRow({
  quiz,
  onReview,
}: {
  quiz: AssessmentResponse;
  onReview?: (quiz: AssessmentResponse) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-yellow-200 px-4 py-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-yellow-800 text-sm mb-1">
            {quiz.title}
          </p>
          <p className="text-xs text-gray-500">
            {quiz.total_questions} questions
          </p>
        </div>

        <button
          onClick={onReview ? () => onReview(quiz) : undefined}
          disabled={!onReview}
          className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-yellow-900 text-xs font-semibold px-3 py-1 rounded-md"
        >
          Review
        </button>
      </div>
    </div>
  );
}
