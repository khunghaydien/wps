import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import BackButton from '../../../../components/molecules/commons/Buttons/BackButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Buttons',
  decorators: [withKnobs, withInfo],
};

export const _BackButton: FCStory = () => (
  <BackButton
    testId={text('testId', 'unique-id')}
    text={text('text', 'BackButton')}
    onClick={action('onClick')}
    disabled={boolean('disabled', false)}
  />
);

_BackButton.storyName = 'BackButton';
_BackButton.parameters = {
  info: {
    text: `
      # Description

      A Button to go back previous page.
    `,
  },
};
