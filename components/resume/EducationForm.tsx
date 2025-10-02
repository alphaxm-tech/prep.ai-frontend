// components/resume/EducationForm.tsx
import React, { useState } from "react";

export interface Education {
  level: string;
  institute: string;
  location: string;
  duration: string;
  grade: string;
}

export default function EducationForm({
  educations,
  setEducations,
}: {
  educations: Education[];
  setEducations: (e: Education[]) => void;
}) {
  const [newEdu, setNewEdu] = useState<Education>({
    level: "",
    institute: "",
    location: "",
    duration: "",
    grade: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEdu, setEditEdu] = useState<Education | null>(null);

  const handleNewChange = (field: keyof Education, value: string) => {
    setNewEdu({ ...newEdu, [field]: value });
  };

  const addEducation = () => {
    if (
      !newEdu.level &&
      !newEdu.institute &&
      !newEdu.location &&
      !newEdu.duration &&
      !newEdu.grade
    ) {
      return;
    }
    setEducations([...educations, newEdu]);
    setNewEdu({
      level: "",
      institute: "",
      location: "",
      duration: "",
      grade: "",
    });
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditEdu({ ...educations[index] });
  };

  const saveEdit = () => {
    if (editEdu && editIndex !== null) {
      const updated = [...educations];
      updated[editIndex] = editEdu;
      setEducations(updated);
      setEditIndex(null);
      setEditEdu(null);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditEdu(null);
  };

  const deleteEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const inputClasses =
    "px-3 py-2 border border-gray-200 text-sm font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";

  return (
    <div>
      {/* --- Add New Education Form --- */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow space-y-3">
        {/* First line: Degree + Institute + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree
            </label>
            <input
              type="text"
              placeholder="B.Tech"
              value={newEdu.level}
              onChange={(e) => handleNewChange("level", e.target.value)}
              className={`w-full ${inputClasses}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute
            </label>
            <input
              type="text"
              placeholder="IIT Bombay"
              value={newEdu.institute}
              onChange={(e) => handleNewChange("institute", e.target.value)}
              className={`w-full ${inputClasses}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Mumbai"
              value={newEdu.location}
              onChange={(e) => handleNewChange("location", e.target.value)}
              className={`w-full ${inputClasses}`}
            />
          </div>
        </div>

        {/* Second line: Duration + Grade + Add button */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              placeholder="2018–2022"
              value={newEdu.duration}
              onChange={(e) => handleNewChange("duration", e.target.value)}
              className={`w-full ${inputClasses}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade/CGPA
            </label>
            <input
              type="text"
              placeholder="8.5"
              value={newEdu.grade}
              onChange={(e) => handleNewChange("grade", e.target.value)}
              className={`w-full ${inputClasses}`}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addEducation}
              aria-label="Add education"
              title="Add education"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400 focus:outline-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* --- List of Added Educations --- */}
      <div className="space-y-4">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {editIndex === index && editEdu ? (
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <input
                  type="text"
                  value={editEdu.level}
                  onChange={(e) =>
                    setEditEdu({ ...editEdu, level: e.target.value })
                  }
                  className={`w-full sm:w-1/4 ${inputClasses}`}
                />
                <input
                  type="text"
                  value={editEdu.institute}
                  onChange={(e) =>
                    setEditEdu({ ...editEdu, institute: e.target.value })
                  }
                  className={`w-full sm:w-1/4 ${inputClasses}`}
                />
                <input
                  type="text"
                  value={editEdu.location}
                  onChange={(e) =>
                    setEditEdu({ ...editEdu, location: e.target.value })
                  }
                  className={`w-full sm:w-1/6 ${inputClasses}`}
                />
                <input
                  type="text"
                  value={editEdu.duration}
                  onChange={(e) =>
                    setEditEdu({ ...editEdu, duration: e.target.value })
                  }
                  className={`w-full sm:w-1/6 ${inputClasses}`}
                />
                <input
                  type="text"
                  value={editEdu.grade}
                  onChange={(e) =>
                    setEditEdu({ ...editEdu, grade: e.target.value })
                  }
                  className={`w-full sm:w-1/6 ${inputClasses}`}
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {edu.level}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  {edu.institute}
                </p>

                <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>📍 {edu.location || "N/A"}</span>
                  <span>⏳ {edu.duration || "N/A"}</span>
                  <span>🎯 {edu.grade || "N/A"}</span>
                </div>
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
                    onClick={() => deleteEducation(index)}
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
