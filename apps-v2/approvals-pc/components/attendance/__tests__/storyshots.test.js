import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

jest.mock('uuid/v1', () => () => '#uuid/v1()');

jest.mock('shortid', () => ({ generate: () => '#shortid.generate()' }));

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

initStoryshots({
  configPath: path.resolve(__dirname, '.storybook'),
});
