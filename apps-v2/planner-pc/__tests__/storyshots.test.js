// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../../__tests__/snapShotUtils';

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
