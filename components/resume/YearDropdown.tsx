// components/resume/YearDropdown.tsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function YearDropdown({
  value,
  onChange,
  options,
  placeholder = "Select year",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
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
        className={`flex w-full items-center justify-between text-left ${className}`}
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDownIcon className="w-4 h-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                onChange(year);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-yellow-50 ${
                year === value
                  ? "bg-yellow-100 font-medium text-gray-900"
                  : "text-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
