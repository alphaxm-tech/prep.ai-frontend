"use client";

import { useState } from "react";
import Card from "../../../components/Card";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useGetUserDetailsAll } from "@/utils/queries/home.queries";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const router = useRouter();

  const {
    data: getUserDetailsAll,
    isLoading,
    isError,
  } = useGetUserDetailsAll();

  const user = getUserDetailsAll?.user;
  const services = getUserDetailsAll?.userServices ?? [];

  const firstName =
    user?.full_name?.split(/[, ]+/)?.filter(Boolean)[0] ?? "there";

  const handleCardClick = (cardTitle: string) => {
    let route;
    if (cardTitle === "Quizzes") route = "quiz";
    else if (cardTitle === "Resume Builder") route = "resume-builder";
    else if (cardTitle === "AI Interviews") route = "ai-interview";
    else if (cardTitle === "Study Materials") route = "study-material";

    if (route) router.push(`/${route}`);
  };

  if (isLoading) {
    return <Loader show={isLoading} message="Loading your profile" />;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* MASTER LAYOUT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= WELCOME ================= */}
        {user && (
          <section className="pt-10 pb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Welcome back, {firstName} 👋
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>
                <strong className="text-gray-700">Email:</strong> {user.email}
              </span>

              <span>
                <strong className="text-gray-700">Location:</strong>{" "}
                {user.location ?? "—"}
              </span>

              <span className="flex items-center gap-1">
                <strong className="text-gray-700">Email:</strong>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <CheckCircleIcon className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <XCircleIcon className="h-4 w-4" />
                    Not verified
                  </span>
                )}
              </span>
            </div>
          </section>
        )}

        {/* ================= HERO ================= */}
        {/* <section className="text-center py-10">
          <h2
            className="text-3xl md:text-4xl font-normal mb-4"
            style={{
              fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
              letterSpacing: "-0.0625rem",
              lineHeight: "1.2",
              color: "#1a1a1a",
            }}
          >
            Empower Your Career with AI
          </h2>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            prep.ai helps students master resumes, mock interviews, and skills —
            using the power of AI to land their dream job faster.
          </p>
        </section> */}

        {/* ================= HERO (ADJUSTED FOR DASHBOARD) ================= */}
        <section className="pt-6 pb-10">
          <h2
            className="text-2xl md:text-3xl font-normal mb-3 text-center"
            style={{
              fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
              letterSpacing: "-0.04rem",
              lineHeight: "1.25",
              color: "#1a1a1a",
            }}
          >
            Empower your career with AI
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto text-center">
            Build resumes, practice interviews, and sharpen skills — faster and
            smarter with prep.ai.
          </p>
        </section>

        {/* ================= ACTION CARDS ================= */}
        <section className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              title="Build Resume"
              description="Create a professional resume with AI assistance"
              variant="yellow"
              onClick={() => handleCardClick("Resume Builder")}
            />
            <Card
              title="Mock Interview"
              description="Practice with AI interviewer"
              variant="green"
              onClick={() => handleCardClick("AI Interviews")}
            />
            <Card
              title="Take Quiz"
              description="Test your knowledge"
              variant="purple"
              onClick={() => handleCardClick("Quizzes")}
            />
            <Card
              title="Study Materials"
              description="Access learning resources"
              variant="blue"
              onClick={() => handleCardClick("Study Materials")}
            />
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="py-12">
          <h3 className="text-2xl font-semibold mb-6">Your Active Services</h3>

          {services.length === 0 ? (
            <p className="text-gray-500">No services assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.college_service_id}
                  className="border rounded-xl p-6 bg-gray-50"
                >
                  <h4 className="text-lg font-semibold mb-1">
                    Service #{service.service_id}
                  </h4>

                  <p className="text-sm text-gray-600 mb-3">{service.notes}</p>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Status:</strong>{" "}
                      {service.is_active ? "Active" : "Inactive"}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(service.start_date).toDateString()}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Configuration</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {Object.entries(service.services_config).map(
                        ([key, value]) => (
                          <li key={key}>
                            {key.replaceAll("_", " ")}:{" "}
                            <strong>{String(value)}</strong>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= FEATURES (UNCHANGED CONTENT, ALIGNED) ================= */}
        <section className="bg-gray-50 py-14 px-6 -mx-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Why Choose prep.ai?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <ClipboardDocumentCheckIcon className="h-10 w-10 mx-auto text-blue-500" />
              <h4 className="mt-4 text-lg font-medium">AI Resume Builder</h4>
              <p className="mt-2 text-gray-600">
                Generate ATS-friendly resumes tailored to your dream job.
              </p>
            </div>

            <div className="text-center">
              <ClockIcon className="h-10 w-10 mx-auto text-green-500" />
              <h4 className="mt-4 text-lg font-medium">Mock Interviews</h4>
              <p className="mt-2 text-gray-600">
                Practice with AI interviewers and get feedback.
              </p>
            </div>

            <div className="text-center">
              <CalendarDaysIcon className="h-10 w-10 mx-auto text-purple-500" />
              <h4 className="mt-4 text-lg font-medium">Skill Quizzes</h4>
              <p className="mt-2 text-gray-600">
                Sharpen your technical and soft skills.
              </p>
            </div>

            <div className="text-center">
              <ArrowTrendingUpIcon className="h-10 w-10 mx-auto text-yellow-500" />
              <h4 className="mt-4 text-lg font-medium">Career Growth</h4>
              <p className="mt-2 text-gray-600">
                Track measurable improvements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
