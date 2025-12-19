// app/(your-route)/add-college/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type CreateCollegePayload = {
  name: string;
  code: string;
  website?: string;
  contactEmail?: string;
  contactNumber?: string;
  address?: string;
  subscription?: string;
  active?: boolean;
};

export default function AddCollegePage() {
  const router = useRouter();

  const [collegeName, setCollegeName] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [subscription, setSubscription] = useState("Standard");
  const [active, setActive] = useState(true);

  // validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const isNameInvalid = touched.collegeName && collegeName.trim() === "";
  const isCodeInvalid = touched.collegeCode && collegeCode.trim() === "";

  const formIsValid = collegeName.trim() !== "" && collegeCode.trim() !== "";

  const handleBlur = (field: string) => {
    setTouched((s) => ({ ...s, [field]: true }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // mark fields touched so errors display
    setTouched({ collegeName: true, collegeCode: true });

    if (!formIsValid) {
      setFormMessage({ type: "error", text: "Please fill required fields." });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    const payload: CreateCollegePayload = {
      name: collegeName.trim(),
      code: collegeCode.trim(),
      website: website.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      contactNumber: contactNumber.trim() || undefined,
      address: address.trim() || undefined,
      subscription: subscription || undefined,
      active,
    };

    try {
      // Example save - replace endpoint with your real API
      const res = await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      await res.json().catch(() => ({}));
      setFormMessage({
        type: "success",
        text: "College created. Redirecting...",
      });

      // small pause so user sees success message
      setTimeout(() => {
        // navigate to next step — branches page (change as required)
        router.push("/colleges/branches");
      }, 700);
    } catch (err: any) {
      console.error("Create college error:", err);
      setFormMessage({
        type: "error",
        text: err?.message || "Failed to create college. Try again.",
      });
      setSubmitting(false);
    }
  };

  const handleCollegeCreation = () => {
    router.push("/admin/add-college/course");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New College
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete all steps to register a new college
          </p>

          {/* modern stepper */}
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

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500">
                  2
                </span>
                <div className="text-xs">Branches</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500">
                  3
                </span>
                <div className="text-xs">Groups</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-100 grid place-items-center text-gray-500">
                  4
                </span>
                <div className="text-xs">Students</div>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white ring-1 ring-gray-100 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column: form */}
              <div className="space-y-6">
                {/* Name + Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      College Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      onBlur={() => handleBlur("collegeName")}
                      placeholder="IIT Bombay"
                      className={`mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none focus:shadow-outline ${
                        isNameInvalid
                          ? "border-2 border-rose-300 focus:border-rose-400"
                          : "border border-transparent"
                      }`}
                    />
                    {isNameInvalid && (
                      <p className="mt-2 text-xs text-rose-600">
                        College name is required.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      College Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={collegeCode}
                      onChange={(e) => setCollegeCode(e.target.value)}
                      onBlur={() => handleBlur("collegeCode")}
                      placeholder="IITB"
                      className={`mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm transition focus:outline-none focus:shadow-outline ${
                        isCodeInvalid
                          ? "border-2 border-rose-300 focus:border-rose-400"
                          : "border border-transparent"
                      }`}
                    />
                    {isCodeInvalid && (
                      <p className="mt-2 text-xs text-rose-600">
                        College code is required.
                      </p>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://iitb.ac.in"
                    className="mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm border border-transparent focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="admin@iitb.ac.in"
                      className="mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm border border-transparent focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 22 2576 4545"
                      className="mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm border border-transparent focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Powai, Mumbai, Maharashtra 400076"
                    className="mt-2 w-full px-4 py-3 rounded-xl text-sm bg-gray-50 placeholder-gray-400 shadow-sm border border-transparent focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      /* cancel/go back */ router.push("/colleges");
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!formIsValid || submitting}
                    className={`px-6 py-3 rounded-full font-semibold text-white shadow-md transition ${
                      !formIsValid || submitting
                        ? "bg-amber-200 cursor-not-allowed"
                        : "bg-gradient-to-tr from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    }`}
                    onClick={handleCollegeCreation}
                  >
                    {submitting ? "Creating..." : "Next"}
                  </button>
                </div>

                {/* message */}
                {formMessage && (
                  <div
                    className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                      formMessage.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-rose-50 text-rose-800"
                    }`}
                  >
                    {formMessage.text}
                  </div>
                )}
              </div>

              {/* Right column: summary card */}
              <aside className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-tr from-white to-gray-50 border border-gray-50 shadow-sm">
                  <div className="text-sm text-gray-500">Subscription</div>
                  <div className="mt-3">
                    <select
                      value={subscription}
                      onChange={(e) => setSubscription(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm bg-white border border-gray-100 focus:outline-none"
                    >
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-gray-50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Active status</div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {active ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setActive((s) => !s)}
                        aria-pressed={active}
                        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors focus:outline-none ${
                          active ? "bg-amber-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-sm transition-transform ${
                            active ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Toggle whether this college should be active in the system.
                    You can change this later.
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-gray-50 shadow-sm text-sm text-gray-600">
                  <div className="font-medium text-gray-900">Quick tips</div>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>College name and code are required.</li>
                    <li>Use the official website link for verification.</li>
                    <li>Contact email helps with administrative access.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
