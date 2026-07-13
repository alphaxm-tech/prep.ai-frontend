"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { StatCard } from "@/components/StatCard";
import AssessmentRow from "@/components/AssessmentRow";
import CompactAssessmentRow from "@/components/CompactAssessmentRow";
import Pagination from "@/components/Pagination";
import EmptyStateCard from "@/components/EmptyStateCard";
import TipsMarquee from "@/components/TipsMarquee";
import InterviewReviewModal from "@/components/InterviewReviewModal";
import { INTERVIEW_TIPS } from "@/constants/interview-tips";
import {
  AI_INTERVIEW_ROUTE,
  AI_INTERVIEW_SESSION,
} from "@/constants/ui-routes";
import { useGetAllAssessments } from "@/server-api/queries/assessment.queries";
import { useGetInterviewStats } from "@/server-api/queries/ai-interview.queries";
import { useStartInterview } from "@/server-api/mutations/ai-interview.mutation";
import {
  ASSESSMENT_TYPES,
  AssessmentResponse,
} from "@/server-api/api/types/assessment.types";
import WorkInProgressBanner from "@/components/WorkInProgressBanner";

const DEFAULT_PAGE_SIZE = 10;

function formatScore(value?: number | null): string {
  return value === null || value === undefined ? "—" : `${Math.round(value)}%`;
}

function formatImprovement(value?: number | null): string {
  if (value === null || value === undefined) return "—";
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

function formatTotalTime(seconds?: number | null): string {
  if (!seconds) return "—";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function AIInterviewPage() {
  const router = useRouter();

  const [notTakenPage, setNotTakenPage] = useState(1);
  const [notTakenPageSize, setNotTakenPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [takenPage, setTakenPage] = useState(1);
  const [takenPageSize, setTakenPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [reviewAssessmentId, setReviewAssessmentId] = useState<number | null>(
    null,
  );

  const { data: untakenAssessments, isLoading: isUntakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.DESCRIPTIVE,
      hasTaken: false,
      pageNo: notTakenPage,
      count: notTakenPageSize,
    });

  const { data: takenAssessments, isLoading: isTakenLoading } =
    useGetAllAssessments({
      assessmentType: ASSESSMENT_TYPES.DESCRIPTIVE,
      hasTaken: true,
      pageNo: takenPage,
      count: takenPageSize,
    });

  const { data: interviewStats } = useGetInterviewStats();

  const startInterviewMutation = useStartInterview();

  const handleStartInterview = (assessment: AssessmentResponse) => {
    startInterviewMutation.mutate(assessment.assessment_id, {
      onSuccess: (data) => {
        const attemptId = data.attempt.AttemptID;
        router.push(
          `${AI_INTERVIEW_ROUTE}${AI_INTERVIEW_SESSION}?attemptId=${attemptId}`,
        );
      },
    });
  };

  const notTakenInterviews = untakenAssessments?.assessments || [];
  const takenInterviews = takenAssessments?.assessments || [];

  const notTakenTotal =
    untakenAssessments?.total_count ?? notTakenInterviews.length;
  const takenTotal = takenAssessments?.total_count ?? takenInterviews.length;
  const totalInterviews = notTakenTotal + takenTotal;

  const isPageLoading =
    isUntakenLoading || isTakenLoading || startInterviewMutation.isPending;

  return (
    <>
      <WorkInProgressBanner />
      <Loader show={isPageLoading} message="Loading your interviews" />
      <InterviewReviewModal
        assessmentId={reviewAssessmentId}
        onClose={() => setReviewAssessmentId(null)}
      />

      <div className="min-h-screen px-4 md:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Smart Interview Coach
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Practice, improve, and ace every interview with AI guidance.
            </p>
          </div>
        </div>

        {/* TOP STAT CARDS */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 gap-6 mb-8">
          <StatCard
            label="Total Interviews Assigned"
            value={totalInterviews}
            variant="blue"
          />
          <StatCard
            label="Interviews Attempted"
            value={takenTotal}
            variant="green"
          />
        </section>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* START INTERVIEW SECTION */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Start Interview</h2>

              {notTakenInterviews.length === 0 ? (
                <EmptyStateCard
                  icon="🎙️"
                  title="No interviews assigned"
                  subtitle="You don't have any AI interviews assigned to your groups right now. Check back once your college assigns one."
                />
              ) : (
                <div className="space-y-4">
                  {notTakenInterviews.map((interview) => (
                    <AssessmentRow
                      key={interview.assessment_id}
                      quiz={interview}
                      index={interview.assessment_id}
                      onStartQuiz={handleStartInterview}
                    />
                  ))}
                  <Pagination
                    page={notTakenPage}
                    pageSize={notTakenPageSize}
                    totalCount={notTakenTotal}
                    onPageChange={setNotTakenPage}
                    onPageSizeChange={(size) => {
                      setNotTakenPageSize(size);
                      setNotTakenPage(1);
                    }}
                  />
                </div>
              )}
            </div>

            {/* ATTEMPTED INTERVIEWS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">
                Attempted Interviews
              </h2>

              {takenInterviews.length === 0 ? (
                <EmptyStateCard
                  icon="🚀"
                  title="No interviews attempted yet"
                  subtitle="Once you complete an AI interview, it will show up here with your score and feedback."
                />
              ) : (
                <div className="space-y-4">
                  {takenInterviews.map((interview) => (
                    <CompactAssessmentRow
                      key={interview.assessment_id}
                      quiz={interview}
                      onReview={(q) => setReviewAssessmentId(q.assessment_id)}
                    />
                  ))}
                  <Pagination
                    page={takenPage}
                    pageSize={takenPageSize}
                    totalCount={takenTotal}
                    onPageChange={setTakenPage}
                    onPageSizeChange={(size) => {
                      setTakenPageSize(size);
                      setTakenPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* PERFORMANCE + TIPS */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold mb-4">Performance</h3>
              {interviewStats && interviewStats.interviews_taken > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Average Score"
                    value={formatScore(interviewStats.average_score)}
                    variant="yellow"
                  />
                  <StatCard
                    label="Interviews Taken"
                    value={interviewStats.interviews_taken}
                    variant="blue"
                  />
                  <StatCard
                    label="Total Time"
                    value={formatTotalTime(interviewStats.total_time_sec)}
                    variant="purple"
                  />
                  <StatCard
                    label="Improvement"
                    value={formatImprovement(interviewStats.improvement_pct)}
                    variant="green"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  Complete your first AI interview to see your performance stats
                  here.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold mb-4">Interview Tips</h3>
              <TipsMarquee tips={INTERVIEW_TIPS} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
