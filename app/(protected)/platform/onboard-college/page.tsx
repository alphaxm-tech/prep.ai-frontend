"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLLEGE, ONBOARD_COLLEGE, PLATFORM_ROUTE } from "@/constants/ui-routes";

export default function OnboardCollegePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${PLATFORM_ROUTE}${ONBOARD_COLLEGE}${COLLEGE}`);
  }, [router]);

  return null;
}
