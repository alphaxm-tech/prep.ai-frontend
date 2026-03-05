"use client";

import { usePathname } from "next/navigation";
import { SubHeader } from "./SubHeader";

export default function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSubHeader = pathname.startsWith("/student/quiz/test/");

  return (
    <>
      {!hideSubHeader && <SubHeader user="" />}
      {children}
    </>
  );
}
