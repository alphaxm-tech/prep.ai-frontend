"use client";

import { MOCK_STUDENTS } from "@/utils/dummy-data/mock-students";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

export type Student = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  status: "active" | "inactive";
  joinedAt: string;
  quizzesTaken: number;
  aiInterviews: number;
  resumesMade: number;
  codingAttempts: number;
};

export default function StudentsTable() {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`/admin/students/1`);
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-md border border-gray-200 text-sm bg-white hover:bg-gray-50">
            Update
          </button>
          <button
            className="px-3 py-1.5 rounded-md border border-gray-200 text-sm bg-white hover:bg-gray-50"
            onClick={handleNavigate}
          >
            Navigate
          </button>
          <span className="text-sm text-gray-500">
            {MOCK_STUDENTS.length} results
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-200 text-sm bg-white hover:bg-gray-50">
            Filter
          </button>
          <button className="px-3 py-1.5 rounded-md border border-gray-200 text-sm bg-white hover:bg-gray-50">
            Sort
          </button>
          <button className="px-4 py-1.5 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700">
            + Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm border-collapse">
          {/* Table Head */}
          <thead className="bg-white border-b border-gray-100">
            <tr className="text-left text-gray-500">
              <th className="px-5 py-4 border-r border-gray-50">
                <input type="checkbox" className="h-4 w-4 rounded" />
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Student
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Roll No
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Quizzes
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                AI Interviews
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Resumes
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Coding
              </th>
              <th className="px-5 py-4 font-medium border-r border-gray-50">
                Status
              </th>
              <th className="px-5 py-4 font-medium">Joined</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {MOCK_STUDENTS.map((student) => (
              <tr
                key={student.id}
                className="
                    bg-white
                    even:bg-gray-100
                    hover:bg-purple-50/40
                    transition
                    border-b border-gray-50
                "
              >
                {/* Checkbox */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <input type="checkbox" className="h-4 w-4 rounded" />
                </td>

                {/* Student */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                      {student.name.charAt(0)}
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Roll No */}
                <td className="px-5 py-4 text-gray-600 border-r border-gray-50">
                  {student.rollNo}
                </td>

                {/* Quizzes */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                    {student.quizzesTaken}
                  </span>
                </td>

                {/* AI Interviews */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                    {student.aiInterviews}
                  </span>
                </td>

                {/* Resumes */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    {student.resumesMade}
                  </span>
                </td>

                {/* Coding */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                    {student.codingAttempts}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4 border-r border-gray-50">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        student.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {student.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-5 py-4 text-gray-500">
                  {new Date(student.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
