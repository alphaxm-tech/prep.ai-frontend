export default function QuestionBankPage() {
  const questions = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "89%",
      status: "Solved",
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      acceptance: "84%",
      status: "Attempted",
    },
    {
      id: 3,
      title: "Merge Intervals",
      difficulty: "Medium",
      acceptance: "67%",
      status: "Not Attempted",
    },
    {
      id: 4,
      title: "LRU Cache",
      difficulty: "Hard",
      acceptance: "41%",
      status: "Not Attempted",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Question Bank</h1>

          <p className="mt-2 text-slate-500">
            Practice coding interview questions at your own pace.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            placeholder="Search questions..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              outline-none
              transition
              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-100
            "
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3">
          {["All", "Easy", "Medium", "Hard"].map((item) => (
            <button
              key={item}
              className="
                rounded-full
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-slate-600
                transition
                hover:border-yellow-300
                hover:bg-yellow-50
              "
            >
              {item}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              grid
              grid-cols-[1fr_120px_120px_140px]
              border-b
              border-slate-100
              px-6
              py-4
              text-sm
              font-semibold
              text-slate-500
            "
          >
            <div>Title</div>
            <div>Difficulty</div>
            <div>Acceptance</div>
            <div>Status</div>
          </div>

          {questions.map((question) => (
            <button
              key={question.id}
              className="
                grid
                w-full
                grid-cols-[1fr_120px_120px_140px]
                items-center
                border-b
                border-slate-100
                px-6
                py-5
                text-left
                transition
                hover:bg-yellow-50/50
              "
            >
              <div className="font-medium text-slate-900">{question.title}</div>

              <div>
                <span
                  className={
                    question.difficulty === "Easy"
                      ? "text-green-600"
                      : question.difficulty === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {question.difficulty}
                </span>
              </div>

              <div className="text-slate-600">{question.acceptance}</div>

              <div>
                {question.status === "Solved" ? (
                  <span
                    className="
                      rounded-full
                      bg-green-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-green-700
                    "
                  >
                    Solved
                  </span>
                ) : question.status === "Attempted" ? (
                  <span
                    className="
                      rounded-full
                      bg-yellow-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-yellow-700
                    "
                  >
                    Attempted
                  </span>
                ) : (
                  <span
                    className="
                      rounded-full
                      bg-slate-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-slate-600
                    "
                  >
                    Not Started
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
