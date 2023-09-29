// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(),
});

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
});
