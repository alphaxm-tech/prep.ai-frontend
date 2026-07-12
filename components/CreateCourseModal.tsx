"use client";

import { CreateCourseRequest } from "@/server-api/api/types/ccg.types";
import { createCourse } from "@/server-api/mutations/ccg.mutations";
import React, { useEffect, useState } from "react";
import { useToast } from "./toast/ToastContext";
import { ToastStates } from "@/enums/enums";

export type NewCourseInput = {
  name: string;
  code: string;
  description: string;
  type: string;
};

type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (course: NewCourseInput) => void;
  creating?: boolean;
};

const EMPTY_FORM: NewCourseInput = {
  name: "",
  code: "",
  description: "",
  type: "",
};

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
  creating = false,
}: CreateCourseModalProps) {
  const [form, setForm] = useState<NewCourseInput>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const createCourseMutation = createCourse();
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nameInvalid = touched && !form.name.trim();
  const codeInvalid = touched && !form.code.trim();

  const handleSubmit = () => {
    setLoading(true);
    setTouched(true);
    if (!form.name.trim() || !form.code.trim()) {
      showToast(ToastStates.ERROR, "Please add all the mandatory fields");
      return;
    }
    onCreate({
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
      type: form.type.trim(),
    });

    const payload: CreateCourseRequest = {
      name: form.name.trim(),
      code: form.code.trim(),
      type: form.type.trim(),
      description: form.description.trim(),
    };

    createCourseMutation.mutate(payload, {
      onSuccess: (data) => {
        setLoading(false);
        showToast(ToastStates.SUCCESS, "New course created");
      },
      onError: () => {
        setLoading(false);
        showToast(ToastStates.ERROR, "Error in creating new course");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Course
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 grid place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Course Name <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., B.Tech Computer Science"
              className={`w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none border ${
                nameInvalid ? "border-2 border-rose-300" : "border-transparent"
              }`}
            />
            {nameInvalid && (
              <p className="mt-1 text-xs text-rose-600">
                Course name is required.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Course Code <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g., BTCS"
              className={`w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none border ${
                codeInvalid ? "border-2 border-rose-300" : "border-transparent"
              }`}
            />
            {codeInvalid && (
              <p className="mt-1 text-xs text-rose-600">
                Course code is required.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <input
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              placeholder="e.g., Undergraduate"
              className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none border border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Short description of the course"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none border border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={creating}
            className={`px-5 py-2 rounded-full text-sm font-medium text-white transition ${
              creating
                ? "bg-amber-200 cursor-not-allowed"
                : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            }`}
          >
            {creating ? "Creating…" : "Create New Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
