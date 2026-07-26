"use client";

import { useParams } from "next/navigation";
import AssessmentReportSection from "../report/AssessmentReportSection";

export default function AnalyticsPage() {
  const params = useParams<{ "college-id": string }>();
  const collegeId = Number(params["college-id"]);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
            Analytics & Reporting
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Assessment Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Deep-dive performance data across quizzes, AI interviews, and code editor assessments
          </p>
        </div>

        <AssessmentReportSection collegeId={collegeId} />
      </div>
    </div>
  );
}
