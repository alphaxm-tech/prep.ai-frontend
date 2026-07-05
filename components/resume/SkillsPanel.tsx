import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PlusIcon } from "@heroicons/react/24/outline";

export type Tag = {
  id: string;
  skillId: number;
  text: string;
  proficiency?: "Basic" | "Intermediate" | "Advanced" | null;
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function SkillsPanel({
  skillsMaster,
  skills,
  setSkills,
  softSkills,
  setSoftSkills,
  validation = {},
}: {
  skillsMaster: any;
  skills: Tag[];
  setSkills: (t: Tag[]) => void;
  softSkills: Tag[];
  setSoftSkills: (t: Tag[]) => void;
  validation?: {
    skillsMissing?: boolean;
    softSkillsMissing?: boolean;
  };
}) {
  const [inputSoft, setInputSoft] = useState("");
  const [skillQuery, setSkillQuery] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const skillRowRef = useRef<HTMLDivElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  const invalid = (k: "skillsMissing" | "softSkillsMissing") => !!validation[k];

  const addTag = (
    list: Tag[],
    listSetter: (v: Tag[]) => void,
    text: string,
    skillId: number,
    prof: Tag["proficiency"] | null = null,
  ) => {
    const t = text.trim();
    if (!t) return;
    if (list.some((x) => x.skillId === skillId && skillId !== -1)) return;

    listSetter([
      ...list,
      {
        id: uid("tag"),
        skillId,
        text: t,
        proficiency: prof,
      },
    ]);
  };

  const removeTag = (
    listSetter: (v: Tag[]) => void,
    list: Tag[],
    id: string,
  ) => {
    listSetter(list.filter((x) => x.id !== id));
  };

  // Skills already added are excluded, and the remaining list is filtered
  // by whatever the user has typed so far (case-insensitive substring match).
  const filteredSkills = useMemo(() => {
    const already = new Set(skills.map((s) => s.skillId));
    const q = skillQuery.trim().toLowerCase();
    return (skillsMaster?.skills ?? []).filter((skill: any) => {
      if (already.has(skill.SkillID)) return false;
      if (!q) return true;
      return skill.DisplayName.toLowerCase().includes(q);
    });
  }, [skillQuery, skills, skillsMaster]);

  const handleSelectSkill = (skill: any) => {
    addTag(skills, setSkills, skill.DisplayName, skill.SkillID);
    setSkillQuery("");
    setShowSkillDropdown(false);
  };

  const handleAddSkill = () => {
    if (filteredSkills.length === 0) return;
    handleSelectSkill(filteredSkills[0]);
  };

  const updateDropdownPosition = () => {
    if (!skillRowRef.current || !skillInputRef.current) return;
    const row = skillRowRef.current.getBoundingClientRect();
    const input = skillInputRef.current.getBoundingClientRect();
    setDropdownRect({ top: input.bottom + 4, left: row.left, width: row.width });
  };

  const openSkillDropdown = () => {
    updateDropdownPosition();
    setShowSkillDropdown(true);
  };

  const handleAddSoftSkill = () => {
    if (!inputSoft.trim()) return;
    addTag(softSkills, setSoftSkills, inputSoft, -1);
    setInputSoft("");
  };

  const counts = useMemo(
    () => ({ skills: skills.length, soft: softSkills.length }),
    [skills.length, softSkills.length],
  );

  const handleSoftSkillEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // important if inside a form
      handleAddSoftSkill();
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === "Escape") {
      setShowSkillDropdown(false);
    }
  };

  // Close the dropdown when the user clicks anywhere outside the input/list.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (skillInputRef.current?.contains(target)) return;
      if (skillDropdownRef.current?.contains(target)) return;
      setShowSkillDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The dropdown is portaled to <body>, so keep it pinned under the input
  // whenever the page scrolls or resizes while it's open.
  useEffect(() => {
    if (!showSkillDropdown) return;
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [showSkillDropdown]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Technical Skills */}
      <div
        className={`p-4 rounded-xl border bg-gray-50/40 shadow-sm border-gray-200`}
      >
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Skills</h4>

        <div className="flex items-center gap-2" ref={skillRowRef}>
          <input
            ref={skillInputRef}
            type="text"
            value={skillQuery}
            onChange={(e) => {
              setSkillQuery(e.target.value);
              openSkillDropdown();
            }}
            onFocus={openSkillDropdown}
            onKeyDown={handleSkillKeyDown}
            placeholder="Search a skill..."
            className={`min-w-0 flex-1 rounded-lg bg-white px-4 py-2 text-sm border
                          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300
                          ${
                            invalid("skillsMissing")
                              ? "border-red-200 ring-1 ring-red-200"
                              : "border-gray-300"
                          }
                        `}
          />

          {showSkillDropdown &&
            dropdownRect &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={skillDropdownRef}
                style={{
                  position: "fixed",
                  top: dropdownRect.top,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                }}
                className="z-50 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                {filteredSkills.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No matching skills
                  </div>
                ) : (
                  filteredSkills.map((skill: any) => (
                    <button
                      type="button"
                      key={skill.SkillID}
                      onClick={() => handleSelectSkill(skill)}
                      className="block w-full break-words px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50"
                    >
                      {skill.DisplayName}
                    </button>
                  ))
                )}
              </div>,
              document.body,
            )}

          <button
            onClick={handleAddSkill}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm hover:bg-yellow-500"
          >
            <PlusIcon className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {invalid("skillsMissing") && (
          <p className="mt-1 text-xs text-red-600">
            At least one technical skill is required.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
            >
              {t.text}
              <button
                onClick={() => removeTag(setSkills, skills, t.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div
        className={`p-4 rounded-xl border bg-gray-50/40 shadow-sm ${
          invalid("softSkillsMissing")
            ? "border-red-400 ring-1 ring-red-200"
            : "border-gray-200"
        }`}
      >
        <h4 className="text-sm font-semibold mb-2 text-gray-800">
          Soft Skills
        </h4>

        <div className="flex items-center gap-2">
          <input
            value={inputSoft}
            onChange={(e) => setInputSoft(e.target.value)}
            placeholder="e.g. Communication"
            className={`min-w-0 flex-1 rounded-lg bg-white px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 border ${
              invalid("softSkillsMissing")
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-yellow-300"
            }`}
            onKeyDown={handleSoftSkillEnter}
          />
          <button
            onClick={handleAddSoftSkill}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm hover:bg-yellow-500"
          >
            <PlusIcon className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {invalid("softSkillsMissing") && (
          <p className="mt-1 text-xs text-red-600">
            Add at least one soft skill.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {softSkills.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
            >
              {t.text}
              <button
                onClick={() => removeTag(setSoftSkills, softSkills, t.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
