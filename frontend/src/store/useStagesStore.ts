import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StageType } from "@/api/stage/model/types";

interface StagesState {
  stagesByVacancy: Record<string, StageType[]>;

  setStages: (vacancyId: string, stages: StageType[]) => void;
  getStages: (vacancyId: string) => StageType[];
  clearStages: () => void;
}

export const useStagesStore = create<StagesState>()(
  persist(
    (set, get) => ({
      stagesByVacancy: {},

      setStages: (vacancyId, stages) => {
        const sortedStages = [...stages].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0),
        );
        set((state) => ({
          stagesByVacancy: {
            ...state.stagesByVacancy,
            [vacancyId]: sortedStages,
          },
        }));
      },

      getStages: (vacancyId) => {
        return get().stagesByVacancy[vacancyId] || [];
      },

      clearStages: () => set({ stagesByVacancy: {} }),
    }),
    {
      name: "vacancy-stages-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
