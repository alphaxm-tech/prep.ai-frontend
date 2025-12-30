// src/components/toast/ToastContainer.tsx
import React from "react";
import { Toast } from "./toast.types";

const borderStyles = {
  success: "border-green-300/40",
  error: "border-red-300/40",
  info: "border-blue-300/40",
};

const accentBar = {
  success: "bg-gradient-to-b from-green-400 to-green-600",
  error: "bg-gradient-to-b from-red-400 to-red-600",
  info: "bg-gradient-to-b from-blue-400 to-blue-600",
};

const iconBg = {
  success: "bg-green-500/10 text-green-600",
  error: "bg-red-500/10 text-red-600",
  info: "bg-blue-500/10 text-blue-600",
};

const icons = {
  success: "✓",
  error: "✕",
  info: "i",
};

export const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            relative flex items-start gap-4
            w-[340px]
            rounded-2xl
            bg-white/90 backdrop-blur-md
            border ${borderStyles[toast.type]}
            px-5 py-4
            shadow-xl shadow-black/10
            animate-toast-in
          `}
        >
          {/* Accent bar */}
          <div
            className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
              accentBar[toast.type]
            }`}
          />

          {/* Icon */}
          <div
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full text-sm font-bold
              ${iconBg[toast.type]}
            `}
          >
            {icons[toast.type]}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {toast.message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="
              text-gray-400
              hover:text-gray-700
              transition
              rounded-md
              px-1
            "
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
