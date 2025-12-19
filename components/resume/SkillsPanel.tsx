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
        className={`transition-[max-height,opacity,transform] duration-250 ease-in-out overflow-hidden ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-0">{children}</div>
      </div>
    </div>
  );
}

export type Tag = {
  id: string;
  text: string;
  proficiency?: "Basic" | "Intermediate" | "Advanced" | null;
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * SkillsPanel now fully controlled via props:
 * - skills, setSkills
 * - softSkills, setSoftSkills
 *
 * New prop:
 * - validation?: { skillsMissing?: boolean }  -> when true, highlights skills input area
 */
export function SkillsPanel({
  skills,
  setSkills,
  softSkills,
  setSoftSkills,
  validation,
}: {
  skills: Tag[];
  setSkills: (t: Tag[]) => void;
  softSkills: Tag[];
  setSoftSkills: (t: Tag[]) => void;
  validation?: { skillsMissing?: boolean };
}) {
  // input controls
  const [inputSkill, setInputSkill] = useState("");
  const [inputSoft, setInputSoft] = useState("");
  const [inputSkillProf, setInputSkillProf] = useState<Tag["proficiency"] | "">(
    "Basic"
  );

  // editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingProf, setEditingProf] = useState<Tag["proficiency"] | null>(
    null
  );

  const editRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  // helpers
  const addTag = (
    list: Tag[],
    listSetter: (v: Tag[]) => void,
    text: string,
    prof: Tag["proficiency"] | null = null
  ) => {
    const t = text.trim();
    if (!t) return;
    if (list.some((x) => x.text.toLowerCase() === t.toLowerCase())) return;
    listSetter([...list, { id: uid("tag"), text: t, proficiency: prof }]);
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
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingText(tag.text);
    setEditingProf(tag.proficiency ?? null);
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

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingProf(null);
  };

  const handleKeyAdd = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isSoft = false
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isSoft) {
        addTag(softSkills, setSoftSkills, inputSoft);
        setInputSoft("");
      } else {
        addTag(
          skills,
          setSkills,
          inputSkill,
          inputSkillProf === "" ? null : inputSkillProf
        );
        setInputSkill("");
        setInputSkillProf("");
      }
    }
  };

  const handleAddSkill = () => {
    if (!inputSkill.trim()) return;
    addTag(
      skills,
      setSkills,
      inputSkill,
      inputSkillProf === "" ? null : inputSkillProf
    );
    setInputSkill("");
    setInputSkillProf("");
  };

  const handleAddSoftSkill = () => {
    if (!inputSoft.trim()) return;
    addTag(softSkills, setSoftSkills, inputSoft);
    setInputSoft("");
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const counts = useMemo(
    () => ({ skills: skills.length, soft: softSkills.length }),
    [skills.length, softSkills.length]
  );

  // dynamic classes when validation indicates skillsMissing
  const skillsContainerBorderClass = validation?.skillsMissing
    ? "border-red-300 ring-1 ring-red-200"
    : "border-gray-100";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Left: Skills */}
        <div
          className={`relative p-4 rounded-xl border ${skillsContainerBorderClass} bg-white min-h-[180px]`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Skills</h4>
              <div className="text-xs text-gray-400 mt-0.5">
                Technical skills / stacks
              </div>
            </div>
            <div className="text-xs text-gray-500">{counts.skills}</div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {/* Input on first line */}
            <input
              aria-label="Add technical skill"
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => handleKeyAdd(e, false)}
              placeholder="e.g. React, TypeScript"
              className={`w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 ${
                validation?.skillsMissing ? "border-red-400" : ""
              }`}
            />

            {/* Dropdown + button on second line */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  aria-label="Select proficiency for new skill"
                  value={inputSkillProf ?? ""}
                  onChange={(e) =>
                    setInputSkillProf(e.target.value as Tag["proficiency"] | "")
                  }
                  className="appearance-none w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 bg-white text-sm font-medium shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition-all cursor-pointer hover:shadow-md"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <button
                onClick={handleAddSkill}
                aria-label="Add skill"
                title="Add skill"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400 focus:outline-none"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {skills.length === 0 && (
              <div
                className={`text-xs ${
                  validation?.skillsMissing ? "text-red-600" : "text-gray-400"
                }`}
              >
                {validation?.skillsMissing
                  ? "Please add at least one technical skill"
                  : "No skills added yet"}
              </div>
            )}

            {skills.map((t) =>
              editingId === t.id ? (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-indigo-50"
                >
                  <input
                    ref={editRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleEditKey}
                    className="bg-transparent outline-none text-sm"
                  />
                  <select
                    value={editingProf ?? ""}
                    onChange={(e) =>
                      setEditingProf(
                        (e.target.value as Tag["proficiency"]) || null
                      )
                    }
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                    title="Proficiency"
                  >
                    <option value="">—</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    onClick={commitEdit}
                    className="text-xs font-semibold text-indigo-600 px-2"
                    aria-label="save"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-gray-400 px-2"
                    aria-label="cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition px-3 py-1 rounded-full border border-gray-100"
                >
                  <div className="text-sm font-medium text-gray-700">
                    {t.text}
                  </div>
                  {t.proficiency && (
                    <div className="text-xs text-indigo-600 font-medium">
                      · {t.proficiency}
                    </div>
                  )}
                  <button
                    onClick={() => startEdit(t)}
                    className="text-xs text-indigo-500 px-2"
                    aria-label={`Edit ${t.text}`}
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => removeTag(setSkills, skills, t.id)}
                    className="text-xs text-gray-400 px-2"
                    aria-label={`Remove ${t.text}`}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right: Soft Skills */}
        <div className="p-4 rounded-xl border border-gray-100 bg-white min-h-[180px]">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                Soft skills
              </h4>
              <div className="text-xs text-gray-400 mt-0.5">
                Communication, teamwork, mindset
              </div>
            </div>
            <div className="text-xs text-gray-500">{counts.soft}</div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              aria-label="Add soft skill"
              value={inputSoft}
              onChange={(e) => setInputSoft(e.target.value)}
              onKeyDown={(e) => handleKeyAdd(e, true)}
              placeholder="e.g. Communication, Leadership"
              className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
            />

            <button
              onClick={handleAddSoftSkill}
              aria-label="Add skill"
              title="Add skill"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400 focus:outline-none"
            >
              +
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {softSkills.length === 0 && (
              <div className="text-xs text-gray-400">
                No soft skills added yet
              </div>
            )}

            {softSkills.map((t) =>
              editingId === t.id ? (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-indigo-50"
                >
                  <input
                    ref={editRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleEditKey}
                    className="bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={commitEdit}
                    className="text-xs font-semibold text-indigo-600 px-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs text-gray-400 px-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  key={t.id}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition px-3 py-1 rounded-full border border-gray-100"
                >
                  <div className="text-sm font-medium text-gray-700">
                    {t.text}
                  </div>
                  <button
                    onClick={() => startEdit(t)}
                    className="text-xs text-indigo-500 px-2"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => removeTag(setSoftSkills, softSkills, t.id)}
                    className="text-xs text-gray-400 px-2"
                  >
                    ✕
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
