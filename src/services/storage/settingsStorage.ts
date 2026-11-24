import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = createMMKV({ id: 'settings' });

export const settingsStorage: StateStorage = {
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => {
    mmkv.remove(key);
  },
};
