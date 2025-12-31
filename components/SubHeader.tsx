"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function SubHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const navLinks = [
    { label: "Home", route: "/home" },
    { label: "Resume Builder", route: "/resume-builder" },
    { label: "AI Interviews", route: "/ai-interview" },
    { label: "Quizzes", route: "/quiz" },
    { label: "Study Materials", route: "/study-material" },
    { label: "Code editor", route: "/code-editor" },
  ];

  const handleSubHeaderClick = (route: string) => {
    setPendingRoute(route); // prevent flicker
    router.push(route);
  };

  useEffect(() => {
    if (pendingRoute && pathname.startsWith(pendingRoute)) {
      setPendingRoute(null);
    }
  }, [pathname, pendingRoute]);

  const isActive = (route: string) =>
    pendingRoute === route || pathname.startsWith(route);

  return (
    <>
      {/* Desktop Sub Header */}
      <nav className="hidden md:flex bg-white border-y border-gray-200 px-6">
        <div className="flex items-center gap-8 mx-auto">
          {navLinks.map(({ label, route }) => {
            const active = isActive(route);

            return (
              <button
                key={label}
                onClick={() => handleSubHeaderClick(route)}
                className={`relative py-3 text-sm font-medium transition-colors duration-200
                  ${
                    active
                      ? "text-yellow-600"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {label}

                {active && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-yellow-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
