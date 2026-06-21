import { cache } from "react";
import { cookies } from "next/headers";
import { BASE_API_URL, HOME, ME } from "@/utils/api/endpoints";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${BASE_API_URL}/${HOME}/${ME}`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
});
