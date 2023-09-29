import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import PrevButton from '../../../../components/molecules/commons/Buttons/PrevButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Buttons',
  decorators: [withKnobs, withInfo],
};

export const _PrevButton: FCStory = () => (
  <PrevButton
    testId={text('testId', 'unique-id')}
    text={text('text', 'PrevButton')}
    onClick={action('onClick')}
    disabled={boolean('disabled', false)}
  />
);

_PrevButton.storyName = 'PrevButton';
_PrevButton.parameters = {
  info: {
    text: `
      # Description

      A Button to go back previous content.
    `,
  },
};
