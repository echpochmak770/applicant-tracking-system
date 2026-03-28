import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ColumnFilter } from "@/api/types";

export type VacancyStatus = "Open" | "Draft" | "Paused" | "Closed";

export type VacancyItemDto = {
  id: string;
  title: string;
  description: string;
  status: VacancyStatus;
  createdAt: string;
};

interface VacancyFilters {
  page: number;
  pageSize: number;
  columnFilters: ColumnFilter[];
}

interface VacancyState {
  currentVacancy: VacancyItemDto | null;
  filters: VacancyFilters;
  setCurrentVacancy: (vacancy: VacancyItemDto | null) => void;
  setFilters: (filters: Partial<VacancyFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: VacancyFilters = {
  page: 1,
  pageSize: 10,
  columnFilters: [],
};

export const useVacancyStore = create<VacancyState>()(
  persist(
    (set) => ({
      currentVacancy: null,
      filters: initialFilters,

      setCurrentVacancy: (vacancy) => set({ currentVacancy: vacancy }),

      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),

      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: 'vacancy-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);