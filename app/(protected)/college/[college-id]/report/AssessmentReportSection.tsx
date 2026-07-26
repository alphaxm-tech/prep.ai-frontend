"use client";

import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  useAssessmentsForReport,
  useAssessmentReport,
} from "@/server-api/queries/assessment-report.queries";
import { assessmentReportService } from "@/server-api/services/assessment-report.service";
import { ASSESSMENT_TYPES } from "@/server-api/api/types/assessment.types";

const TYPE_OPTIONS = [
  { value: ASSESSMENT_TYPES.MCQ, label: "Quiz" },
  { value: ASSESSMENT_TYPES.DESCRIPTIVE, label: "AI Interview" },
  { value: ASSESSMENT_TYPES.CODING, label: "Code Editor" },
];

export default function AssessmentReportSection({
  collegeId,
}: {
  collegeId: number;
}) {
  const [assessmentType, setAssessmentType] = useState<string>(
    ASSESSMENT_TYPES.MCQ,
  );
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: assessments = [], isLoading: loadingAssessments } =
    useAssessmentsForReport(collegeId, assessmentType);

  const { data: report, isLoading: loadingReport } = useAssessmentReport(
    collegeId,
    assessmentId,
  );

  const hasAssessments = assessments.length > 0;

  const handleTypeChange = (type: string) => {
    setAssessmentType(type);
    setAssessmentId(null);
  };

  const handleExport = async () => {
    if (!assessmentId || !report) return;
    setExporting(true);
    try {
      await assessmentReportService.exportAssessmentReport(
        collegeId,
        assessmentId,
        `${report.title}-report.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  };

  const summaryCards = useMemo(() => {
    if (!report) return [];
    return [
      {
        label: "Total Eligible",
        value: report.summary.total_eligible,
        color: "text-gray-700",
        bg: "bg-gray-50 border-gray-200",
      },
      {
        label: "Attempted",
        value: report.summary.attempted_count,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-100",
      },
      {
        label: "Not Attempted",
        value: report.summary.not_attempted_count,
        color: "text-rose-600",
        bg: "bg-rose-50 border-rose-100",
      },
      {
        label: "Avg Score",
        value: Math.round(report.summary.avg_score),
        color: "text-yellow-700",
        bg: "bg-yellow-50 border-yellow-100",
      },
    ];
  }, [report]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Assessment Type
          </label>
          <select
            value={assessmentType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Assessment
          </label>
          <select
            value={assessmentId ?? ""}
            onChange={(e) => setAssessmentId(Number(e.target.value) || null)}
            disabled={loadingAssessments || !hasAssessments}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            <option value="">
              {loadingAssessments
                ? "Loading..."
                : hasAssessments
                  ? "Select an assessment"
                  : "No assessments found"}
            </option>
            {assessments.map((a) => (
              <option key={a.assessment_id} value={a.assessment_id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!assessmentId && (
        <div className="py-16 text-center text-gray-400 text-sm">
          Select an assessment to view its report
        </div>
      )}

      {assessmentId && loadingReport && (
        <div className="py-16 text-center text-gray-400 text-sm">
          Loading report...
        </div>
      )}

      {assessmentId && report && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {report.title}
            </h3>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-yellow-900 font-semibold text-sm rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export to Excel"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {summaryCards.map((s) => (
              <div
                key={s.label}
                className={`bg-white rounded-2xl p-4 border ${s.bg} shadow-sm text-center`}
              >
                <p className="text-xs text-gray-500 font-medium mb-1">
                  {s.label}
                </p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Attempted Students ({report.attempted.length})
            </h4>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Student", "Score", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.attempted.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-gray-400 text-sm"
                      >
                        No students have attempted this assessment yet
                      </td>
                    </tr>
                  ) : (
                    report.attempted.map((s) => (
                      <tr
                        key={s.user_id}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-gray-900">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-gray-700">
                          {s.total_score}/{s.max_score}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">
                          {new Date(s.started_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Not Attempted ({report.not_attempted.length})
            </h4>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {report.not_attempted.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                  All eligible students have attempted this assessment
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Student", "Roll Number"].map((h) => (
                        <th
                          key={h}
                          className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.not_attempted.map((s) => (
                      <tr
                        key={s.user_id}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-gray-900">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-500">
                          {s.roll_number}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
