// app/(your-route)/colleges/groups/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Branch = {
  id: string;
  name: string;
};

type GroupRow = {
  id: string; // local id
  branchId: string;
  name: string;
};

const SAMPLE_BRANCHES: Branch[] = [
  { id: "b_cs", name: "Computer Science" },
  { id: "b_mech", name: "Mechanical" },
  { id: "b_llb", name: "LLB" },
];

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function GroupsPage() {
  const router = useRouter();

  // branches are expected to come from previous step (localStorage or API)
  const [branches, setBranches] = useState<Branch[]>(SAMPLE_BRANCHES);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // dynamic group rows
  const [rows, setRows] = useState<GroupRow[]>([
    { id: uid("row"), branchId: "", name: "" },
  ]);

  // validation state: map row id -> {branch: bool, name: bool}
  const [errors, setErrors] = useState<
    Record<string, { branch?: boolean; name?: boolean }>
  >({});
  const [touchedNext, setTouchedNext] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // load branches from localStorage (saved earlier) — fallback to SAMPLE_BRANCHES
    try {
      const raw = localStorage.getItem("newCollege:branches");
      if (raw) {
        const parsed = JSON.parse(raw);
        // expected format: array of { id?, name } or array of strings (names)
        const normalized: Branch[] = Array.isArray(parsed)
          ? parsed.map((b: any, i: number) =>
              typeof b === "string"
                ? {
                    id: `br_${i}_${b.replace(/\s+/g, "_").toLowerCase()}`,
                    name: b,
                  }
                : {
                    id: b.id ?? `br_${i}`,
                    name: b.name ?? b.title ?? `Branch ${i + 1}`,
                  }
            )
          : SAMPLE_BRANCHES;
        setBranches(normalized.length ? normalized : SAMPLE_BRANCHES);
      } else {
        // no stored branches: try merge with sample
        setBranches(SAMPLE_BRANCHES);
      }
    } catch (err) {
      console.error("Failed to parse branches from localStorage", err);
      setFetchError("Failed to load branches — using defaults.");
      setBranches(SAMPLE_BRANCHES);
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  // helpers
  const addRow = () => {
    setRows((s) => [...s, { id: uid("row"), branchId: "", name: "" }]);
  };

  const removeRow = (id: string) => {
    setRows((s) => s.filter((r) => r.id !== id));
    setErrors((e) => {
      const clone = { ...e };
      delete clone[id];
      return clone;
    });
  };

  const updateRow = (id: string, patch: Partial<GroupRow>) => {
    setRows((s) => s.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    // clear per-field error when user edits
    setErrors((e) => {
      const rowErr = e[id];
      if (!rowErr) return e;
      const newErr = { ...e };
      const next = {
        ...rowErr,
        branch: patch.branchId ? false : rowErr.branch,
        name: patch.name ? false : rowErr.name,
      };
      newErr[id] = next;
      return newErr;
    });
  };

  const firstInvalidRef = useRef<HTMLElement | null>(null);

  const validateRows = (): boolean => {
    const nextErrors: typeof errors = {};
    let hasError = false;

    rows.forEach((r) => {
      const rowErr: { branch?: boolean; name?: boolean } = {};
      if (!r.branchId || r.branchId.trim() === "") {
        rowErr.branch = true;
        hasError = true;
      }
      if (!r.name || r.name.trim() === "") {
        rowErr.name = true;
        hasError = true;
      }
      if (Object.keys(rowErr).length) nextErrors[r.id] = rowErr;
    });

    setErrors(nextErrors);
    return !hasError;
  };

  const scrollToFirstInvalid = () => {
    // locate first element with data-invalid attribute
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLElement>(
      "[data-first-invalid='true']"
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus?.();
    }
  };

  const handleBack = () => {
    router.push("/colleges/courses"); // previous step
  };

  const handleNext = () => {
    setTouchedNext(true);
    const ok = validateRows();
    if (!ok) {
      // wait a tick to allow DOM update then scroll
      setTimeout(scrollToFirstInvalid, 50);
      return;
    }

    // Persist groups to localStorage (or call API). We'll store as array of { branchId, name }
    try {
      const payload = rows.map((r) => ({
        branchId: r.branchId,
        name: r.name.trim(),
      }));
      localStorage.setItem("newCollege:groups", JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to persist groups to localStorage", e);
    }

    router.push("/colleges/students"); // next step
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New College
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Define groups for each branch (e.g., A1, A2, A3)
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

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-amber-200 text-amber-600 shadow-sm font-medium">
                3
              </div>
              <div>
                <div className="text-sm font-medium text-amber-900">Groups</div>
                <div className="text-xs text-gray-400">
                  Create groups by branch
                </div>
              </div>
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
          <div
            ref={containerRef}
            className="bg-white ring-1 ring-gray-100 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Create Groups
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Define groups for each branch (e.g., A1, A2, A3). You can add
              multiple groups.
            </p>

            {/* Branches load status */}
            <div className="mb-4 text-sm text-gray-500">
              {loadingBranches ? (
                "Loading branches…"
              ) : fetchError ? (
                <span className="text-rose-600">{fetchError}</span>
              ) : (
                `${branches.length} branches available`
              )}
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {rows.map((row, idx) => {
                const rowErr = errors[row.id] ?? {};
                const isBranchInvalid = !!rowErr.branch && touchedNext;
                const isNameInvalid = !!rowErr.name && touchedNext;

                return (
                  <div
                    key={row.id}
                    className={`p-3 rounded-lg bg-gray-50 border ${
                      isBranchInvalid || isNameInvalid
                        ? "border-rose-300 ring-1 ring-rose-100"
                        : "border-gray-100"
                    }`}
                    {...(isBranchInvalid || isNameInvalid
                      ? { "data-first-invalid": idx === 0 ? "true" : undefined }
                      : {})}
                    tabIndex={-1}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select Branch
                        </label>
                        <select
                          value={row.branchId}
                          onChange={(e) =>
                            updateRow(row.id, { branchId: e.target.value })
                          }
                          className={`mt-2 w-full px-4 py-3 rounded-xl text-sm bg-white placeholder-gray-400 shadow-sm transition focus:outline-none ${
                            isBranchInvalid
                              ? "border-2 border-rose-300"
                              : "border border-transparent"
                          }`}
                        >
                          <option value="">Select Branch</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                        {isBranchInvalid && (
                          <p className="mt-1 text-xs text-rose-600">
                            Please select a branch.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Group name (e.g., A1)
                        </label>
                        <input
                          value={row.name}
                          onChange={(e) =>
                            updateRow(row.id, { name: e.target.value })
                          }
                          placeholder="Group name (e.g., A1)"
                          className={`mt-2 w-full px-4 py-3 rounded-xl text-sm bg-white placeholder-gray-400 shadow-sm transition focus:outline-none ${
                            isNameInvalid
                              ? "border-2 border-rose-300"
                              : "border border-transparent"
                          }`}
                        />
                        {isNameInvalid && (
                          <p className="mt-1 text-xs text-rose-600">
                            Please enter a group name.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end md:justify-center">
                        <button
                          onClick={() => removeRow(row.id)}
                          type="button"
                          aria-label="Remove group row"
                          className="ml-2 w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* add another */}
            <div className="mt-4">
              <button
                onClick={addRow}
                type="button"
                className="w-full text-sm rounded-xl px-4 py-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700"
                aria-label="Add another group"
              >
                + Add Another Group
              </button>
            </div>

            {/* validation hint */}
            {touchedNext &&
              Object.keys(errors).length === 0 &&
              rows.length === 0 && (
                <div className="mt-4 text-xs text-rose-600">
                  Please add at least one group.
                </div>
              )}

            {/* actions */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                type="button"
                className="px-4 py-2 rounded-full bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400 mr-2">
                  You can change groups later
                </div>
                <button
                  onClick={() => {
                    setTouchedNext(true);
                    handleNext();
                  }}
                  type="button"
                  className="px-6 py-3 rounded-full font-semibold text-white shadow-md transition bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
