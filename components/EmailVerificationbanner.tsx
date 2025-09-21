import React, { useState } from "react";

type Props = {
  visible?: boolean;
  email?: string;
  onVerify?: () => Promise<void>;
  onDismiss?: () => void;
  note?: string;
};

export default function EmailVerifyBanner({
  visible = true,
  email,
  onVerify,
  onDismiss,
  note,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  async function handleVerify() {
    setError(null);
    if (!onVerify) return;
    try {
      setLoading(true);
      await onVerify();
    } catch (e: any) {
      setError(e?.message || "Failed to send verification. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div role="status" aria-live="polite" className="my-3 px-4 w-full">
      <div
        className="flex items-center justify-between gap-4 rounded-lg border border-yellow-200/40 
                   bg-gradient-to-br from-yellow-50/40 to-white/10 px-4 py-3 shadow-md backdrop-blur-md
                   ring-1 ring-yellow-200/30"
        style={{ boxShadow: "0 4px 16px rgba(38, 40, 46, 0.06)" }}
      >
        {/* message */}
        <div className="flex-1 text-sm text-yellow-900">
          <strong>Email not verified:</strong>{" "}
          <span className="text-slate-800">
            Please verify {email ? `(${email})` : "your email"} to access the
            full website.
          </span>
          {note && <span className="ml-1 text-slate-700">{note}</span>}
          {error && (
            <span className="ml-2 text-red-600 text-xs font-medium">
              ({error})
            </span>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleVerify}
            disabled={loading || !onVerify}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
              ${
                loading
                  ? "opacity-70 cursor-wait"
                  : "hover:scale-[1.02] active:scale-[0.99]"
              }
              bg-gradient-to-br from-yellow-400 to-yellow-300 text-yellow-900 shadow-sm
              border border-yellow-200/60`}
            aria-disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Verify"
            )}
          </button>

          <button
            onClick={onDismiss}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:text-slate-700"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
