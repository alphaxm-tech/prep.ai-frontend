// components/resume/ProjectForm.tsx
import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Loader from "../Loader";
import { Project } from "@/server-api/api/types/resume.types";
import { useToast } from "@/components/toast/ToastContext";
import { ToastStates } from "@/enums/enums";
import AIEnhanceMenu, { AIEnhanceType } from "./AIEnhanceMenu";

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

  const [attemptedAdd, setAttemptedAdd] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProj, setEditProj] = useState<Project | null>(null);

  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const { showToast } = useToast();

  const handleNewChange = (field: keyof Project, value: string) => {
    setNewProj({ ...newProj, [field]: value });
  };

  const addProject = () => {
    if (!newProj.name.trim() || !newProj.description.trim()) {
      setAttemptedAdd(true);
      showToast(ToastStates.ERROR, "Please add all the mandatory fields");
      return;
    }

    setAttemptedAdd(false);
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
  const invalidBorder = "border-red-400 ring-1 ring-red-200";

  const fieldBorder = (value: string) =>
    attemptedAdd && !value.trim() ? invalidBorder : baseBorder;

  const handleAIEnhance = async (
    setter: (val: string) => void,
    value: string,
    type: AIEnhanceType,
    context: { title: string },
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
          section: "project",
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
              className={`flex-1 ${inputClasses} ${fieldBorder(newProj.name)}`}
            />
            <button
              type="button"
              onClick={addProject}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm hover:bg-yellow-500"
            >
              <PlusIcon className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Project Description
            </label>

            <AIEnhanceMenu
              disabled={loading || !newProj.description.trim()}
              onSelect={(type) =>
                handleAIEnhance(
                  (val) => setNewProj({ ...newProj, description: val }),
                  newProj.description,
                  type,
                  { title: newProj.name },
                )
              }
            />
          </div>

          <textarea
            placeholder="Add project description (50–70 words)"
            value={newProj.description}
            onChange={(e) => handleNewChange("description", e.target.value)}
            rows={3}
            className={`mt-2 w-full ${inputClasses} ${fieldBorder(newProj.description)}`}
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
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <AIEnhanceMenu
                    disabled={loading || !editProj.description.trim()}
                    onSelect={(type) =>
                      handleAIEnhance(
                        (val) => setEditProj({ ...editProj, description: val }),
                        editProj.description,
                        type,
                        { title: editProj.name },
                      )
                    }
                  />
                </div>
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
