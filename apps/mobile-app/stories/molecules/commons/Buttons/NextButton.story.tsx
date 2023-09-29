import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import NextButton from '../../../../components/molecules/commons/Buttons/NextButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Buttons',
  decorators: [withKnobs, withInfo],
};

export const _NextButton: FCStory = () => (
  <NextButton
    testId={text('testId', 'unique-id')}
    text={text('text', 'NextButton')}
    onClick={action('onClick')}
    disabled={boolean('disabled', false)}
  />
);

_NextButton.storyName = 'NextButton';
_NextButton.parameters = {
  info: {
    text: `
      # Description

      A Button to go next content.
    `,
  },
};
