import { useEffect, useState } from "react";

export function VerticalAccordion({
  title,
  children,
  isOpenProp = false,
  invalid,
}: {
  title: string;
  children: React.ReactNode;
  isOpenProp?: boolean;
  invalid: Record<string, boolean>;
}) {
  const [open, setOpen] = useState(isOpenProp);
  useEffect(() => setOpen(isOpenProp), [isOpenProp]);

  //   console.log(title, invalid?.__static);

  return (
    <div
      className={`w-full rounded-xl border bg-white shadow-sm overflow-hidden border-gray-200`}
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full px-5 py-3 flex items-center justify-between text-left focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              invalid.__static ? "bg-indigo-500" : "bg-red-500"
            }`}
          />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="text-sm text-gray-500">{open ? "Close" : "Open"}</div>
      </button>

      <div
        className={`transition-[max-height,opacity] duration-300 overflow-hidden ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
