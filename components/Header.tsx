"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const isLoginPage = pathname.startsWith("/login");
  const isInsideApp = !isLandingPage && !isLoginPage;

  const landingNav = [
    { label: "Home", href: "#home" },
    { label: "Why Us", href: "#why-us" },
    { label: "Platform", href: "#platform" },
    { label: "Features", href: "#features" },
    { label: "Founder", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavigation = (href: string) => {
    setMenuOpen(false);

    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(href);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-yellow-200/90 to-yellow-100/80 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          {/* <div
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center gap-0.5 font-extrabold tracking-tight select-none"
          >
            <span className="text-gray-900 text-3xl leading-none pr-2">
              Raghu's
            </span>
            <span className="text-gray-900 text-3xl leading-none">Prep</span>
            <span className="text-yellow-700 text-3xl leading-none">Buddy</span>
            <span className="ml-1 text-yellow-700 text-xs font-semibold relative -top-2">
              AI
            </span>
          </div> */}

          <div
            onClick={() => router.push("/")}
            className="cursor-pointer select-none flex flex-col leading-none"
          >
            {/* Endorsement line */}
            <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase mb-0.5">
              Raghu College
            </span>

            {/* Main Brand */}
            <div className="flex items-center gap-0.5 font-extrabold tracking-tight">
              <span className="text-gray-900 text-3xl">Prep</span>
              <span className="text-yellow-700 text-3xl">Buddy</span>
              <span className="ml-1 text-yellow-700 text-xs font-semibold relative -top-2">
                AI
              </span>
            </div>
          </div>

          {/* LANDING PAGE NAV */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center gap-10">
              {landingNav.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.href)}
                  className="
                    text-sm font-medium text-gray-800
                    relative after:absolute after:left-0 after:-bottom-1
                    after:h-[2px] after:w-0 after:bg-yellow-700
                    hover:text-gray-900 hover:after:w-full
                    after:transition-all after:duration-300
                  "
                >
                  {link.label}
                </button>
              ))}

              <button
                onClick={() => router.push("/login")}
                className="
                  ml-2 px-6 py-2 text-sm font-semibold
                  rounded-full bg-gray-900 text-white
                  shadow-sm hover:shadow-md hover:bg-gray-800
                  transition-all
                "
              >
                Login
              </button>
            </nav>
          )}

          {/* INSIDE APP → LOGOUT ONLY */}
          {isInsideApp && (
            <nav className="hidden md:flex">
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
          )}

          {/* MOBILE TOGGLE (landing only) */}
          {isLandingPage && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-gray-900 transition-transform active:scale-95"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          )}
        </div>
      </header>

      {/* MOBILE MENU */}
      {isLandingPage && (
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
            {landingNav.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigation(link.href)}
                className="text-left text-sm font-medium text-gray-800 hover:text-gray-900 transition"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 text-sm font-semibold rounded-full bg-gray-900 text-white shadow-sm hover:shadow-md transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
