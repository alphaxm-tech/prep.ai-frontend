import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { resumes, UsersResumeResponse } from "@/utils/api/types/resume.types";

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
      // if click is outside the container, close
      if (!el.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    // Close on Escape
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
    <div className="relative inline-block text-left" ref={rootRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex justify-between items-center w-56 px-4 py-2 
                   bg-yellow-100/60 border border-yellow-300 
                   rounded-lg shadow-sm text-gray-800 font-semibold
                   hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        Your Resumes
        <ChevronDownIcon
          className={`w-5 h-5 ml-2 transform transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="menu"
          className="absolute mt-2 w-56 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-10 max-h-60 overflow-auto"
        >
          {resumes.length > 0 ? (
            resumes.map((r) => (
              <button
                key={r.resume_id}
                onClick={() => {
                  onSelect?.(r);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm 
                           text-gray-700 hover:bg-yellow-50 
                           focus:outline-none focus:bg-yellow-100"
                role="menuitem"
              >
                <div className="font-medium">{r.Title}</div>
                <div className="text-xs text-gray-500">
                  {r.CreatedAt
                    ? new Date(r.CreatedAt).toLocaleDateString()
                    : ""}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No resumes found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
