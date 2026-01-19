"use client";

import { useGetUserDetailsAll } from "@/utils/queries/home.queries";
import Loader from "@/components/Loader";
import { useEffect } from "react";
import { useToast } from "@/components/toast/ToastContext";

export default function AppBootstrap() {
  const { isLoading, isFetching, isError } = useGetUserDetailsAll();
  const { showToast } = useToast();

  // ✅ Hooks must run unconditionally
  useEffect(() => {
    if (isError) {
      showToast(
        "error",
        "Error loading user info, please contact the administrator"
      );
    }
  }, [isError, showToast]);

  /**
   * Render logic comes AFTER hooks
   */
  if (isLoading) {
    return <Loader show message="Preparing resume dashboard.." blurPx={6} />;
  }

  // Optional background refetch loader
  // if (isFetching) {
  //   return (
  //     <Loader
  //       show
  //       message="Syncing your data…"
  //       blurPx={2}
  //     />
  //   );
  // }

  return null;
}
