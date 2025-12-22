// "use client";

// // /components/toast/ToastProvider.tsx
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useMemo,
//   useState,
// } from "react";

// type ToastVariant = "success" | "error";

// export type Toast = {
//   id: string;
//   message: string;
//   variant: ToastVariant;
//   duration?: number; // ms (defaults to 5000)
// };

// type ToastContextType = {
//   showToast: (opts: Omit<Toast, "id">) => void;
//   success: (message: string, duration?: number) => void;
//   error: (message: string, duration?: number) => void;
// };

// const ToastContext = createContext<ToastContextType | null>(null);

// export const ToastProvider: React.FC<React.PropsWithChildren> = ({
//   children,
// }) => {
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const remove = useCallback((id: string) => {
//     setToasts((curr) => curr.filter((t) => t.id !== id));
//   }, []);

//   const showToast = useCallback(
//     (opts: Omit<Toast, "id">) => {
//       const id = crypto.randomUUID();
//       const toast: Toast = { id, duration: 5000, ...opts };
//       setToasts((curr) => [toast, ...curr]);

//       const timeout = setTimeout(() => remove(id), toast.duration);
//       // In case component unmounts quickly, we ignore clearTimeout; GC is fine here.
//       return () => clearTimeout(timeout);
//     },
//     [remove]
//   );

//   const success = useCallback(
//     (message: string, duration?: number) => {
//       showToast({ message, variant: "success", duration });
//     },
//     [showToast]
//   );

//   const error = useCallback(
//     (message: string, duration?: number) => {
//       showToast({ message, variant: "error", duration });
//     },
//     [showToast]
//   );

//   const value = useMemo(
//     () => ({ showToast, success, error }),
//     [showToast, success, error]
//   );

//   return (
//     <ToastContext.Provider value={value}>
//       {children}

//       {/* Portal-like container (top-right) */}
//       <div
//         className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2"
//         aria-live="assertive"
//         aria-atomic="true"
//       >
//         {toasts.map((t) => (
//           <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };

// export const useToast = () => {
//   const ctx = useContext(ToastContext);
//   if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
//   return ctx;
// };

// const VARIANT_STYLES: Record<
//   ToastVariant,
//   { container: string; icon: string; border: string }
// > = {
//   success: {
//     container: "bg-green-50 text-green-900",
//     icon: "bg-green-600",
//     border: "border-green-200",
//   },
//   error: {
//     container: "bg-red-50 text-red-900",
//     icon: "bg-red-600",
//     border: "border-red-200",
//   },
// };

// const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({
//   toast,
//   onClose,
// }) => {
//   const s = VARIANT_STYLES[toast.variant];

//   return (
//     <div
//       className={[
//         "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all",
//         "animate-in fade-in zoom-in-95 slide-in-from-top-2",
//         s.container,
//         s.border,
//       ].join(" ")}
//       role="alert"
//     >
//       {/* Icon dot */}
//       <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${s.icon}`} />

//       {/* Message */}
//       <div className="flex-1 text-sm font-medium">{toast.message}</div>

//       {/* Close button */}
//       <button
//         onClick={onClose}
//         className="ml-2 inline-flex rounded-lg p-1 text-sm/none text-black/50 hover:bg-black/5"
//         aria-label="Close"
//       >
//         ✕
//       </button>
//     </div>
//   );
// };
