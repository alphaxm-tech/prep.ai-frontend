// src/components/toast/ToastContainer.tsx

import React from "react";
import { Toast } from "./toast.types";

const toastStyles = {
  success: {
    container: "border-green-200 bg-green-50/90 backdrop-blur-sm",
    iconWrapper: "bg-green-500 text-white",
    title: "Success",
  },

  error: {
    container: "border-red-200 bg-red-50/90 backdrop-blur-sm",
    iconWrapper: "bg-red-500 text-white",
    title: "Something went wrong",
  },

  info: {
    container: "border-blue-200 bg-blue-50/90 backdrop-blur-sm",
    iconWrapper: "bg-blue-500 text-white",
    title: "Did you know?",
  },
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
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];

        return (
          <div
            key={toast.id}
            className={`
              relative flex items-start gap-4
              w-[380px]
              rounded-2xl
              border
              px-5 py-4
              shadow-lg shadow-black/5
              transition-all duration-300
              animate-toast-in
              ${style.container}
            `}
          >
            {/* Icon */}
            <div
              className={`
                mt-0.5
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                text-sm font-bold
                shadow-sm
                ${style.iconWrapper}
              `}
            >
              {icons[toast.type]}
            </div>

            {/* Content */}
            <div className="flex-1 pr-2">
              <h4 className="text-[15px] font-semibold text-gray-900 leading-none">
                {style.title}
              </h4>

              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="
                absolute right-4 top-4
                text-gray-400
                hover:text-gray-700
                transition-colors duration-200
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
