import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { resumes } from "@/utils/api/types/resume.types";

export default function ResumeDropdown({
  resumes,
  onSelect,
}: {
  resumes: resumes[];
  onSelect?: (r: resumes) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="
          inline-flex items-center justify-between gap-2
          w-56 px-4 py-2
          rounded-xl border border-gray-200
          bg-white text-sm font-semibold text-gray-800
          shadow-sm
          hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-yellow-300
          transition
        "
      >
        <span className="truncate">Your Resumes</span>

        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="
            absolute right-0 mt-2 w-56
            rounded-xl border border-gray-200
            bg-white shadow-lg
            z-20 overflow-hidden
            max-h-64 overflow-y-auto
          "
        >
          {resumes.length > 0 ? (
            resumes.map((r) => (
              <button
                key={r.resume_id}
                role="menuitem"
                onClick={() => {
                  onSelect?.(r);
                  setOpen(false);
                }}
                className="
                  w-full text-left px-4 py-3
                  hover:bg-gray-50
                  focus:outline-none focus:bg-gray-100
                  transition
                "
              >
                <div className="text-sm font-medium text-gray-800 truncate">
                  {r.Title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {r.CreatedAt
                    ? new Date(r.CreatedAt).toLocaleDateString()
                    : ""}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No resumes found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
