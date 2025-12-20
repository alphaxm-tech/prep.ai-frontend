// src/components/toast/ToastContainer.tsx
import React from "react";
import { Toast } from "./toast.types";

const styles = {
  success: "border-green-200",
  error: "border-red-200",
  info: "border-blue-200",
};

const iconBg = {
  success: "bg-green-100",
  error: "bg-red-100",
  info: "bg-blue-100",
};

const iconText = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
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
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
        relative flex items-center gap-3
        w-[320px] rounded-xl
        bg-white
        border border-gray-200
        px-4 py-3
        shadow-md shadow-black/5
        animate-slide-in
        transition
        ${styles[toast.type]}
      `}
        >
          {/* Icon */}
          <div
            className={`
          flex h-8 w-8 shrink-0 items-center justify-center
          rounded-full
          ${iconBg[toast.type]}
          ${iconText[toast.type]}
        `}
          >
            {icons[toast.type]}
          </div>

          {/* Message */}
          <p className="flex-1 text-sm font-medium leading-5 text-gray-900">
            {toast.message}
          </p>

          {/* Close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
