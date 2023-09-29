// @flow

import path from 'path';

import ReactDOM from 'react-dom';

import initStoryshots from '@storybook/addon-storyshots';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../__tests__/utils/snapshotsUtils';

ReactDOM.createPortal = jest.fn((element, _node) => {
  return element;
});

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
