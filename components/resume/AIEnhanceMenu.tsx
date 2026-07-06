// components/resume/AIEnhanceMenu.tsx
import React, { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

export type AIEnhanceType = "polish" | "concise" | "technical" | "recruiter";

const OPTIONS: [string, AIEnhanceType][] = [
  ["✨ Polish", "polish"],
  ["✂️ Make Concise", "concise"],
  ["🔧 More Technical", "technical"],
  ["🏢 Recruiter-Friendly", "recruiter"],
];

export default function AIEnhanceMenu({
  disabled,
  onSelect,
}: {
  disabled?: boolean;
  onSelect: (type: AIEnhanceType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium shadow-sm transition ${
          disabled
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "text-gray-800 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 hover:shadow-md"
        }`}
      >
        <SparklesIcon className="w-3 h-3 text-pink-500" /> AI Enhance
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-44 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {OPTIONS.map(([label, type]) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setOpen(false);
                onSelect(type);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
