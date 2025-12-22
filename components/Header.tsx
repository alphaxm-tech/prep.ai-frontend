"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const isLoggedIn = false;

  const landingNav = [
    { label: "Home", href: "#home" },
    { label: "Why Us", href: "#why-us" },
    { label: "Platform", href: "#platform" },
    { label: "Features", href: "#features" },
    { label: "Founder", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ];

  const appNav = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Resume Builder", href: "/resume" },
    { label: "AI Interviews", href: "/interviews" },
    { label: "Quizzes", href: "/quizzes" },
    { label: "Study Materials", href: "/study-materials" },
  ];

  const navLinks = isLoggedIn ? appNav : landingNav;

  const handleNavigation = (href: string) => {
    setMenuOpen(false);

    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(href);
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-yellow-200 sticky top-0 z-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => handleNavigation("#home")}
            className="cursor-pointer flex items-center font-extrabold tracking-tight"
          >
            <span className="text-black text-3xl leading-none">Prep</span>
            <span className="text-yellow-700 text-3xl leading-none">Buddy</span>
            <span className="ml-1 text-yellow-700 text-xs font-semibold relative -top-2">
              AI
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigation(link.href)}
                className="
                  text-sm font-semibold text-gray-800 tracking-wide
                  relative after:absolute after:left-0 after:-bottom-1 
                  after:h-[2px] after:w-0 after:bg-black
                  hover:after:w-full after:transition-all duration-300
                "
              >
                {link.label}
              </button>
            ))}

            {/* CTA */}
            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="
                  ml-2 px-6 py-2 text-sm font-semibold
                  rounded-full bg-black text-white
                  shadow-md hover:shadow-lg hover:bg-gray-900
                  transition-all
                "
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => router.push("/profile")}
                className="
                  ml-2 px-6 py-2 text-sm font-semibold
                  rounded-full bg-black text-white
                  shadow-md hover:shadow-lg hover:bg-gray-900
                  transition-all
                "
              >
                Profile
              </button>
            )}
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-gray-800"
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`
          md:hidden bg-white border-t shadow-lg
          transition-all duration-300
          ${
            menuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }
        `}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigation(link.href)}
              className="text-left text-sm font-medium text-gray-800"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t">
            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2 text-sm font-semibold rounded-full bg-black text-white shadow"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => router.push("/profile")}
                className="w-full py-2 text-sm font-semibold rounded-full bg-black text-white shadow"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
