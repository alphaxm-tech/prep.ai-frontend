import React, { useMemo, useState } from "react";

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
  const [selectedSkill, setSelectedSkill] = useState<number | "">("");

  const invalid = (k: "skillsMissing" | "softSkillsMissing") => !!validation[k];

  const addTag = (
    list: Tag[],
    listSetter: (v: Tag[]) => void,
    text: string,
    skillId: number,
    prof: Tag["proficiency"] | null = null
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
    id: string
  ) => {
    listSetter(list.filter((x) => x.id !== id));
  };

  const handleAddSkill = () => {
    if (!selectedSkill) return;

    const skill = skillsMaster.skills.find(
      (s: any) => s.SkillID === selectedSkill
    );
    if (!skill) return;

    addTag(skills, setSkills, skill.DisplayName, skill.SkillID);
    setSelectedSkill("");
  };

  const handleAddSoftSkill = () => {
    if (!inputSoft.trim()) return;
    addTag(softSkills, setSoftSkills, inputSoft, -1);
    setInputSoft("");
  };

  const counts = useMemo(
    () => ({ skills: skills.length, soft: softSkills.length }),
    [skills.length, softSkills.length]
  );

  const handleSoftSkillEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // important if inside a form
      handleAddSoftSkill();
    }
  };

  const handleSkillEnter = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if ((e.key = "Enter")) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Technical Skills */}
      <div
        className={`p-4 rounded-xl border bg-gray-50/40 shadow-sm border-gray-200`}
      >
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Skills</h4>

        <div className="flex gap-2">
          <select
            value={selectedSkill}
            onKeyDown={handleSkillEnter}
            onChange={(e) =>
              setSelectedSkill(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className={`flex-1 rounded-lg bg-white px-4 py-2 text-sm border
                          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300
                          ${
                            invalid("skillsMissing")
                              ? "border-red-200 ring-1 ring-red-200"
                              : "border-gray-300"
                          }
                        `}
          >
            <option value="" disabled className="text-gray-400">
              Select a skill
            </option>
            {skillsMaster?.skills.map((skill: any) => (
              <option key={skill.SkillID} value={skill.SkillID}>
                {skill.DisplayName}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddSkill}
            className="w-9 h-9 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
          >
            +
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
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
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

        <div className="flex gap-2">
          <input
            value={inputSoft}
            onChange={(e) => setInputSoft(e.target.value)}
            placeholder="e.g. Communication"
            className={`flex-1 rounded-lg bg-white px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 border ${
              invalid("softSkillsMissing")
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-yellow-300"
            }`}
            onKeyDown={handleSoftSkillEnter}
          />
          <button
            onClick={handleAddSoftSkill}
            className="w-9 h-9 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
          >
            +
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
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
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
