import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  setApplication: (application: ApplicationItemDto) => void;
  clearApplication: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      currentApplication: null,

      setApplication: (application) => 
        set({ currentApplication: application }),

      clearApplication: () => 
        set({ currentApplication: null }),
    }),
    {
      name: 'current-application-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);