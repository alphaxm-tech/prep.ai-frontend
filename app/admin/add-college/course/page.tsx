// app/(your-route)/colleges/courses/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllCourses } from "@/utils/queries/super-admin.queries";
import Loader from "@/components/Loader";
import { Course } from "@/utils/api/types/super-admin.types";

export default function CoursesSelectionPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // UI/validation
  const [touchedNext, setTouchedNext] = useState(false);
  const { data: courses, isLoading, isError, error } = useGetAllCourses();

  const loadingMessageMain = useMemo(() => {
    if (isLoading) return "Loading courses...";
    if (isError) return "";
    return "";
  }, [isLoading, isError]);

  console.log(courses);

  useEffect(() => {
    setAllCourses(courses?.Courses ?? []);
  }, [courses]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) {
          // If your API returns 404 or similar, we simply keep DEFAULT_COURSES
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as Course[];
        if (!mounted) return;
        // merge deduped (server data first, then defaults)
        const map = new Map<string, Course>();
        (data || []).forEach((c) => map.set(c.course_id.toString(), c));
        allCourses.forEach((c) => {
          if (
            ![...map.values()].some(
              (x) => x.name.toLowerCase() === c.name.toLowerCase()
            )
          ) {
            // ensure default duplicates by name do not get added if server already has same name
            map.set(c.course_id.toString(), c);
          }
        });

        setAllCourses(Array.from(map.values()));
      } catch (err: any) {
        console.error("Failed to load courses", err);
        // keep DEFAULT_COURSES already set
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // suggestions filtered from allCourses by query and excluding already selected
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const excluded = new Set(selectedCourses.map((c) => c.course_id));
    return allCourses!
      .filter((c) => !excluded.has(c.course_id))
      .filter((c) => (q ? c.name.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [allCourses, query, selectedCourses]);

  // Add selected course (from suggestion click or dropdown)
  const addCourse = (course: Course) => {
    if (selectedCourses.find((c) => c.course_id === course.course_id)) return;
    setSelectedCourses((s) => [...s, course]);
    setQuery("");
    setMessage(null);
  };

  // remove chip
  const removeCourse = (id: string) => {
    setSelectedCourses((s) => s.filter((c) => c.course_id.toString() !== id));
  };

  // create a new course record in DB, then select it
  // const createCourse = async (name: string) => {
  //   const trimmed = name.trim();
  //   if (!trimmed) return;
  //   setCreating(true);
  //   setMessage(null);
  //   try {
  //     const res = await fetch("/api/courses", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ name: trimmed }),
  //     });
  //     if (!res.ok) {
  //       const txt = await res.text().catch(() => "");
  //       throw new Error(txt || `HTTP ${res.status}`);
  //     }
  //     const created = (await res.json()) as Course;
  //     // add to master list (avoid duplicates by id/name) & select
  //     setAllCourses((s) => {
  //       if (
  //         s.some(
  //           (x) =>
  //             x.course_id === created.course_id ||
  //             x.name.toLowerCase() === created.name.toLowerCase()
  //         )
  //       )
  //         return s;
  //       return [created, ...s];
  //     });
  //     setSelectedCourses((s) => [...s, created]);
  //     setQuery("");
  //     setMessage({
  //       type: "success",
  //       text: `Created course "${created.name}".`,
  //     });
  //   } catch (err: any) {
  //     console.error("create course error", err);
  //     setMessage({
  //       type: "error",
  //       text: err?.message || "Failed to create course",
  //     });
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  const handleAddFromQuery = () => {
    // if query matches exact course name (case-insensitive) add that existing
    const q = query.trim();
    if (!q) return;
    const existing = allCourses!.find(
      (c) => c.name.toLowerCase() === q.toLowerCase()
    );
    if (existing) {
      addCourse(existing);
      return;
    }
    // otherwise create new
    // createCourse(q);
  };

  // navigation
  const handleBack = () => {
    router.push("/colleges/branches"); // adjust if different
  };

  const handleNext = () => {
    setTouchedNext(true);
    if (selectedCourses.length === 0) {
      setMessage({ type: "error", text: "Please select at least one course." });
      return;
    }

    // Save selected courses for the college being created.
    try {
      const ids = selectedCourses.map((c) => c.course_id);
      localStorage.setItem("newCollege:selectedCourses", JSON.stringify(ids));
    } catch (e) {
      // ignore
    }

    // navigate to requested route
    router.push("/admin/add-college/group");
  };

  // ui helpers
  const inputInvalid = touchedNext && selectedCourses.length === 0;

  return (
    <>
      <Loader show={isLoading} message={loadingMessageMain} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Add New College
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Define all the branches & courses for this college
            </p>

            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-md font-medium">
                  1
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    College Details
                  </div>
                  <div className="text-xs text-gray-400">Basic information</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-200 text-amber-600 shadow-sm font-medium">
                  2
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-900">
                    Branches
                  </div>
                  <div className="text-xs text-gray-400">
                    Add college branches
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500">
                  3
                </div>
                Groups
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500">
                  4
                </div>
                Students
              </div>
            </div>
          </header>

          <main>
            <div className="bg-white ring-1 ring-gray-100 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Select Courses
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Choose from existing courses or create new ones. You can select
                multiple.
              </p>

              {/* Existing courses dropdown (user requested) */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Existing courses
                </label>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => {
                      const id = e.target.value;
                      if (!id) return;
                      const c = allCourses!.find(
                        (x) => x.course_id.toString() === id
                      );
                      if (c) addCourse(c);
                      // reset select to default
                      e.currentTarget.selectedIndex = 0;
                    }}
                    className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm border border-transparent focus:outline-none"
                  >
                    <option value="">Select an existing course to add</option>
                    {courses?.Courses?.map((c: any) => (
                      <option key={c.course_id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div className="text-sm text-gray-400 flex items-center">
                    or
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        // focus the query input by id (if needed)
                        const el = document.getElementById(
                          "course-combobox-input"
                        ) as HTMLInputElement | null;
                        if (el) el.focus();
                      }}
                      className="px-4 py-2 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white"
                    >
                      Create new
                    </button>
                  </div>
                </div>
              </div>

              {/* Search / combobox */}
              <div className={`relative ${inputInvalid ? "mb-1" : "mb-4"}`}>
                <div className="flex items-center gap-3">
                  <input
                    id="course-combobox-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses (e.g., B.Tech Computer Science)"
                    className={`flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none focus:shadow-outline border ${
                      inputInvalid
                        ? "border-2 border-rose-300"
                        : "border border-transparent"
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFromQuery();
                      }
                    }}
                  />

                  <button
                    onClick={handleAddFromQuery}
                    disabled={creating || !query.trim()}
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white transition ${
                      creating || !query.trim()
                        ? "bg-amber-200 cursor-not-allowed"
                        : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    }`}
                  >
                    {creating ? "Adding…" : "Add"}
                  </button>
                </div>

                {/* suggestions popover */}
                {query.trim().length > 0 && suggestions.length > 0 && (
                  <ul className="absolute z-30 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-52 overflow-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s.course_id}
                        onClick={() => addCourse(s)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}

                {/* no suggestions - offer create hint */}
                {query.trim().length > 0 && suggestions.length === 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    No matching course. Press Add to create a new course named "
                    {query.trim()}"
                  </div>
                )}
              </div>

              {/* Selected chips */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedCourses.map((c) => (
                    <div
                      key={c.course_id}
                      className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-amber-700 font-medium">
                        {c.name}
                      </span>
                      <button
                        onClick={() => removeCourse(c.course_id.toString())}
                        aria-label={`Remove ${c.name}`}
                        className="w-6 h-6 rounded-full grid place-items-center text-amber-600 hover:bg-amber-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {selectedCourses.length === 0 && (
                    <div
                      className={`text-sm ${
                        inputInvalid ? "text-rose-600" : "text-gray-400"
                      }`}
                    >
                      No courses selected
                    </div>
                  )}
                </div>
              </div>

              {/* helpful area + fetch status */}
              <div className="mb-4 text-sm text-gray-500">
                {loadingCourses ? (
                  <>Loading courses…</>
                ) : fetchError ? (
                  <span className="text-rose-600">{fetchError}</span>
                ) : (
                  <>{allCourses!.length} courses available</>
                )}
              </div>

              {/* error / success message */}
              {message && (
                <div
                  className={`mb-4 rounded-lg px-4 py-2 text-sm ${
                    message.type === "error"
                      ? "bg-rose-50 text-rose-800"
                      : "bg-green-50 text-green-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  type="button"
                  className="px-4 py-2 rounded-full bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 transition"
                >
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 mr-2">
                    You can change courses later
                  </div>
                  <button
                    onClick={() => {
                      setTouchedNext(true);
                      handleNext();
                    }}
                    type="button"
                    className={`px-6 py-3 rounded-full font-semibold text-white shadow-md transition ${
                      selectedCourses.length === 0
                        ? "bg-amber-200 cursor-not-allowed"
                        : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
