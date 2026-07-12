// components/resume/WorkExperienceForm.tsx
import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";
import { WorkExperience } from "@/server-api/api/types/resume.types";
import { useToast } from "@/components/toast/ToastContext";
import { ToastStates } from "@/enums/enums";
import YearDropdown from "./YearDropdown";
import AIEnhanceMenu, { AIEnhanceType } from "./AIEnhanceMenu";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1995 + 1 }, (_, i) =>
  String(CURRENT_YEAR - i),
);
const END_YEAR_OPTIONS = ["Present", ...YEAR_OPTIONS];

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

  const [attemptedAdd, setAttemptedAdd] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editExp, setEditExp] = useState<WorkExperience | null>(null);

  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const { showToast } = useToast();

  const handleNewChange = (field: keyof WorkExperience, value: string) => {
    setNewExp({ ...newExp, [field]: value });
  };

  const addExperience = () => {
    if (
      !newExp.company.trim() ||
      !newExp.role.trim() ||
      !newExp.start_year.trim() ||
      !newExp.end_year.trim() ||
      !newExp.description.trim()
    ) {
      setAttemptedAdd(true);
      showToast(ToastStates.ERROR, "Please add all the mandatory fields");
      return;
    }
    setAttemptedAdd(false);
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

  const fieldBorder = (value: string) =>
    attemptedAdd && !value.trim() ? invalidBorder : baseBorder;

  const handleAIEnhance = async (
    setter: (val: string) => void,
    value: string,
    type: AIEnhanceType,
    context: {
      company: string;
      role: string;
      start_year: string;
      end_year: string;
    },
  ) => {
    if (!value.trim()) {
      showToast(
        ToastStates.ERROR,
        "Please enter some text before using AI Enhance",
      );
      return;
    }

    try {
      setLoading(true);

      const kwArr = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const resp = await fetch("/api/modify-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: value,
          keywords: kwArr,
          tone: "neutral",
          type,
          section: "experience",
          context,
        }),
      });

      if (!resp.ok) {
        showToast(
          ToastStates.ERROR,
          "Failed to enhance text. Please try again.",
        );
        return;
      }

      const data = await resp.json();
      const modified = data?.modified?.trim();

      if (!modified) {
        showToast(
          ToastStates.ERROR,
          "Failed to enhance text. Please try again.",
        );
      } else {
        setter(modified);
      }
    } catch {
      showToast(ToastStates.ERROR, "Failed to enhance text. Please try again.");
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => handleNewChange("company", e.target.value)}
              className={`w-full ${inputClasses} ${fieldBorder(newExp.company)}`}
              placeholder="Google, Microsoft"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={newExp.role}
              onChange={(e) => handleNewChange("role", e.target.value)}
              className={`w-full ${inputClasses} ${fieldBorder(newExp.role)}`}
              placeholder="Fullstack developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <YearDropdown
              value={newExp.start_year}
              onChange={(year) => handleNewChange("start_year", year)}
              options={YEAR_OPTIONS}
              className={`${inputClasses} ${fieldBorder(newExp.start_year)}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Year
            </label>
            <YearDropdown
              value={newExp.end_year}
              onChange={(year) => handleNewChange("end_year", year)}
              options={END_YEAR_OPTIONS}
              className={`${inputClasses} ${fieldBorder(newExp.end_year)}`}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={addExperience}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm hover:bg-yellow-500"
            >
              <PlusIcon className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Work Experience
            </label>

            <AIEnhanceMenu
              disabled={loading || !newExp.description.trim()}
              onSelect={(type) =>
                handleAIEnhance(
                  (val) => setNewExp({ ...newExp, description: val }),
                  newExp.description,
                  type,
                  {
                    company: newExp.company,
                    role: newExp.role,
                    start_year: newExp.start_year,
                    end_year: newExp.end_year,
                  },
                )
              }
            />
          </div>

          <textarea
            value={newExp.description}
            onChange={(e) => handleNewChange("description", e.target.value)}
            rows={3}
            placeholder="Describe your work (50–70 words)"
            className={`w-full ${inputClasses} ${fieldBorder(newExp.description)}`}
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
            {editIndex === index && editExp ? (
              <div className="flex-1 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editExp.company}
                    onChange={(e) =>
                      setEditExp({ ...editExp, company: e.target.value })
                    }
                    placeholder="Company"
                    className={`w-full ${inputClasses} ${baseBorder}`}
                  />
                  <input
                    type="text"
                    value={editExp.role}
                    onChange={(e) =>
                      setEditExp({ ...editExp, role: e.target.value })
                    }
                    placeholder="Role"
                    className={`w-full ${inputClasses} ${baseBorder}`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <YearDropdown
                    value={editExp.start_year}
                    onChange={(year) =>
                      setEditExp({ ...editExp, start_year: year })
                    }
                    options={YEAR_OPTIONS}
                    className={`${inputClasses} ${baseBorder}`}
                  />
                  <YearDropdown
                    value={editExp.end_year}
                    onChange={(year) =>
                      setEditExp({ ...editExp, end_year: year })
                    }
                    options={END_YEAR_OPTIONS}
                    className={`${inputClasses} ${baseBorder}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Experience
                  </label>
                  <AIEnhanceMenu
                    disabled={loading || !editExp.description.trim()}
                    onSelect={(type) =>
                      handleAIEnhance(
                        (val) => setEditExp({ ...editExp, description: val }),
                        editExp.description,
                        type,
                        {
                          company: editExp.company,
                          role: editExp.role,
                          start_year: editExp.start_year,
                          end_year: editExp.end_year,
                        },
                      )
                    }
                  />
                </div>
                <textarea
                  value={editExp.description}
                  onChange={(e) =>
                    setEditExp({ ...editExp, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full ${inputClasses} ${baseBorder}`}
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  👔 {exp.role}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  🏢 {exp.company}
                </p>
                <p className="text-xs text-gray-500">
                  ⏳ {exp.start_year}
                  {exp.end_year ? ` - ${exp.end_year}` : ""}
                </p>
                <p className="mt-2 text-sm text-gray-600 leading-snug">
                  📄 {exp.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editIndex === index ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 text-sm rounded-md bg-yellow-300 text-white hover:bg-yellow-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
