// components/resume/ProjectForm.tsx
import React, { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";

export interface Project {
  title: string;
  description: string;
}

export default function ProjectsForm({
  projects,
  setProjects,
  validationErrors = {},
}: {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  validationErrors?: Record<string, boolean>;
}) {
  const [newProj, setNewProj] = useState<Project>({
    title: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(""); // optional keywords for AI

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

  const handleNewChange = (field: keyof Project, value: string) => {
    setNewProj({ ...newProj, [field]: value });
  };

  const addProject = () => {
    // allow adding any project
    setProjects([...projects, newProj]);
    setNewProj({ title: "", description: "" });
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditProj({ ...projects[index] });
  };

  const saveEdit = () => {
    if (editProj && editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = editProj;
      setProjects(updated);
      setEditIndex(null);
      setEditProj(null);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditProj(null);
  };

  const deleteProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const inputClasses =
    "px-3 py-2 border text-sm font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";

  const baseBorder = "border-gray-200";

  // Real AI-enhance integration using server API route
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
        const err = await resp.json().catch(() => ({}));
        console.error("AI enhance server error:", err);
        setter(
          value
            ? `${value} — (AI enhance failed, kept original)`
            : "AI enhance failed."
        );
        return;
      }

      const data = await resp.json();
      const modified = data?.modified ?? "";

      if (!modified) {
        setter(value ? `${value} — (AI returned empty)` : "AI returned empty.");
      } else {
        setter(modified.trim());
      }
    } catch (e) {
      console.error("handleAIEnhance error:", e);
      setter(
        value ? `${value} — (AI network error)` : "AI enhance network error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Loader show={loading} message="Enhancing description with AI" />

      {/* --- Add New Project Form --- */}
      <div
        className={`p-4 bg-white rounded-lg shadow flex flex-col gap-3 mb-6 ${baseBorder}`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Add a title for your project"
              value={newProj.title}
              onChange={(e) => handleNewChange("title", e.target.value)}
              className={`flex-1 ${inputClasses} ${baseBorder}`}
            />
            <button
              onClick={addProject}
              aria-label="Add project"
              title="Add project"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400 focus:outline-none shrink-0"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Project Description
            </label>

            <div className="flex items-center gap-3">
              {/* <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Keywords (optional): React, Golang"
                className="px-2 py-1 text-sm border rounded"
              /> */}

              <div className="relative" ref={dropdownRef}>
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
                      onClick={() =>
                        handleAIEnhance(
                          (val) => setNewProj({ ...newProj, description: val }),
                          newProj.description,
                          "polish"
                        )
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      type="button"
                    >
                      ✨ Polish
                    </button>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) => setNewProj({ ...newProj, description: val }),
                          newProj.description,
                          "concise"
                        )
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      type="button"
                    >
                      ✂️ Make Concise
                    </button>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) => setNewProj({ ...newProj, description: val }),
                          newProj.description,
                          "technical"
                        )
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      type="button"
                    >
                      🔧 More Technical
                    </button>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) => setNewProj({ ...newProj, description: val }),
                          newProj.description,
                          "recruiter"
                        )
                      }
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      type="button"
                    >
                      🏢 Recruiter-Friendly
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <textarea
            placeholder="Add project description (50–70 words)"
            value={newProj.description}
            onChange={(e) => handleNewChange("description", e.target.value)}
            rows={3}
            className={`mt-2 w-full ${inputClasses} ${baseBorder}`}
          />
        </div>
      </div>

      {/* --- List of Added Projects --- */}
      <div className="space-y-4">
        {projects.map((proj, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            {editIndex === index && editProj ? (
              <div className="flex-1 flex flex-col gap-3">
                <input
                  type="text"
                  value={editProj.title}
                  onChange={(e) =>
                    setEditProj({ ...editProj, title: e.target.value })
                  }
                  className={`w-full ${inputClasses} ${baseBorder}`}
                />
                <div className="flex items-start gap-2">
                  <textarea
                    value={editProj.description}
                    onChange={(e) =>
                      setEditProj({ ...editProj, description: e.target.value })
                    }
                    rows={3}
                    className={`flex-1 ${inputClasses} ${baseBorder}`}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) =>
                            setEditProj((prev) =>
                              prev ? { ...prev, description: val } : prev
                            ),
                          editProj.description,
                          "polish"
                        )
                      }
                      className="px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      ✨
                    </button>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) =>
                            setEditProj((prev) =>
                              prev ? { ...prev, description: val } : prev
                            ),
                          editProj.description,
                          "concise"
                        )
                      }
                      className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      ✂️
                    </button>
                    <button
                      onClick={() =>
                        handleAIEnhance(
                          (val) =>
                            setEditProj((prev) =>
                              prev ? { ...prev, description: val } : prev
                            ),
                          editProj.description,
                          "technical"
                        )
                      }
                      className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      🔧
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  🚀 {proj.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-snug">
                  📄 {proj.description}
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
                    onClick={() => deleteProject(index)}
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
