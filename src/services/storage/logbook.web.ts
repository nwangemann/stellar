import type { Capture, LogbookStore } from './logbook.types';

/** Web is a development preview only, so captures last until reload. */
const captures: Capture[] = [];

export const logbook: LogbookStore = {
  async add(c) {
    captures.unshift(c);
  },
  async list() {
    return [...captures];
  },
};
