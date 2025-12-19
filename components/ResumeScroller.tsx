// ResumeScroller.tsx
import React, { useRef, useEffect } from "react";

export interface ResumeItem {
  id: string;
  title: string;
  createdAt?: string; // ISO string or human readable
  // add other metadata if needed (preview url, thumbnail, tags...)
}

interface ResumeScrollerProps {
  resumes: ResumeItem[]; // data provided by parent or fetched
  onSelect?: (resume: ResumeItem) => void;
  visibleScrollAmount?: number; // how many px to scroll on arrow click
  className?: string;
}

export default function ResumeScroller({
  resumes,
  onSelect,
  visibleScrollAmount = 400,
  className = "",
}: ResumeScrollerProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  // Scroll helpers
  const scrollBy = (offset: number) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Keyboard support: left/right arrow when container focused
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(visibleScrollAmount);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-visibleScrollAmount);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [visibleScrollAmount]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={rowRef}
        tabIndex={0} // make focusable for keyboard events
        className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300/60"
        // tailwind's scrollbar-thin requires the scrollbar plugin; the line above is optional
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {resumes.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect?.(r)}
            className="flex-none min-w-[240px] max-w-sm 
             rounded-xl border-l-4 border-amber-400 
             bg-gradient-to-br from-white to-yello-50 
             p-5 text-left shadow-sm 
             hover:shadow-md hover:-translate-y-1 hover:border-yellow-500 
             transition-all duration-200 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label={`Open resume ${r.title}`}
            style={{ flex: "0 0 auto" }}
          >
            {/* Date */}
            <div className="text-xs font-medium text-gray-500 mb-1">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
            </div>

            {/* Title */}
            <div className="text-lg font-semibold text-gray-800">{r.title}</div>

            {/* Hint */}
            {/* <div className="text-sm text-gray-600 mt-2">
              Click to open / edit
            </div> */}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white focus:outline-none"
        onClick={() => scrollBy(visibleScrollAmount)}
      >
        ›
      </button>
    </div>
  );
}
