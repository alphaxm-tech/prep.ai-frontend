"use client";

import { useRouter } from "next/navigation";

export default function PlatformLandingPage() {
  const router = useRouter();

  const stats = [
    { label: "Total Colleges", value: "128" },
    { label: "Active Students", value: "18,420" },
    { label: "Admins", value: "312" },
    { label: "Placements Processed", value: "9,870" },
  ];

  const modules = [
    {
      title: "College Management",
      desc: "Onboard, monitor and configure institutions across the platform.",
      icon: "🏫",
    },
    {
      title: "Role & Access Control",
      desc: "Define permissions for admins, placement officers, and students.",
      icon: "🔐",
    },
    {
      title: "Global Analytics",
      desc: "Track platform-wide trends, engagement metrics and placement ratios.",
      icon: "📊",
    },
    {
      title: "AI Configuration",
      desc: "Tune resume scoring logic, AI models and automation workflows.",
      icon: "🤖",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 text-gray-900">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          PrepBuddy AI
          <span className="text-yellow-600"> Platform Control</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Centralized control and intelligence layer for managing colleges,
          placements, AI models, and system-wide performance.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push("/platform/dashboard")}
            className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition"
          >
            Enter Platform
          </button>

          <button
            onClick={() => router.push("/admin")}
            className="px-8 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-semibold"
          >
            Admin Panel
          </button>
        </div>
      </section>

      {/* GLOBAL STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <h3 className="text-3xl font-extrabold text-yellow-600">
              {stat.value}
            </h3>
            <p className="text-gray-600 mt-2 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* PLATFORM MODULES */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        {modules.map((module, index) => (
          <div
            key={index}
            className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="text-4xl mb-4">{module.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
            <p className="text-gray-600 text-sm">{module.desc}</p>
          </div>
        ))}
      </section>

      {/* SYSTEM INSIGHT SECTION */}
      <section className="bg-yellow-100/60 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Platform Intelligence Overview
          </h2>

          <p className="max-w-3xl mx-auto text-gray-700 mb-12">
            Real-time AI-driven insights across institutions. Monitor placement
            trends, student readiness levels, and recruiter engagement metrics
            in one unified dashboard.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Offer Ratio", value: "78%" },
              { title: "Resume Quality Score", value: "8.4/10" },
              { title: "AI Shortlist Accuracy", value: "92%" },
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-yellow-600">
                  {metric.value}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{metric.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Take Full Control of the Platform
        </h2>
        <p className="max-w-2xl mx-auto text-yellow-100">
          Manage institutions, optimize AI, and scale placements with a
          centralized control system.
        </p>

        <button
          onClick={() => router.push("/platform/dashboard")}
          className="mt-8 px-8 py-3 rounded-full bg-white text-yellow-600 font-semibold shadow-md hover:scale-105 transition"
        >
          Launch Control Panel
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} PrepBuddy AI · Platform Governance System
      </footer>
    </div>
  );
}
