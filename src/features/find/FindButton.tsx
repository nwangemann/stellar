import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { aimAt } from '@/core/catalog/aim';
import { createSky } from '@/core/catalog/sky';
import type { SkyObject } from '@/core/catalog/types';
import type { Target } from '@/core/layers/types';
import { useMoment } from '@/features/sky/useMoment';
import { useFind } from '@/state/find';
import { Button } from '@/ui/components/Button';
import { Text } from '@/ui/components/Text';
import { useTheme } from '@/ui/useTheme';

type Found = Pick<Target, 'kind' | 'id' | 'name'>;

/** Leads back to the sky, which turns to the target or, following the phone, shows an arrow. `aim` is from `aimAt`; null disables it. */
export function FindButton({ target, aim }: { target: Found; aim: SkyObject | null }) {
  const router = useRouter();
  const following = useFind((s) => s.following);
  const set = useFind((s) => s.set);
  return (
    <Button
      variant="quiet"
      label="Find in sky"
      accessibilityLabel={`Find ${target.name} in the sky`}
      disabled={!aim}
      onPress={() => {
        if (!aim) return;
        set({
          reached: false,
          wanted: {
            target: { kind: target.kind, id: target.id, name: target.name },
            aimId: aim.id,
            byArrow: following,
          },
        });
        router.dismissTo('/');
      }}
    />
  );
}

/** For a details screen. `at` is the time the sky shows, if not the present. */
export function FindInSky({ target, at }: { target: Found; at?: string }) {
  const t = useTheme();
  const { moment } = useMoment();
  const { kind, id } = target;
  const aim = useMemo(
    () => aimAt({ kind, id }, createSky(moment.observer, at ? new Date(at) : moment.date)),
    [kind, id, moment, at],
  );
  return (
    <View style={{ gap: t.space.sm }}>
      <FindButton target={target} aim={aim} />
      {aim ? null : (
        <Text size="caption" muted style={{ textAlign: 'center' }}>
          Below the horizon
        </Text>
      )}
    </View>
  );
}
