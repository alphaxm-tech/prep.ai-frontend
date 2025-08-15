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

      {/* Secondary Menu (Only Desktop) */}
      <nav className="hidden md:flex text-sm shadow border-t border-b border-gray-200 px-6 py-2 justify-center space-x-6 bg-white">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-gray-700 hover:text-yellow-600 font-medium"
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-3 border-t border-b z-10">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="block text-sm text-gray-700 hover:text-yellow-600 font-medium"
            >
              {link}
            </a>
          ))}
          <div className="pt-2 border-t text-sm font-medium text-gray-700">
            Admin User
          </div>
        </div>
      )}
    </>
  );
}
