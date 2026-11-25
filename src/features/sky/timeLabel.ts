/** Day and time in the device's time zone. */
export const timeLabel = (date: Date): string =>
  date.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
