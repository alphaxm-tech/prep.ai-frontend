import React, { useState } from "react";

interface Education {
  level: string;
  institute: string;
  location: string;
  duration: string;
  grade: string;
}

export default function EducationForm() {
  const [educations, setEducations] = useState<Education[]>([
    { level: "", institute: "", location: "", duration: "", grade: "" },
  ]);

  const handleChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { level: "", institute: "", location: "", duration: "", grade: "" },
    ]);
  };

  return (
    <div className="">
      {/* <h2 className="text-xl font-bold mb-4">Education Details</h2> */}

      {educations.map((edu, index) => (
        <div
          key={index}
          className="flex items-center gap-4 mb-4 p-4 bg-white rounded-lg shadow"
        >
          {/* Education History */}
          <input
            type="text"
            placeholder="Degree"
            value={edu.level}
            onChange={(e) => handleChange(index, "level", e.target.value)}
            // className="border p-2 rounded w-56"
            className="mt-2 w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200"
            // placeholder="vaishnavi@gmail.com"
          />

          {/* Institute Name */}
          <input
            type="text"
            placeholder="Institute name"
            value={edu.institute}
            onChange={(e) => handleChange(index, "institute", e.target.value)}
            className="mt-2 w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={edu.location}
            onChange={(e) => handleChange(index, "location", e.target.value)}
            className="mt-2 w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200"
          />

          {/* Duration */}
          <input
            type="text"
            placeholder="Duration"
            value={edu.duration}
            onChange={(e) => handleChange(index, "duration", e.target.value)}
            className="mt-2 w-full px-1 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200"
          />

          {/* Grade/CGPA */}
          <input
            type="text"
            placeholder="Grade/CGPA"
            value={edu.grade}
            onChange={(e) => handleChange(index, "grade", e.target.value)}
            className="mt-2 w-full px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200"
          />

          {/* Add Button (only at the last row) */}
          {index === educations.length - 1 && (
            <button
              type="button"
              onClick={addEducation}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            >
              +
            </button>
          )}
        </div>
      ))}

      {/* Preview JSON (for debugging, can be removed later) */}
      {/* <pre className="mt-6 p-4 bg-gray-100 rounded">
        {JSON.stringify(educations, null, 2)}
      </pre> */}
    </div>
  );
}
