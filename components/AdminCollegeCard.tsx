import { College } from "@/app/admin/home/page";

export default function AdminCollegeCard({
  college,
  onView,
}: {
  college: College;
  onView: () => void;
}) {
  return (
    <div className="rounded-xl border border-yellow-100/60 bg-gradient-to-br from-white to-yellow-50/30 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-yellow-100/60 flex items-center justify-center">
            {/* building icon */}
            <svg
              className="h-6 w-6 text-yellow-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 21h18M7 21V10l5-4 5 4v11"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {college.name}
              </h3>
              <div className="text-xs text-slate-500">Code: {college.code}</div>
            </div>

            <div className="mt-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M12 14v7"
                    ></path>
                  </svg>
                  <span className="text-xs text-slate-500">
                    {college.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M3 5h6l2 7-2 7H3"
                    ></path>
                  </svg>
                  <span className="text-xs text-slate-500">
                    {college.phone}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-start gap-2">
                <svg
                  className="h-4 w-4 text-slate-400 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M12 22s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
                  />
                </svg>
                <div className="text-xs text-slate-500">
                  {college.address || college.city}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges column */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {college.active ? (
              <span className="rounded-full bg-yellow-100/60 px-3 py-1 text-xs font-medium text-yellow-800">
                ● Active
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Inactive
              </span>
            )}

            {college.tier && (
              <span className="rounded-full border border-yellow-100 px-3 py-1 text-xs text-slate-700">
                {college.tier}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400">
            Active {college.lastActive}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-yellow-100/60 pt-4">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <div>{college.studentsCount} students</div>
          <div>{college.verifiedPercent}% verified</div>
        </div>

        <div className="mt-4">
          <button
            onClick={onView}
            className="w-full rounded-md bg-yellow-400 px-4 py-3 text-sm font-medium text-yellow-900 shadow hover:brightness-95"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
