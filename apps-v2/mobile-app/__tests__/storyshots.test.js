import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

jest.mock('uuid/v1', () => () => '#uuid/v1()');
jest.mock('uuid/v4', () => () => '#uuid/v4()');

let mockCounterNanoid = 0;
jest.mock('nanoid', () => () => (mockCounterNanoid++).toString());
beforeEach(() => (mockCounterNanoid = 0));

jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: jest.fn((element, _node) => element),
  };
});

jest.mock('react-transition-group', () => {
  const original = jest.requireActual('react-transition-group');
  return {
    ...original,
    CSSTransition: ({ children }) => children,
  };
});

jest.mock('@salesforce/design-system-react');

Date.now = () => new Date(2022, 1, 22, 0, 0, 0, 0).valueOf();

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
});
