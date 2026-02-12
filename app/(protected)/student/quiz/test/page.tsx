// app/(auth)/quiz/test/page.tsx
import { Suspense } from "react";
import QuizTestClient from "@/components/QuizTestClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading quiz…</div>}>
      <QuizTestClient />
    </Suspense>
  );
}
