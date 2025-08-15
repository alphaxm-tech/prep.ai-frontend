"use client";

import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    "Home",
    "Dashboard",
    "Resume Builder",
    "AI Interviews",
    "Quizzes",
    "Study Materials",
  ];
  return (
    <>
      {/* Main Header */}
      <header className="bg-yellow-200 py-3 px-6 shadow-sm flex justify-between items-center md:relative">
        <h1 className="text-xl font-bold text-gray-900">prep.ai</h1>

        {/* Desktop Admin Text */}
        <div className="hidden md:block text-sm font-medium text-gray-700">
          Admin User
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
