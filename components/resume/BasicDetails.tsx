// components/resume/BasicDetails.tsx
"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useModifyDescription } from "@/hooks/useModifyDescription";
import Loader from "../Loader";

type Props = {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  portfolioLink: string;
  setPortfolioLink: (v: string) => void;
  githubLink: string;
  setGithubLink: (v: string) => void;
  linkedinLink: string;
  setLinkedinLink: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
};

export default function BasicDetails({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  location,
  setLocation,
  portfolioLink,
  setPortfolioLink,
  githubLink,
  setGithubLink,
  linkedinLink,
  setLinkedinLink,
  summary,
  setSummary,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const inputClasses =
    "mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";

  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("neutral");

  const { modifyDescription, loading, error } = useModifyDescription();

  const handleAIEnhance = async (value: string, type: string) => {
    const kwArr = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const modified = await modifyDescription(value, kwArr, type);
    if (modified) {
      setSummary(modified);
    } else {
      setSummary("❌ Failed to enhance text");
    }
    setShowDropdown(false);
  };

  return (
    <>
      <Loader show={loading} message="Modifying your text with AI"></Loader>
      {/* Full Name + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Vaishnavi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClasses}
            placeholder="e.g. New York"
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="e.g. name@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClasses}
            placeholder="e.g. 0123456789"
          />
        </div>
      </div>

      {/* Objective with AI enhance */}
      <div className="mt-4 relative">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Objective
          </label>

          {/* AI Enhance Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-800 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 hover:brightness-105"
            >
              <SparklesIcon className="w-3 h-3 text-pink-500" /> AI Enhance
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleAIEnhance(summary, "polish")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  ✨ Polish
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "concise")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  ✂️ Make Concise
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "technical")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  🔧 More Technical
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "recruiter")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  🏢 Recruiter-Friendly
                </button>
              </div>
            )}
          </div>
        </div>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300"
          placeholder="Write your objective"
        />
      </div>

      {/* Portfolio + Github */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio link
          </label>
          <input
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className={inputClasses}
            placeholder="https://yourportfolio.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Github link
          </label>
          <input
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className={inputClasses}
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      {/* Linkedin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Linkedin profile
          </label>
          <input
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
            className={inputClasses}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>
    </>
  );
}
