import { useQuery } from "@tanstack/react-query";
import { superAdminService } from "@/server-api/services/super-admin.service";
import { GetAllCoursesResponse } from "@/server-api/api/types/super-admin.types";
import { ccgService } from "../services/ccg.service";

// export const useGetAllCourses = () => {
//   // return useQuery<GetAllCoursesResponse>({
//   //   queryKey: ["super-admin", "courses"],
//   //   queryFn: ccgService.getAllCourses,
//   });
// };
