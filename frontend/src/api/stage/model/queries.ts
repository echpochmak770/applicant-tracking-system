import { useQuery } from "@tanstack/react-query";
import { stageActions } from "../action/stage";

export const useVacancyStagesQuery = (vacancyId: string) => {
  return useQuery({
    queryKey: ["vacancy-stages", vacancyId],
    queryFn: () => {
      return stageActions.allStages(vacancyId);
    },
    enabled: !!vacancyId,
  });
};
