// components/resume/WorkExperienceForm.tsx
import React, { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";
import { WorkExperience } from "@/utils/api/types/resume.types";

export default function WorkExperienceForm({
  experiences,
  setExperiences,
  validationErrors = {},
}: {
  experiences: WorkExperience[];
  setExperiences: (v: WorkExperience[]) => void;
  validationErrors?: Record<string, boolean>;
}) {
  const [newExp, setNewExp] = useState<WorkExperience>({
    company: "",
    role: "",
    start_year: "",
    end_year: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editExp, setEditExp] = useState<WorkExperience | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNewChange = (field: keyof WorkExperience, value: string) => {
    setNewExp({ ...newExp, [field]: value });
  };

  const addExperience = () => {
    if (
      !newExp.company ||
      !newExp.role ||
      !newExp.start_year ||
      !newExp.end_year ||
      !newExp.description
    ) {
      return;
    }
    setExperiences([...experiences, newExp]);
    setNewExp({
      company: "",
      role: "",
      start_year: "",
      description: "",
      end_year: "",
    });
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditExp({ ...experiences[index] });
  };

  const saveEdit = () => {
    if (editExp && editIndex !== null) {
      const updated = [...experiences];
      updated[editIndex] = editExp;
      setExperiences(updated);
      setEditIndex(null);
      setEditExp(null);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditExp(null);
  };

  const deleteExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const inputClasses =
    "px-3 py-2 border text-sm font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";

  const baseBorder = "border-gray-200";
  const invalidBorder = "border-red-400 ring-1 ring-red-200";

  const sectionInvalid =
    !!validationErrors?.experiences && experiences.length === 0;

  const handleAIEnhance = async (
    setter: (val: string) => void,
    value: string,
    type: "polish" | "concise" | "technical" | "recruiter"
  ) => {
    try {
      setShowDropdown(false);
      setLoading(true);

      const kwArr = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const resp = await fetch("/api/modify-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: value || "",
          keywords: kwArr,
          tone: "neutral",
          type,
        }),
      });

      if (!resp.ok) {
        setter(
          value
            ? `${value} — (AI enhance failed, keeping original)`
            : "AI enhance failed."
        );
        return;
      }

      const data = await resp.json();
      setter(data?.modified?.trim() || value);
    } catch {
      setter(
        value
          ? `${value} — (AI enhance failed: network error)`
          : "AI enhance failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Loader show={loading} message="Enhancing description with AI" />

      {/* --- Add New Work Experience Form --- */}
      <div
        className={`p-4 bg-gray-50/40 rounded-xl border shadow-sm flex flex-col gap-3 mb-6 ${
          sectionInvalid ? invalidBorder : baseBorder
        }`}
      >
        {sectionInvalid && (
          <div className="text-sm text-red-600">
            Please add at least one work experience.
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => handleNewChange("company", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
              placeholder="Google, Microsoft"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => handleNewChange("role", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
              placeholder="Fullstack developer"
            />
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={newExp.start_year}
              onChange={(e) => handleNewChange("start_year", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
              placeholder="2022-2024"
            />
          </div>

          <button
            onClick={addExperience}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
          >
            +
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Work Experience
            </label>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-800 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-sm hover:shadow-md transition"
              >
                <SparklesIcon className="w-3 h-3 text-pink-500" /> AI Enhance
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {[
                    ["✨ Polish", "polish"],
                    ["✂️ Make Concise", "concise"],
                    ["🔧 More Technical", "technical"],
                    ["🏢 Recruiter-Friendly", "recruiter"],
                  ].map(([label, type]) => (
                    <button
                      key={type}
                      onClick={() =>
                        handleAIEnhance(
                          (val) => setNewExp({ ...newExp, description: val }),
                          newExp.description,
                          type as any
                        )
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <textarea
            value={newExp.description}
            onChange={(e) => handleNewChange("description", e.target.value)}
            rows={3}
            placeholder="Describe your work (50–70 words)"
            className={`w-full ${inputClasses} ${baseBorder}`}
          />
        </div>
      </div>

      {/* --- List of Added Experiences --- */}
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50/40 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                👔 {exp.role}
              </h3>
              <p className="text-sm font-medium text-gray-700">
                🏢 {exp.company}
              </p>
              <p className="text-xs text-gray-500">⏳ {exp.start_year}</p>
              <p className="mt-2 text-sm text-gray-600 leading-snug">
                📄 {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(index)}
                className="px-3 py-1 text-sm rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                Edit
              </button>
              <button
                onClick={() => deleteExperience(index)}
                className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
