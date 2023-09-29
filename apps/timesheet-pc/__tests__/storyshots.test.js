// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

jest.mock('uuid/v1', () => () => '#uuid/v1()');

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
});
