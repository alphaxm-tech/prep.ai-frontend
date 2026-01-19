import { useQuery } from "@tanstack/react-query";
import { GetUserDetailsAlldResponse } from "../api/types/home.types";
import { homeService } from "../services/home.service";

export const useGetUserDetailsAll = () => {
  return useQuery<GetUserDetailsAlldResponse>({
    queryKey: ["home", "get-user-details-all"],
    queryFn: homeService.getUserDetailsAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (v5)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
