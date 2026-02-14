"use client";

import { AuthContext } from "@/app/provider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type User = {
  full_name: string;
  userRole?: {
    name: string;
  };
};

export function ProtectedHeader({ user }: { user: User }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const userDetailsMain = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const isAdmin = user?.userRole?.name === "SUPER_ADMIN";

  const handleLogout = async () => {
    // Ideally call logout API here
    // await fetch("/api/logout", { method: "POST" });

    router.replace("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-yellow-200/90 to-yellow-100/80 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer select-none flex flex-col leading-none"
          >
            {/* <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase mb-0.5">
              Raghu College
            </span> */}

            <div className="flex items-center gap-0.5 font-extrabold tracking-tight">
              <span className="text-gray-900 text-3xl">Prep</span>
              <span className="text-yellow-700 text-3xl">Buddy</span>
              <span className="ml-1 text-yellow-700 text-xs font-semibold relative -top-2">
                AI
              </span>
            </div>
          </div>

          {/* RIGHT SIDE NAV */}
          <nav className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin/home")}
                className="
                  px-5 py-2 text-sm font-semibold
                  rounded-full bg-yellow-500 text-white
                  shadow-sm hover:shadow-md hover:bg-yellow-600
                  transition-all
                "
              >
                Admin
              </button>
            )}

            <div className="text-sm font-medium text-gray-800">
              {user?.full_name}
            </div>

            <button
              onClick={handleLogout}
              className="
                px-6 py-2 text-sm font-semibold
                rounded-full bg-gray-900 text-white
                shadow-sm hover:shadow-md hover:bg-gray-800
                transition-all
              "
            >
              Logout
            </button>
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

      {/* MOBILE DROPDOWN */}
      <div
        className={`
          md:hidden bg-white/95 backdrop-blur-md border-t border-black/10 shadow-lg
          transition-all duration-300 ease-out
          ${
            menuOpen
              ? "max-h-screen opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
          }
        `}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {isAdmin && (
            <button
              onClick={() => {
                router.push("/admin/home");
                setMenuOpen(false);
              }}
              className="text-left text-sm font-medium text-gray-800 hover:text-gray-900 transition"
            >
              Admin Panel
            </button>
          )}

          <div className="text-sm text-gray-700">
            Logged in as {user?.full_name}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-sm font-semibold rounded-full bg-gray-900 text-white shadow-sm hover:shadow-md transition"
            >
              Logout any sanket
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
