import { AssessmentResponse } from "@/utils/api/types/assessment.types";

type QuizRowProps = {
  quiz: AssessmentResponse;
  index: number;
  onStartQuiz: (quiz: AssessmentResponse) => void;
};

export default function QuizRow({ quiz, index, onStartQuiz }: QuizRowProps) {
  const minutes = Math.max(1, Math.ceil(quiz.duration_sec / 60));

  const formattedDifficulty = quiz.difficulty
    ? quiz.difficulty.charAt(0).toUpperCase() +
      quiz.difficulty.slice(1).toLowerCase()
    : "";

  const difficultyColorMap: Record<string, string> = {
    EASY: "text-green-600",
    MEDIUM: "text-yellow-600",
    HARD: "text-red-600",
  };

  const difficultyColor =
    difficultyColorMap[quiz.difficulty ?? ""] || "text-gray-600";

  const attemptsLabel =
    quiz.max_attempts > 1
      ? `${quiz.max_attempts} attempts`
      : `${quiz.max_attempts} attempt`;

  return (
    <div
      key={index}
      className="bg-gradient-to-br from-white via-yellow-50 to-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 min-w-[350px]"
    >
      {/* Left Content */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-yellow-800 mb-1">
          {quiz.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>{quiz.total_questions} questions</span>
          <span>•</span>
          <span>{minutes} min</span>
          <span>•</span>
          <span className={`font-medium ${difficultyColor}`}>
            {formattedDifficulty}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-yellow-900 mt-1">
          <span>{attemptsLabel}</span>
          <span className="text-green-700 font-semibold">Best: {11}%</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onStartQuiz(quiz)}
        className="bg-yellow-400 hover:bg-yellow-300 transition px-5 py-2 text-yellow-900 font-semibold rounded-md shadow text-sm"
      >
        Start
      </button>
    </div>
  );
}
