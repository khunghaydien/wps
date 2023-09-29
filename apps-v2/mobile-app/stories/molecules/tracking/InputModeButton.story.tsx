import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import InputModeButton from '../../../components/molecules/tracking/InputModeButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs, withInfo],
};

export const _InputModeButton: FCStory = () => (
  <InputModeButton value={'ratio'} onClick={action('onClick')} />
);
_InputModeButton.storyName = 'InputModeButton';
_InputModeButton.parameters = {
  info: {
    text: `
      # Description

      Switch input mode for trakcing t
    `,
  },
};
