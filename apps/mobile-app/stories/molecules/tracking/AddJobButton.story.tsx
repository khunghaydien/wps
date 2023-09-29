import React from 'react';

import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import AddJobButton from '../../../components/molecules/tracking/AddJobButton';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/tracking',
  decorators: [withKnobs, withInfo],
};

export const _AddJobButton: FCStory = () => (
  <AddJobButton
    onClick={action('onClick')}
    floating={boolean('floating', true)}
  />
);

_AddJobButton.storyName = 'AddJobButton';
_AddJobButton.parameters = {
  info: {
    inline: false,
    text: `
      # Description

      Button to add a job to task list
    `,
  },
};
