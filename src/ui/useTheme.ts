import { useSettings } from '@/state/settings';
import { themes, type Theme } from './tokens/tokens';

export const useTheme = (): Theme =>
  useSettings((s) => (s.nightMode ? themes.night : themes.standard));
