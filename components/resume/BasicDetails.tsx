// components/resume/BasicDetails.tsx
"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";

type Props = {
  isDefault: boolean;
  setIsDefault: (v: boolean) => void;
  resumeTitle: string;
  setResumeTitle: (v: string) => void;
  fullName: string;
  // setFullName: (v: string) => void;
  email: string;
  // setEmail: (v: string) => void;
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

  // new optional prop: validation flags coming from parent
  validationErrors?: Record<string, boolean>;
};

export default function BasicDetails({
  isDefault,
  setIsDefault,
  resumeTitle,
  setResumeTitle,
  fullName,
  email,
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
  validationErrors = {},
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [tone] = useState("neutral");
  const [loading, setLoading] = useState(false);

  // helper to check invalid flags
  const invalid = (k: string) => !!validationErrors[k];

  const inputBase =
    "mt-2 w-full px-3 py-2 rounded-lg bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";
  const inputNormal = "border border-gray-300";
  const inputInvalid = "border-red-400 ring-1 ring-red-200";

  const handleAIEnhance = async (value: string, type: string) => {
    try {
      setShowDropdown(false);
      setLoading(true);

      const kwArr = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const resp = await fetch("/api/modify-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: value,
          keywords: kwArr,
          tone,
          type, // "polish" | "concise" | "technical" | "recruiter"
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.error("Modify description error:", err);
        setSummary("❌ Failed to enhance text (server error)");
        return;
      }

      const data = await resp.json();
      const modified = data?.modified ?? "";

      if (!modified) {
        setSummary("❌ Failed to enhance text (empty response)");
      } else {
        setSummary(modified.trim());
      }
    } catch (e) {
      console.error("handleAIEnhance error:", e);
      setSummary("❌ Failed to enhance text (network error)");
    } finally {
      setLoading(false);
    }
  };
  function formatFullName(name?: string | null): string | null {
    if (!name || !name.trim()) return null;

    return name
      .split(/[, ]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      <Loader show={loading} message="Modifying your text with AI" />

      {/* ================= Resume Title ================= */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Resume Title
          </label>

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Default</span>
            <button
              type="button"
              onClick={() => setIsDefault(!isDefault)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                isDefault ? "bg-yellow-400" : "bg-gray-300"
              }`}
              aria-pressed={isDefault}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isDefault ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Input */}
        <input
          value={resumeTitle}
          onChange={(e) => setResumeTitle(e.target.value)}
          className={`${inputBase} ${
            invalid("resumeTitle") ? inputInvalid : inputNormal
          } font-medium`}
          placeholder="e.g. Frontend Developer Resume"
          aria-invalid={invalid("resumeTitle")}
        />

        {/* Error */}
        {invalid("resumeTitle") && (
          <p className="mt-1 text-xs text-red-600">Resume title is required.</p>
        )}
      </div>

      {/* Full Name + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>

          <div className="relative">
            <input
              value={formatFullName(fullName) ?? ""}
              readOnly
              placeholder="Not available"
              className={`
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-2.5
                  text-gray-900
                  focus:outline-none
                  ${
                    formatFullName(fullName)
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-gray-50 text-gray-400 italic"
                  }
                `}
              aria-readonly="true"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {formatFullName(fullName) ? "🔒" : "—"}
            </span>
          </div>

          {!formatFullName(fullName) && (
            <p className="mt-1 text-xs text-gray-500">
              Name couldn’t be loaded. Please try again later.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`${inputBase} ${
              invalid("location") ? inputInvalid : inputNormal
            }`}
            placeholder="e.g. New York"
            aria-invalid={invalid("location")}
          />
          {invalid("location") && (
            <p className="mt-1 text-xs text-red-600">Location is required.</p>
          )}
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="relative">
            <input
              value={email ?? ""}
              readOnly
              placeholder="Not available"
              className={`
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-2.5
                  focus:outline-none
                  ${
                    email
                      ? "bg-gray-100 text-gray-900 cursor-not-allowed"
                      : "bg-gray-50 text-gray-400 italic"
                  }
                `}
              aria-readonly="true"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {email ? "🔒" : "—"}
            </span>
          </div>

          {!email && (
            <p className="mt-1 text-xs text-gray-500">
              Email couldn’t be loaded. Please refresh or try again later.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) => {
              // allow only digits
              const digitsOnly = e.target.value.replace(/\D/g, "");
              setPhone(digitsOnly);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={`${inputBase} ${
              invalid("phone") ? inputInvalid : inputNormal
            }`}
            placeholder="e.g. 0123456789"
            aria-invalid={invalid("phone")}
          />

          {invalid("phone") && (
            <p className="mt-1 text-xs text-red-600">
              Phone number must be 10 digits.
            </p>
          )}
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
              type="button"
            >
              <SparklesIcon className="w-3 h-3 text-pink-500" /> AI Enhance
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleAIEnhance(summary, "polish")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  type="button"
                >
                  ✨ Polish
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "concise")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  type="button"
                >
                  ✂️ Make Concise
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "technical")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  type="button"
                >
                  🔧 More Technical
                </button>
                <button
                  onClick={() => handleAIEnhance(summary, "recruiter")}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  type="button"
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
          className={`${inputBase} ${
            invalid("summary") ? inputInvalid : inputNormal
          } mt-2`}
          placeholder="Write your objective"
          aria-invalid={invalid("summary")}
        />
        {invalid("summary") && (
          <p className="mt-1 text-xs text-red-600">Objective is required.</p>
        )}
      </div>

      {/* Keywords input (comma separated) */}
      <div className="mt-2">
        {/* <label className="block text-sm font-medium text-gray-700">
          Keywords (comma separated)
        </label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className={`${inputBase} ${inputNormal} mt-1`}
          placeholder="e.g. React, TypeScript, Golang"
        /> */}
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
            className={`${inputBase} ${inputNormal}`}
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
            className={`${inputBase} ${inputNormal}`}
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
            className={`${inputBase} ${inputNormal}`}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>
    </>
  );
}
