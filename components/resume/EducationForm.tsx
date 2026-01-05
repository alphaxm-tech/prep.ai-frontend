// components/resume/EducationForm.tsx
import { Education } from "@/utils/api/types/resume.types";
import React, { useState } from "react";

export default function EducationForm({
  educations,
  setEducations,
  validationErrors = {},
}: {
  educations: Education[];
  setEducations: (e: Education[]) => void;
  validationErrors?: Record<string, boolean>;
}) {
  const [newEdu, setNewEdu] = useState<Education>({
    degree: "",
    institute: "",
    location: "",
    start_year: "",
    end_year: "",
    grade: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEdu, setEditEdu] = useState<Education | null>(null);

  const handleNewChange = (field: keyof Education, value: string) => {
    setNewEdu({ ...newEdu, [field]: value });
  };

  const addEducation = () => {
    if (
      !newEdu.degree &&
      !newEdu.institute &&
      !newEdu.location &&
      !newEdu.start_year &&
      !newEdu.end_year &&
      !newEdu.grade
    ) {
      return;
    }
    setEducations([...educations, newEdu]);
    setNewEdu({
      degree: "",
      institute: "",
      location: "",
      start_year: "",
      end_year: "",
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
    "px-3 py-2 border text-sm font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300";

  const baseBorder = "border-gray-200";
  const invalidBorder = "border-red-400 ring-1 ring-red-200";

  const sectionInvalid =
    !!validationErrors?.educations && educations.length === 0;

  return (
    <div>
      {/* --- Add New Education Form --- */}
      <div
        className={`mb-6 p-4 bg-gray-50/40 rounded-xl border shadow-sm space-y-3 ${
          sectionInvalid ? invalidBorder : baseBorder
        }`}
      >
        {sectionInvalid && (
          <div className="text-sm text-red-600 mb-1">
            Please add at least one education.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree
            </label>
            <input
              type="text"
              placeholder="B.Tech"
              value={newEdu.degree}
              onChange={(e) => handleNewChange("degree", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
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
              className={`w-full ${inputClasses} ${baseBorder}`}
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
              className={`w-full ${inputClasses} ${baseBorder}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Year
            </label>
            <input
              type="number"
              placeholder="2018"
              value={newEdu.start_year}
              onChange={(e) => handleNewChange("start_year", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
              min={1950}
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Year
            </label>
            <input
              type="number"
              placeholder="2022"
              value={newEdu.end_year}
              onChange={(e) => handleNewChange("end_year", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
              min={newEdu.start_year || 1950}
              max={new Date().getFullYear() + 5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade / CGPA
            </label>
            <input
              type="text"
              placeholder="8.5"
              value={newEdu.grade}
              onChange={(e) => handleNewChange("grade", e.target.value)}
              className={`w-full ${inputClasses} ${baseBorder}`}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addEducation}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300 text-white text-xl shadow-sm hover:bg-yellow-400"
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
            className="p-4 bg-gray-50/40 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {editIndex === index && editEdu ? (
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {(
                  [
                    "degree",
                    "institute",
                    "location",
                    "start_year",
                    "end_year",
                    "grade",
                  ] as (keyof Education)[]
                ).map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={editEdu[field]}
                    onChange={(e) =>
                      setEditEdu({ ...editEdu, [field]: e.target.value })
                    }
                    className={`w-full sm:w-1/6 ${inputClasses} ${baseBorder}`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {edu.degree}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  {edu.institute}
                </p>

                <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>📍 {edu.location || "N/A"}</span>
                  <span>⏳ {edu.start_year || "N/A"}</span>
                  <span>⏳ {edu.end_year || "N/A"}</span>
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
