import { useQuery } from "@tanstack/react-query";
import { GetUserDetailsAlldResponse } from "../api/types/home.types";
import { homeService } from "../services/home.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["me", "home"],
    queryFn: homeService.getMeDetails,
  });
};
