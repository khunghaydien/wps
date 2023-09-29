import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Alert from '../../../components/molecules/commons/Alert';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/commons/Alert',
  decorators: [withKnobs, withInfo],
};

export const Warning = () => (
  <Alert
    variant={'warning'}
    message={[text('message', 'text text text text')]}
  />
);
Warning.parameters = {
  info: {
    text: `
      # Description

      Display Alert
    `,
  },
};

export const Attention = () => (
  <Alert
    variant={'attention'}
    message={[text('message', 'text text text text')]}
  />
);
Attention.parameters = {
  info: {
    text: `
      # Description

      Display Alert
    `,
  },
};

export const MultipleWarning: FCStory = () => (
  <Alert
    variant={'warning'}
    message={[
      text('message1', 'text text text text'),
      text('message2', 'text text text text'),
    ]}
  />
);

MultipleWarning.storyName = 'MultipleWarning';
MultipleWarning.parameters = {
  info: {
    text: `
      # Description

      Display Alert
    `,
  },
};

export const MultipleAttention = () => (
  <Alert
    variant={'attention'}
    message={[
      text('message1', 'text text text text'),
      text('message2', 'text text text text'),
    ]}
  />
);

MultipleAttention.storyName = 'MultipleAttention';
MultipleAttention.parameters = {
  info: {
    text: `
      # Description

      Display Alert
    `,
  },
};
