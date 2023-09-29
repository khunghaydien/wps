// @flow

import path from 'path';

import ReactDOM from 'react-dom';

import initStoryshots from '@storybook/addon-storyshots';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../__tests__/utils/snapshotsUtils';

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

ReactDOM.createPortal = jest.fn((element, _node) => {
  return element;
});

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
