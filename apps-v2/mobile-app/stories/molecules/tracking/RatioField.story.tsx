import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { number, withKnobs } from '@storybook/addon-knobs';

import RatioField from '../../../components/molecules/tracking/RatioField';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs, withInfo],
};

export const RadioField: FCStory = () => (
  <RatioField value={number('value', 10)} onBlur={action('onBlur')} />
);

RadioField.storyName = 'RadioField';
RadioField.parameters = {
  info: {
    text: `
      # Description

      Input field for entering trakcing time as ratio.
    `,
  },
};
