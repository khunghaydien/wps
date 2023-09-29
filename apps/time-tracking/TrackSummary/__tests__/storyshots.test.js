// @flow

import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../__tests__/utils/snapshotsUtils';

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
