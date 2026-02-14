"use client";

import { QUERY_DEFAULTS } from "@/lib/queryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, createContext } from "react";

type User = {
  id: number;
  email: string;
  role: "student" | "admin";
};

type ProvidersProps = {
  children: ReactNode;
  user: User;
};

export const AuthContext = createContext<any | null>(null);

export function Providers({ children, user }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: QUERY_DEFAULTS,
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
}
