// app/page.tsx

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      {/* ================= HERO SECTION ================= */}
      <section id="home" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT: TEXT CONTENT */}
            <div>
              {/* Badge */}
              <span className="inline-block mb-6 px-4 py-2 text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                Your College’s 24/7 Placement Success Partner
              </span>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                One platform. <br />
                Complete placement success.
              </h1>

              {/* Subtext */}
              <p className="text-lg text-gray-700 max-w-xl mb-10">
                <span className="font-semibold text-black">
                  AI doesn’t just prepare you. It studies you.
                </span>{" "}
                PrepBuddy AI combines interviews, quizzes, and guided learning
                to turn preparation into performance.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition">
                  Get Started
                </button>

                <button className="px-8 py-4 border border-gray-400 rounded-full font-semibold hover:border-black transition">
                  Request Demo
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
                <span>Trusted by colleges & students</span>
                <span>•</span>
                <span>AI + Mentor Driven</span>
              </div>
            </div>

            {/* RIGHT: VISUAL */}
            <div className="relative">
              {/* Background accent */}
              <div className="absolute -top-8 -right-8 w-full h-full bg-yellow-100 rounded-3xl z-0" />

              {/* Image / Mockup container */}
              <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-gray-200 p-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden object-cover transition-transform duration-300 hover:scale-[1.02]">
                  <Image
                    src="/images/landingPageImage.jpg"
                    alt="PrepBuddy AI dashboard preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY PREPBUDDY AI ================= */}
      <section
        id="why-us"
        className="relative px-6 py-28 overflow-hidden bg-gradient-to-r from-gray-50 via-yellow-50/40 to-white"
      >
        {/* Background accent */}
        <div className="absolute -top-24 -left-24 w-[320px] h-[320px] bg-yellow-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <span
              className="inline-block mb-4 px-4 py-1.5 text-sm font-semibold 
        bg-yellow-400 text-black rounded-full shadow-sm"
            >
              Why institutions choose PrepBuddy AI
            </span>

            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Because placements <br />
              <span className="text-yellow-500">shouldn’t rely on chance.</span>
            </h2>

            <p className="text-gray-700 text-lg max-w-xl">
              Traditional placement training is fragmented, manual, and
              impossible to personalize at scale. PrepBuddy AI replaces
              guesswork with an intelligence-driven system that prepares every
              student — consistently, continuously, and measurably.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-300 to-yellow-100 rounded-3xl blur opacity-70" />

            {/* Card */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-yellow-100">
              <ul className="space-y-7">
                {[
                  {
                    title: "Always-On Preparation",
                    desc: "Students practice interviews, quizzes, and resumes anytime, without scheduling constraints.",
                  },
                  {
                    title: "AI That Actually Evaluates",
                    desc: "Real-time feedback on answers, confidence, communication, and delivery, instantly.",
                  },
                  {
                    title: "Personalization at Scale",
                    desc: "Every student gets a unique learning path powered by Gen AI and behavioral insights.",
                  },
                  {
                    title: "Built for Institutions",
                    desc: "10× more cost-effective and infinitely more scalable than traditional coaching models.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="mt-1 w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM OVERVIEW ================= */}
      <section
        id="platform"
        className="relative px-6 py-28 overflow-hidden bg-gradient-to-b from-white via-yellow-50/40 to-white"
      >
        {/* Background accent */}
        <div className="absolute -top-24 right-0 w-[360px] h-[360px] bg-yellow-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          {/* Section label */}
          <span
            className="inline-block mb-4 px-4 py-1.5 text-sm font-semibold 
      bg-yellow-400 text-black rounded-full shadow-sm"
          >
            AI-First Platform
          </span>

          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            A preparation system that <br />
            <span className="text-yellow-500">adapts to every student</span>
          </h2>

          <p className="text-gray-700 text-lg max-w-3xl mb-16">
            PrepBuddy AI is not a collection of tools. It’s an AI-first platform
            that continuously evaluates, guides, and improves students across
            interviews, communication, aptitude, and technical readiness — with
            expert support where it matters most.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "AI-Led Interview Practice",
                desc: "Unlimited mock HR and technical interviews that adapt to each student’s performance.",
              },
              {
                title: "Real-Time Evaluation Engine",
                desc: "Instant feedback on answers, confidence, clarity, voice modulation, and delivery.",
              },
              {
                title: "Adaptive Learning Paths",
                desc: "Personalized preparation journeys powered by Gen AI and behavioral insights.",
              },
              {
                title: "Smart Quizzes & Study Material",
                desc: "Topic-wise quizzes and learning resources aligned to placement requirements.",
              },
              {
                title: "Mentor & Expert Assistance",
                desc: "Human guidance layered on top of AI for interviews, communication, and strategy.",
              },
              {
                title: "Progress & Readiness Dashboard",
                desc: "Clear visibility into performance, gaps, and placement readiness over time.",
              },
            ].map((item) => (
              <div key={item.title} className="relative group">
                {/* Glow */}
                <div
                  className="absolute -inset-0.5 bg-gradient-to-br 
            from-yellow-300 to-yellow-100 rounded-3xl opacity-0 
            group-hover:opacity-100 blur transition"
                />

                {/* Card */}
                <div
                  className="relative rounded-3xl p-8 bg-white 
            border border-gray-100 shadow-lg 
            group-hover:-translate-y-1 transition"
                >
                  {/* Accent dot */}
                  <div
                    className="mb-4 w-10 h-10 bg-yellow-400/20 
              rounded-full flex items-center justify-center"
                  >
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  </div>

                  <h3 className="font-semibold text-xl mb-3 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="relative px-6 py-28 bg-black text-white"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-yellow-900/10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          {/* Section label */}
          <span
            className="inline-block mb-4 px-4 py-1.5 text-sm font-semibold 
      bg-yellow-400 text-black rounded-full"
          >
            What students get
          </span>

          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            One app. <br />
            <span className="text-yellow-400">
              Complete placement execution.
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-3xl mb-16">
            Every tool inside PrepBuddy AI is designed to remove friction from
            placement preparation, replacing scattered effort with intelligent,
            structured execution.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "AI Resume Builder",
                desc: "Generate ATS-optimized resumes that align with roles, companies, and job descriptions.",
              },
              {
                title: "AI-Led Interview Practice",
                desc: "Practice HR and technical interviews that adapt to your responses in real time.",
              },
              {
                title: "Smart Quizzes & Study Material",
                desc: "Targeted quizzes and learning content mapped to placement and role requirements.",
              },
              {
                title: "AI-Powered Code Editor",
                desc: "Write, run, and debug code in a real interview-like editor with instant feedback, hints, and performance insights.",
              },

              {
                title: "Personalized Progress Dashboard",
                desc: "Track readiness, improvement, and gaps with clear performance signals.",
              },
              {
                title: "Mentor-Guided Technical Training",
                desc: "AI-led learning paths supported by experienced mentors and instructors for role-specific preparation and guidance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
            relative rounded-2xl p-7
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:border-yellow-400/30
            transition-all duration-300
          "
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-transparent opacity-60 rounded-t-2xl" />

                <h3 className="font-semibold text-lg mb-2 text-yellow-400">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER ================= */}
      <section
        id="founder"
        className="relative px-6 py-36 bg-white overflow-hidden"
      >
        {/* Side accent with gradient */}
        <div className="absolute top-0 left-0 h-full w-[140px] bg-gradient-to-b from-yellow-400/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          {/* LEFT: Vision */}
          <div>
            <span
              className="inline-block mb-5 px-4 py-1.5 text-sm font-semibold 
        bg-yellow-400 text-black rounded-full"
            >
              Founder & Vision
            </span>

            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Built with intent. <br />
              Driven by <span className="text-yellow-500">outcomes.</span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
              PrepBuddy AI was founded on a simple but often ignored truth,
              students don’t fail interviews because they lack ability. They
              fail because preparation is unstructured, feedback is delayed, and
              confidence is left to chance.
            </p>

            <p className="mt-5 text-gray-700 leading-relaxed max-w-xl">
              The vision was clear: replace fragmented coaching with an
              intelligent, measurable, and scalable system that prepares
              students the way hiring actually works.
            </p>
          </div>

          {/* RIGHT: Founder Card */}
          <div className="relative group">
            {/* Offset frame */}
            <div
              className="absolute -top-6 -left-6 w-full h-full 
        border-2 border-yellow-400 rounded-3xl
        group-hover:-top-4 group-hover:-left-4 transition-all duration-300"
            />

            {/* Card */}
            <div
              className="relative bg-white rounded-3xl p-10 transition-transform duration-300 group-hover:-translate-y-1"
              style={{
                boxShadow:
                  "0 24px 48px rgba(250, 204, 21, 0.25), 0 10px 20px rgba(0, 0, 0, 0.06)",
              }}
            >
              <h3 className="text-2xl font-semibold mb-1">
                Dr. Vaishnavi Madhuvarsu
              </h3>

              <p className="font-medium text-gray-700 mb-4">
                PhD (Marketing) • LLB • MBA <br />
                Founder & CEO – PrepBuddy AI
              </p>

              <p className="text-sm text-gray-600 mb-6">
                Ex–Indian School of Business (ISB) • Wharton • Standard
                Chartered Bank
              </p>

              <p className="text-gray-700 leading-relaxed mb-8">
                A Hyderabad-based educator, marketer, and entrepreneur, Dr.
                Vaishnavi brings together academic rigor, corporate experience,
                and a deep understanding of student challenges to build India’s
                most advanced AI-powered placement and personality development
                platform.
              </p>

              {/* Quote */}
              <div className="pt-6 border-t border-gray-200">
                <p className="italic text-yellow-600 font-semibold leading-relaxed">
                  “Aim high — not so the world can see you, but so you can see
                  the world.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        id="contact"
        className="relative px-6 py-32 bg-black text-white overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-yellow-900/20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Section kicker */}
          <span
            className="inline-block mb-5 px-4 py-1.5 text-sm font-semibold 
      bg-yellow-400 text-black rounded-full"
          >
            Get started
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            The future of placements <br />
            is <span className="text-yellow-400">adaptive.</span>
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
            Move beyond one-size-fits-all training. Give your students an AI-led
            preparation system that adapts, guides, and delivers measurable
            outcomes.
          </p>

          <button
            className="
        px-12 py-4 bg-yellow-400 text-black font-semibold rounded-xl
        shadow-lg hover:shadow-xl hover:bg-yellow-300
        transition-all
      "
          >
            Talk to Us
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-8 border-t bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <p className="font-bold">PrepBuddy AI</p>
          <p className="text-gray-600">Contact: vm.prepbuddy@gmail.com</p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PrepBuddy AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
