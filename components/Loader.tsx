import React from "react";

type LoadingOverlayProps = {
  show: boolean;
  message?: string;
  /** optional: control blur intensity in px (default 4) */
  blurPx?: number;
};

/**
 * LoadingOverlay
 * - Full-screen overlay with subtle backdrop blur and yellow-themed modern loader
 * - Accessible (role="status", aria-live) and lightweight
 *
 * Usage:
 * <LoadingOverlay show={isLoading} message="Saving changes..." />
 */
export default function Loader({
  show,
  message = "Loading...",
  blurPx = 4,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={false}
      role="status"
      aria-live="polite"
    >
      {/* translucent layer */}
      <div
        className="absolute inset-0 bg-black/30"
        style={{ backdropFilter: `blur(${blurPx}px)` }}
      />

      {/* content card */}
      <div className="relative z-10 mx-4 max-w-md w-full">
        <div className="rounded-2xl bg-white/90 dark:bg-gray-900/85 backdrop-saturate-120 shadow-2xl p-6 flex flex-col items-center gap-4">
          {/* Modern ring + pulse */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* outer subtle rotating ring */}
              <svg
                className="absolute inset-0 w-full h-full animate-spin-slow"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#g1)"
                  strokeWidth="3"
                  strokeDasharray="31.4 62.8"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </svg>

              {/* inner animated glyph (dot cluster) */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="flex gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-bounce-y"
                    style={{ animationDelay: "0s" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-bounce-y"
                    style={{ animationDelay: "0.12s" }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-bounce-y"
                    style={{ animationDelay: "0.24s" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {message}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Please wait — we’re getting things ready.
              </div>
            </div>
          </div>

          {/* thin progress shimmer bar */}
          <div className="w-full mt-1">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full w-1/4 bg-gradient-to-r from-yellow-400 to-yellow-500 animate-loading-bar" />
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind additions: keyframes and utility classes (if you're using Tailwind config, paste these into theme.extend) */}
      <style jsx>{`
        @keyframes bounceY {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
        @keyframes loadingBar {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-bounce-y {
          animation: bounceY 0.9s cubic-bezier(0.2, 0.9, 0.2, 1) infinite;
          background: linear-gradient(180deg, #facc15, #f59e0b);
        }
        .animate-loading-bar {
          animation: loadingBar 1.8s linear infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
          transform-origin: center;
        }

        /* small responsive tweaks */
        @media (min-width: 640px) {
          .animate-bounce-y {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
}
