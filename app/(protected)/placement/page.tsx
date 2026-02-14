"use client";

import { useRouter } from "next/navigation";

export default function PlacementLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 text-gray-900">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          AI-Powered
          <span className="text-yellow-600"> Placement Automation</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Automate student screening, resume evaluation, company shortlisting,
          and placement workflows using intelligent AI-driven systems.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => router.push("/student")}
            className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/admin")}
            className="px-8 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-semibold"
          >
            Admin Access
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        {[
          {
            title: "Smart Resume Screening",
            desc: "Automatically rank resumes using AI scoring based on job requirements.",
            icon: "🤖",
          },
          {
            title: "Automated Shortlisting",
            desc: "Generate company-specific shortlists within seconds.",
            icon: "⚡",
          },
          {
            title: "Placement Analytics",
            desc: "Track placement trends, offer ratios, and student readiness insights.",
            icon: "📊",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-yellow-100/60 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            How Placement Automation Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Student uploads resume",
              "AI evaluates skills & gaps",
              "System matches company criteria",
              "Shortlist generated instantly",
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-3 gap-8 text-center">
        {[
          { value: "95%", label: "Faster Screening" },
          { value: "3x", label: "Improved Shortlisting Speed" },
          { value: "1000+", label: "Students Processed" },
        ].map((stat, index) => (
          <div key={index}>
            <h3 className="text-4xl font-extrabold text-yellow-600">
              {stat.value}
            </h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Transform Your Placement Process
        </h2>
        <p className="max-w-2xl mx-auto text-yellow-100">
          Reduce manual work, increase placement accuracy, and empower your
          institution with AI automation.
        </p>

        <button
          onClick={() => router.push("/placement")}
          className="mt-8 px-8 py-3 rounded-full bg-white text-yellow-600 font-semibold shadow-md hover:scale-105 transition"
        >
          Explore Platform
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} PrepBuddy AI · Placement Automation System
      </footer>
    </div>
  );
}
