import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';

jest.mock('uuid/v1', () => () => '#uuid/v1()');
jest.mock('nanoid', () => () => 1);
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: jest.fn((element, _node) => element),
  };
});

initStoryshots({
  configPath: path.resolve(__dirname, 'config.js'),
});
