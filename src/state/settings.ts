import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ModeId } from '@/core/layers/types';
import type { SkinId } from '@/ui/tokens/tokens';
import { settingsStorage } from '@/services/storage/settingsStorage';

interface Settings {
  mode: ModeId;
  nightMode: boolean;
  /** The look of the interface. Night vision overrides it while on. */
  skin: SkinId;
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
      skin: 'default',
      onboarded: false,
      cameraBackdrop: false,
      set: (patch) => set(patch),
    }),
    { name: 'settings', storage: createJSONStorage(() => settingsStorage) },
  ),
);
