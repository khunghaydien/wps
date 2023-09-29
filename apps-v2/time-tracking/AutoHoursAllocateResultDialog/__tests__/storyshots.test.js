import path from 'path';

import React from 'react';
import ReactDOM from 'react-dom';

import initStoryshots from '@storybook/addon-storyshots';

import { generateAsyncMatchSpecificSnapshotTestOptions } from '../../__tests__/utils/snapshotsUtils';

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

ReactDOM.createPortal = jest.fn((element, _node) => {
  return element;
});

// https://github.com/reactjs/react-transition-group/issues/436#issuecomment-480316125
const mockCSSTransition = ({ children }) =>
  React.createElement(React.Fragment, null, children); // == <>{children}</>
jest.mock('react-transition-group', () => {
  const original = jest.requireActual('react-transition-group');
  return {
    ...original,
    CSSTransition: jest.fn(mockCSSTransition),
  };
});

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
  ...generateAsyncMatchSpecificSnapshotTestOptions(),
});
