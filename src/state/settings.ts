import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ModeId } from '@/core/layers/types';
import { settingsStorage } from '@/services/storage/settingsStorage';

interface Settings {
  mode: ModeId;
  nightMode: boolean;
  onboarded: boolean;
  /** Show the camera behind the overlay. Off means the simulated dark sky. */
  cameraBackdrop: boolean;
  set: (patch: Partial<Omit<Settings, 'set'>>) => void;
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      mode: 'identify',
      nightMode: false,
      onboarded: false,
      cameraBackdrop: false,
      set: (patch) => set(patch),
    }),
    { name: 'settings', storage: createJSONStorage(() => settingsStorage) },
  ),
);
