import React, { FC } from 'react';

import { withInfo } from '@storybook/addon-info';
import { number, object, text, withKnobs } from '@storybook/addon-knobs';

import DraggableResizable from '../components/DraggableResizable';

interface FCStory extends FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'commons',
  decorators: [withKnobs, withInfo],
};

export const _DraggableResizable: FCStory = () => (
  <DraggableResizable
    bounds={text('bounds', 'window')}
    maxHeight={number('maxHeight', 700)}
    maxWidth={number('maxWidth', 1000)}
    minHeight={number('minHeight', 200)}
    minWidth={number('minWidth', 200)}
    default={object('defaultProperty', {
      width: 300,
      height: 300,
      x: 0,
      y: 0,
    })}
  >
    Drag and resize
  </DraggableResizable>
);

_DraggableResizable.storyName = 'DraggableResizable';
_DraggableResizable.parameters = {
  info: {
    text: `
      # Description
      Drag and resize
      More detailed props refer to react-rnd

      # Propsについて
      bounds: boundary for drag area
      maxHeight: max height for resize
      minHeight: min height for resize
      default: default size and position
    `,
  },
};
