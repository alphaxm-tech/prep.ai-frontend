"use client";

import { usePathname } from "next/navigation";
import { SubHeader } from "./SubHeader";

export default function SubHeaderWrapper({ user }: { user: any }) {
  const pathname = usePathname();

  if (pathname.startsWith("/student/quiz/test/")) return null;

  return <SubHeader user={user} />;
}
