"use client";

import { PLATFORM_ROUTE, STUDENT_ROUTE } from "@/utils/CONSTANTS";
import { UserRole } from "@/utils/enums";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// type User = {
//   full_name: string;
//   college?: {
//     code?: string;
//   };
//   userRole?: {
//     name: UserRole;
//   };
// };

export function ProtectedHeader({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = user?.role?.name;

  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    let parts = name
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length === 1) {
      parts = name.trim().split(/\s+/).filter(Boolean);
    }

    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts[parts.length - 1];
      return firstName[0].toUpperCase() + lastName[0].toUpperCase();
    }

    return parts[0][0].toUpperCase();
  };

  const initials = getInitials(user?.user?.full_name);

  // Role-based menu config
  const roleMenuMap: Record<any, { label: string; action: () => void }[]> = {
    [UserRole.SUPER_ADMIN]: [
      {
        label: "Super Admin Dashboard",
        action: () => router.push("/super-admin/home"),
      },
      {
        label: "Manage Colleges",
        action: () => router.push("/super-admin/colleges"),
      },
      {
        label: "System Reports",
        action: () => router.push("/super-admin/reports"),
      },
      {
        label: "Platform",
        action: () => router.push(`${PLATFORM_ROUTE}`),
      },
      {
        label: "Student",
        action: () => router.push(`${STUDENT_ROUTE}`),
      },
    ],

    [UserRole.ADMIN]: [
      { label: "Admin Dashboard", action: () => router.push("/admin/home") },
      { label: "Manage Users", action: () => router.push("/admin/users") },
      { label: "Reports", action: () => router.push("/admin/reports") },
    ],

    [UserRole.STUDENT]: [
      { label: "My Dashboard", action: () => router.push("/student/home") },
      {
        label: "My Applications",
        action: () => router.push("/student/applications"),
      },
      {
        label: "My Assessments",
        action: () => router.push("/student/assessments"),
      },
    ],
  };

  const roleMenuItems = role ? roleMenuMap[role] || [] : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-yellow-200/90 to-yellow-100/80 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer select-none flex flex-col leading-none"
          >
            <span className="text-[11px] font-semibold tracking-wide text-gray-700 mb-0.5">
              {user?.college?.code?.toUpperCase()}{" "}
              {user?.college?.code ? "'s" : ""}
            </span>

            <div className="flex items-center gap-0.5 font-extrabold tracking-tight">
              <span className="text-gray-900 text-3xl">Prep</span>
              <span className="text-yellow-700 text-3xl">Buddy</span>
              <span className="ml-1 text-yellow-700 text-xs font-semibold relative -top-2">
                AI
              </span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-all duration-300">
                  {initials}
                </div>

                <svg
                  className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 8l5 5 5-5H5z" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 text-gray-800 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-sm">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{role}</p>
                  </div>

                  <div className="py-2 text-sm">
                    {roleMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full text-left px-5 py-2.5 hover:bg-yellow-50 transition"
                      >
                        {item.label}
                      </button>
                    ))}

                    <button
                      onClick={() => router.push("/profile")}
                      className="w-full text-left px-5 py-2.5 hover:bg-yellow-50 transition"
                    >
                      Account
                    </button>
                  </div>

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-gray-900 transition-transform active:scale-95"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
