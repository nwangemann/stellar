import { Redirect } from 'expo-router';
import { SkyScreen } from '@/features/sky/SkyScreen';
import { useSettings } from '@/state/settings';

export default function Index() {
  return useSettings((s) => s.onboarded) ? <SkyScreen /> : <Redirect href="/onboarding" />;
}
