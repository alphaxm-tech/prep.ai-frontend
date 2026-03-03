"use client";

import {
  AI_INTERVIEW_ROUTE,
  CODE_EDITOR_ROUTE,
  QUIZ_ROUTE,
  RESUME_BUILDER_ROUTE,
  STUDENT_ROUTE,
  STUDY_MATERIAL_ROUTE,
} from "@/utils/CONSTANTS";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function SubHeader({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const SUBHEADER_NAVIGATION_BY_ROLE: Record<
    string,
    { label: string; route: string }[]
  > = {
    STUDENT: [
      { label: "Home", route: STUDENT_ROUTE },
      { label: "Resume Builder", route: RESUME_BUILDER_ROUTE },
      { label: "AI Interviews", route: AI_INTERVIEW_ROUTE },
      { label: "Quizzes", route: QUIZ_ROUTE },
      { label: "Study Materials", route: STUDY_MATERIAL_ROUTE },
      { label: "Code Editor", route: CODE_EDITOR_ROUTE },
    ],

    PLACEMENT: [
      { label: "Dashboard", route: "/placement/dashboard" },
      { label: "Drives", route: "/placement/drives" },
      { label: "Students", route: "/placement/students" },
      { label: "Applications", route: "/placement/applications" },
      { label: "Assessments", route: "/placement/assessments" },
      { label: "Interviews", route: "/placement/interviews" },
      { label: "Offers", route: "/placement/offers" },
      { label: "Reports", route: "/placement/reports" },
      { label: "Audit", route: "/placement/audit" },
      { label: "Settings", route: "/placement/settings" },
    ],

    SUPER_ADMIN: [
      { label: "Dashboard", route: "/admin/dashboard" },
      { label: "Colleges", route: "/admin/colleges" },
      { label: "Users", route: "/admin/users" },
      { label: "Reports", route: "/admin/reports" },
      { label: "System Logs", route: "/admin/logs" },
    ],
  };

  const navLinks = SUBHEADER_NAVIGATION_BY_ROLE[user?.role?.name] || [];

  console.log(user?.role?.name);

  const handleSubHeaderClick = (route: string) => {
    if (route === pathname) return; // avoid unnecessary navigation
    setPendingRoute(route);
    router.push(route);
  };

  useEffect(() => {
    if (pendingRoute && pathname === pendingRoute) {
      setPendingRoute(null);
    }
  }, [pathname, pendingRoute]);

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(route + "/");

  return (
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
  );
}
