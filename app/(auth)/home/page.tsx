"use client";

import { useState } from "react";
import Card from "../../../components/Card";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import EmailVerifyBanner from "@/components/EmailVerificationbanner";

export default function Dashboard() {
  const router = useRouter();
  const stats = [
    {
      label: "Days Active",
      value: "15",
      icon: <CalendarDaysIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Quizzes Completed",
      value: "8",
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Study Hours",
      value: "24",
      icon: <ClockIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Improvement",
      value: "85%",
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-500" />,
    },
  ];

  const handleCardClick = (cardTitle: string) => {
    console.log(cardTitle);
    let route;
    if (cardTitle === "Home") {
      route = "home";
    } else if (cardTitle === "Quizzes") {
      route = "quiz";
    } else if (cardTitle === "Resume Builder") {
      route = "resume-builder";
    } else if (cardTitle === "AI Interviews") {
      route = "ai-interview";
    } else if (cardTitle === "Study Materials") {
      route = "study-material";
    }
    router.push(`/${route}`);
  };

  const [visible, setVisible] = useState(true);
  const email = "user@example.com";

  async function resendVerification() {
    // call your API to send/resend verification token
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      credentials: "include", // if your API uses cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.error || "Failed to resend verification");
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <EmailVerifyBanner
        visible={visible}
        email={email}
        onVerify={async () => {
          await resendVerification();
          // optionally hide banner or show toast
          setVisible(true);
        }}
        onDismiss={() => setVisible(false)}
      />
      <section className="text-center py-12 px-4">
        <h2
          className="text-3xl md:text-4xl font-normal mb-4"
          style={{
            fontFamily: 'Means Web, Georgia, Times, "Times New Roman", serif',
            WebkitFontVariantLigatures: "none",
            fontVariantLigatures: "none",
            letterSpacing: "-0.0625rem",
            lineHeight: "1.2",
            color: "#1a1a1a", // Adjust to match --heading-color or theme
          }}
        >
          Empower Your Career with AI
        </h2>

        <p
          className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6"
          style={{
            color: "#1a1a1a", // Adjust to match --heading-color or theme
          }}
        >
          prep.ai helps students master resumes, mock interviews, and skills —
          using the power of AI to land their dream job faster.
        </p>
      </section>

      {/* Dashboard Content */}
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        {/* Features Section */}
        <section className="bg-gray-50 py-12 px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-900">
            Why Choose prep.ai?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <ClipboardDocumentCheckIcon className="h-10 w-10 mx-auto text-blue-500" />
              <h4 className="mt-4 text-lg font-medium">AI Resume Builder</h4>
              <p className="mt-2 text-gray-600">
                Generate ATS-friendly resumes tailored to your dream job in
                minutes.
              </p>
            </div>
            <div className="text-center">
              <ClockIcon className="h-10 w-10 mx-auto text-green-500" />
              <h4 className="mt-4 text-lg font-medium">Mock Interviews</h4>
              <p className="mt-2 text-gray-600">
                Practice with AI interviewers and get instant feedback.
              </p>
            </div>
            <div className="text-center">
              <CalendarDaysIcon className="h-10 w-10 mx-auto text-purple-500" />
              <h4 className="mt-4 text-lg font-medium">Skill Quizzes</h4>
              <p className="mt-2 text-gray-600">
                Sharpen your technical and soft skills with quick quizzes.
              </p>
            </div>
            <div className="text-center">
              <ArrowTrendingUpIcon className="h-10 w-10 mx-auto text-yellow-500" />
              <h4 className="mt-4 text-lg font-medium">Career Growth</h4>
              <p className="mt-2 text-gray-600">
                Track your progress and see measurable improvements over time.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-gray-900">
            What Students Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 border rounded-xl shadow-sm bg-gray-50">
              <p className="text-gray-700">
                “prep.ai helped me create a professional resume in under 10
                minutes. I landed 3 interviews in a week!”
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                — Anjali, Computer Science Student
              </p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-gray-50">
              <p className="text-gray-700">
                “The AI mock interview gave me real-time feedback. I felt more
                confident in my actual campus placement interview.”
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                — Rahul, Engineering Graduate
              </p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-gray-50">
              <p className="text-gray-700">
                “Skill quizzes kept me motivated and showed me exactly where I
                needed to improve.”
              </p>
              <p className="mt-4 font-semibold text-gray-900">
                — Meera, MBA Student
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-yellow-500 text-center py-16 px-6 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h3>
          <p className="text-lg mb-8">
            Join thousands of students using prep.ai to build careers faster
            with AI.
          </p>
          <button
            onClick={() => handleCardClick("Resume Builder")}
            className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Now
          </button>
        </section>
      </main>
    </div>
  );
}
