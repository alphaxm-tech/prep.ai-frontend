import React, { useEffect, useMemo, useRef, useState } from "react";

export function VerticalAccordion({
  title,
  children,
  isOpenProp = false,
}: {
  title: string;
  children: React.ReactNode;
  isOpenProp?: boolean;
}) {
  const [open, setOpen] = useState(isOpenProp);
  useEffect(() => setOpen(isOpenProp), [isOpenProp]);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full px-5 py-3 flex items-center justify-between text-left focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="text-sm text-gray-500">{open ? "Close" : "Open"}</div>
      </button>

      <div
        className={`transition-[max-height,opacity] duration-300 overflow-hidden ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

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
  validation,
}: {
  skillsMaster: any;
  skills: Tag[];
  setSkills: (t: Tag[]) => void;
  softSkills: Tag[];
  setSoftSkills: (t: Tag[]) => void;
  validation?: { skillsMissing?: boolean };
}) {
  const [inputSoft, setInputSoft] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<number | "">("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingProf, setEditingProf] = useState<Tag["proficiency"] | null>(
    null
  );

  const editRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

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
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
      setEditingProf(null);
    }
  };

  const commitEdit = () => {
    if (!editingId) return;

    const update = (arr: Tag[]) =>
      arr.map((t) =>
        t.id === editingId
          ? {
              ...t,
              text: editingText.trim() || t.text,
              proficiency: editingProf,
            }
          : t
      );

    if (skills.some((t) => t.id === editingId)) {
      setSkills(update(skills));
    } else {
      setSoftSkills(update(softSkills));
    }

    setEditingId(null);
    setEditingText("");
    setEditingProf(null);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Technical Skills */}
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 shadow-sm">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Skills</h4>

        <div className="flex gap-2">
          <select
            value={selectedSkill}
            onChange={(e) =>
              setSelectedSkill(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
          >
            <option value="" disabled>
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
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 shadow-sm">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">
          Soft Skills
        </h4>

        <div className="flex gap-2">
          <input
            value={inputSoft}
            onChange={(e) => setInputSoft(e.target.value)}
            placeholder="e.g. Communication"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
          />
          <button
            onClick={handleAddSoftSkill}
            className="w-9 h-9 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
          >
            +
          </button>
        </div>

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
