import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeStore {
  isDarkMode: boolean;
  toggle: () => void;
}

export const useDarkMode = create<DarkModeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggle: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'dark-mode-storage',
    }
  )
);