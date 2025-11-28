// app/(auth)/ai-interview/interview/page.tsx
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// dynamically import the client component so it only loads on the client
const InterviewClient = dynamic(
  () => import("../../../../components/InterviewClient"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <React.Fragment>
      {/* Suspense fallback ensures Next knows there is a client component here */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading interview...
          </div>
        }
      >
        <InterviewClient />
      </Suspense>
    </React.Fragment>
  );
}
