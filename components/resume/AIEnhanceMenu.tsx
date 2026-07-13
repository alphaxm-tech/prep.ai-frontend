// components/resume/AIEnhanceMenu.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";

export type AIEnhanceType = "polish" | "concise" | "technical" | "recruiter";

const OPTIONS: [string, AIEnhanceType][] = [
  ["✨ Polish", "polish"],
  ["✂️ Make Concise", "concise"],
  ["🔧 More Technical", "technical"],
  ["🏢 Recruiter-Friendly", "recruiter"],
];

const MENU_WIDTH = 176; // w-44
const MENU_HEIGHT = 176; // approx height of 4 options

export default function AIEnhanceMenu({
  disabled,
  onSelect,
}: {
  disabled?: boolean;
  onSelect: (type: AIEnhanceType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dropdown is portaled to <body> (rather than positioned relative to this
  // button) because this menu is used inside a VerticalAccordion, whose
  // collapse animation requires overflow-hidden on its content wrapper —
  // that clips any absolutely-positioned dropdown that has no sibling
  // content below it to "borrow" overflow room from, which is exactly the
  // case for the last project entry's dropdown. Mirrors the same
  // portal-to-body pattern already used by SkillsPanel.tsx's dropdowns.
  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_HEIGHT + 8;
    setMenuPos({
      top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  };

  const toggleOpen = () => {
    if (!open) updateMenuPosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const closeOnScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", closeOnScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", closeOnScroll);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium shadow-sm transition ${
          disabled
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "text-gray-800 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 hover:shadow-md"
        }`}
      >
        <SparklesIcon className="w-3 h-3 text-pink-500" /> AI Enhance
      </button>

      {open &&
        menuPos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
            }}
            className="z-50 w-44 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
          >
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
          </div>,
          document.body,
        )}
    </div>
  );
}
