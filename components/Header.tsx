"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    "Home",
    "Dashboard",
    "Resume Builder",
    "AI Interviews",
    "Quizzes",
    "Study Materials",
  ];

  const handleAdminNavigation = () => {
    router.push("/admin/home");
  };
  return (
    <>
      {/* Main Header */}
      <header className="bg-yellow-200 py-3 px-6 shadow-sm flex justify-between items-center md:relative">
        <h1 className="text-xl font-bold text-gray-900">AI prep buddy</h1>

        {/* Desktop Admin Text */}
        <button
          className="hidden md:block relative px-4 py-2 text-sm font-medium text-gray-800 rounded-lg 
             bg-white/20 backdrop-blur-md shadow-md border border-white/30
             hover:bg-white/30 hover:shadow-lg transition-all duration-300"
          onClick={handleAdminNavigation}
        >
          Admin
        </button>

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
