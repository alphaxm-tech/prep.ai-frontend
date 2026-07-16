"use client";

import { useGetCollegeLeaderboard } from "@/server-api/queries/quiz.queries";

// Self-contained: owns its own data fetching/loading/error state and reads
// nothing from and writes nothing to any parent component's state, so it's
// safe to drop into a page without touching that page's existing logic.
export default function QuizCollegeLeaderboard() {
  const { data: leaderboard, isLoading, isError } = useGetCollegeLeaderboard();

  const rankMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 shadow-sm">
          🏆
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            College Leaderboard
          </h3>
          <p className="text-xs text-gray-500">
            Ranked by average percentile across every quiz you and your
            classmates have completed
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="py-10 text-center text-sm text-gray-400">
          Loading leaderboard...
        </div>
      )}

      {isError && !isLoading && (
        <div className="py-10 text-center text-sm text-red-500">
          Couldn&apos;t load the leaderboard right now.
        </div>
      )}

      {!isLoading && !isError && (!leaderboard || leaderboard.length === 0) && (
        <div className="py-10 text-center text-sm text-gray-500">
          Complete a quiz to appear on the leaderboard.
        </div>
      )}

      {!isLoading && !isError && leaderboard && leaderboard.length > 0 && (
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {leaderboard.map((entry, idx) => {
            const isLastAndOutOfBand =
              entry.is_you &&
              idx === leaderboard.length - 1 &&
              leaderboard.length > 1 &&
              entry.rank !== leaderboard[idx - 1].rank + 1;

            return (
              <div key={entry.user_id}>
                {isLastAndOutOfBand && (
                  <div className="text-center text-xs text-gray-400 py-1">
                    &middot;&middot;&middot;
                  </div>
                )}
                <div
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                    entry.is_you
                      ? "bg-yellow-100 border border-yellow-300"
                      : "bg-white/80 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 text-sm font-semibold text-gray-500 shrink-0">
                      {rankMedal(entry.rank) ?? `#${entry.rank}`}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {entry.full_name}
                      {entry.is_you && (
                        <span className="ml-1.5 text-xs text-yellow-700 font-semibold">
                          (You)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {Math.round(entry.avg_percentile)}
                      <span className="text-gray-400 text-xs">th pct</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.quizzes_taken} quiz
                      {entry.quizzes_taken === 1 ? "" : "zes"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
