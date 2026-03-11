import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BackendStage = {
  id: string;
  name: string;
  order?: number;
};

interface StagesState {
  stagesByVacancy: Record<string, BackendStage[]>;
  
  setStages: (vacancyId: string, stages: BackendStage[]) => void;
  getStages: (vacancyId: string) => BackendStage[];
  clearStages: () => void;
}

export const useStagesStore = create<StagesState>()(
  persist(
    (set, get) => ({
      stagesByVacancy: {},

      setStages: (vacancyId, stages) => {
        const sortedStages = [...stages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
      name: 'vacancy-stages-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);