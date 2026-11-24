import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from './Button';

jest.mock('@/services/storage/settingsStorage', () => ({
  settingsStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
}));

test('a disabled button does not fire', async () => {
  const onPress = jest.fn();
  await render(<Button label="Capture" disabled onPress={onPress} />);
  await fireEvent.press(screen.getByText('Capture'));
  expect(onPress).not.toHaveBeenCalled();
});
test('an enabled button fires', async () => {
  const onPress = jest.fn();
  await render(<Button label="Capture" onPress={onPress} />);
  await fireEvent.press(screen.getByText('Capture'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
