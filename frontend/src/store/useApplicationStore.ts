import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type ApplicationFilters } from '@/api/types';

export type ApplicationItemDto = {
  id: string;
  candidateFullName: string;
  email: string;
  phone: string;
  currentStageName: string;
  creatorFullName: string;
  resumeFileUrl: string;
  resumeName: string;
};

interface ApplicationState {
  currentApplication: ApplicationItemDto | null;
  filters: ApplicationFilters;
  setApplication: (application: ApplicationItemDto) => void;
  clearApplication: () => void;
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: ApplicationFilters = {
  page: 1,
  pageSize: 10,
  columnFilters: []
};

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      currentApplication: null,
      filters: initialFilters,

      setApplication: (application) => 
        set({ currentApplication: application }),

      clearApplication: () => 
        set({ currentApplication: null }),

      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),
      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: 'current-application-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);