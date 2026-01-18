// components/resume/ProjectForm.tsx
import React, { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";
import { Project } from "@/utils/api/types/resume.types";

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
    name: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

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

  const handleNewChange = (field: keyof Project, value: string) => {
    setNewProj({ ...newProj, [field]: value });
  };

  const addProject = () => {
    setProjects([...projects, newProj]);
    setNewProj({ name: "", description: "" });
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
            ? `${value} — (AI enhance failed, kept original)`
            : "AI enhance failed."
        );
        return;
      }

      const data = await resp.json();
      setter(data?.modified?.trim() || value);
    } catch {
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
        className={`p-4 bg-gray-50/40 rounded-xl border shadow-sm flex flex-col gap-3 mb-6 ${baseBorder}`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target as HTMLElement;

            if (target.tagName === "TEXTAREA") return;

            e.preventDefault();
            addProject();
          }
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Add a title for your project"
              value={newProj.name}
              onChange={(e) => handleNewChange("name", e.target.value)}
              className={`flex-1 ${inputClasses} ${baseBorder}`}
            />
            <button
              type="button"
              onClick={addProject}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
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

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-gray-800 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-sm hover:shadow-md"
                type="button"
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
                          (val) => setNewProj({ ...newProj, description: val }),
                          newProj.description,
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
            className="p-4 bg-gray-50/40 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            {editIndex === index && editProj ? (
              <div className="flex-1 flex flex-col gap-3">
                <input
                  type="text"
                  value={editProj.name}
                  onChange={(e) =>
                    setEditProj({ ...editProj, name: e.target.value })
                  }
                  className={`w-full ${inputClasses} ${baseBorder}`}
                />
                <textarea
                  value={editProj.description}
                  onChange={(e) =>
                    setEditProj({ ...editProj, description: e.target.value })
                  }
                  rows={3}
                  className={`w-full ${inputClasses} ${baseBorder}`}
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  🚀 {proj.name}
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
