"use client";

import {
  AI_INTERVIEWS_LABEL,
  ASSESSMENT_MANAGEMENT_LABEL,
  CODE_EDITOR_LABEL,
  COLLEGES_LABEL,
  COMMUNICATION_LABEL,
  DASHBOARD_LABEL,
  HOME_LABEL,
  INTERVIEWS_LABEL,
  ONBOARD_COLLEGE_LABEL,
  PLACEMENT_LABEL,
  QUIZZES_LABEL,
  REPORTS_LABEL,
  RESUME_BUILDER_LABEL,
  ROLE_LABEL,
  STUDENTS_LABEL,
  STUDY_MATERIALS_LABEL,
  SYSTEM_LOGS_LABEL,
  USERS_LABEL,
} from "@/constants/subheader-labels";

import {
  COLLEGE_ADMIN_ROUTE,
  AI_INTERVIEW_ROUTE,
  CODE_EDITOR_ROUTE,
  COLLEGE,
  ONBOARD_COLLEGE,
  PLATFORM_ROUTE,
  QUIZ_ROUTE,
  RESUME_BUILDER_ROUTE,
  STUDENT_ROUTE,
  STUDY_MATERIAL_ROUTE,
  PLACEMENT,
  INTERVIEWS,
  COMMUNICATION,
  ROLE,
  REPORT,
  STUDENTS,
  ASSESSMENT_MANAGEMENT,
} from "@/constants/ui-routes";
import {
  CollegeAdminRoles,
  InterviewPrepRoles,
  SuperAdminRoles,
} from "@/lib/allowed-roles";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function SubHeader({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(user?.college?.college_id);

  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const NAV_SECTIONS: {
    roles: string[];
    prefix: string;
    links: { label: string; route: string }[];
  }[] = [
    {
      roles: InterviewPrepRoles,
      prefix: STUDENT_ROUTE,
      links: [
        { label: HOME_LABEL, route: STUDENT_ROUTE },
        { label: RESUME_BUILDER_LABEL, route: RESUME_BUILDER_ROUTE },
        { label: QUIZZES_LABEL, route: QUIZ_ROUTE },
        { label: CODE_EDITOR_LABEL, route: CODE_EDITOR_ROUTE },
        { label: AI_INTERVIEWS_LABEL, route: AI_INTERVIEW_ROUTE },
        { label: STUDY_MATERIALS_LABEL, route: STUDY_MATERIAL_ROUTE },
      ],
    },
    {
      roles: CollegeAdminRoles,
      prefix: COLLEGE_ADMIN_ROUTE,
      links: [
        {
          label: HOME_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}`,
        },
        {
          label: PLACEMENT_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${PLACEMENT}`,
        },
        {
          label: STUDENTS_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${STUDENTS}`,
        },
        {
          label: INTERVIEWS_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${INTERVIEWS}`,
        },
        {
          label: REPORTS_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${REPORT}`,
        },
        {
          label: ROLE_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${ROLE}`,
        },
        {
          label: COMMUNICATION_LABEL,
          route: `${COLLEGE_ADMIN_ROUTE}/${user?.college?.college_id}${COMMUNICATION}`,
        },
      ],
    },
    {
      roles: SuperAdminRoles,
      prefix: PLATFORM_ROUTE,
      links: [
        { label: DASHBOARD_LABEL, route: PLATFORM_ROUTE },
        {
          label: ONBOARD_COLLEGE_LABEL,
          route: `${PLATFORM_ROUTE}${ONBOARD_COLLEGE}${COLLEGE}`,
        },
        {
          label: COLLEGES_LABEL,
          route: "/admin/colleges",
        },
        {
          label: ASSESSMENT_MANAGEMENT_LABEL,
          route: `${PLATFORM_ROUTE}${ASSESSMENT_MANAGEMENT}`,
        },
        {
          label: USERS_LABEL,
          route: "/admin/users",
        },
        {
          label: REPORTS_LABEL,
          route: "/admin/reports",
        },
        {
          label: SYSTEM_LOGS_LABEL,
          route: "/admin/logs",
        },
      ],
    },
  ];

  const navLinks =
    NAV_SECTIONS.find(
      ({ roles, prefix }) =>
        roles.includes(user?.role?.name) && pathname.startsWith(prefix),
    )?.links ?? [];

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

  // Find the single most-specific matching route (longest prefix wins).
  // This prevents /student from staying highlighted when on /student/quiz etc.
  const activeRoute = navLinks.reduce<string | null>((best, { route }) => {
    const matches = pathname === route || pathname.startsWith(route + "/");
    if (matches && (!best || route.length > best.length)) return route;
    return best;
  }, null);

  const isActive = (route: string) => route === activeRoute;

  return (
    <nav
      className="
    hidden md:flex
    sticky top-16
    z-40
    bg-white
    border-y border-gray-200
    px-6
  "
    >
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
