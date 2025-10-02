import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export interface ResumeItem {
  id: string;
  title: string;
  createdAt?: string;
}

export default function ResumeDropdown({
  resumes,
  onSelect,
}: {
  resumes: ResumeItem[];
  onSelect?: (r: ResumeItem) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
          className="absolute mt-2 w-56 bg-white border border-gray-200 
                     rounded-lg shadow-lg z-10 max-h-60 overflow-auto"
        >
          {resumes.length > 0 ? (
            resumes.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelect?.(r);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm 
                           text-gray-700 hover:bg-yellow-50 
                           focus:outline-none focus:bg-yellow-100"
              >
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
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
