import { useSettings } from '@/state/settings';
import { themeForSkin, themes, type Theme } from './tokens/tokens';

/** Night vision wins over the chosen look, because it protects dark adaptation. */
export const useTheme = (): Theme =>
  useSettings((s) => (s.nightMode ? themes.night : themeForSkin(s.skin)));
