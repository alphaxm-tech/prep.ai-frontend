"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    "Home",
    "Resume Builder",
    "AI Interviews",
    "Quizzes",
    "Study Materials",
  ];

  const handleSubHeaderClick = (link: string) => {
    let route;
    if (link === "Home") {
      route = "home";
    } else if (link === "Quizzes") {
      route = "quiz";
    } else if (link === "Resume Builder") {
      route = "resume-builder";
    } else if (link === "AI Interviews") {
      route = "ai-interview";
    } else if (link === "Study Materials") {
      route = "study-material";
    }
    router.push(`/${route}`);
  };

  return (
    <>
      {/* Secondary Menu (Only Desktop) */}
      <nav className="hidden md:flex text-sm shadow border-t border-b border-gray-200 px-6 py-2 justify-center space-x-6 bg-white">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-gray-700 hover:text-yellow-600 font-medium"
            onClick={() => handleSubHeaderClick(link)}
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
