import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { withKnobs } from '@storybook/addon-knobs';

import AlertIcon from '../../../components/molecules/commons/AlertIcon';

export default {
  title: 'Components/molecules/commons/AlertIcon',
  decorators: [withKnobs, withInfo],
};

export const Warning = () => <AlertIcon variant={'warning'} />;

Warning.story = {
  parameters: {
    info: {
      text: `
    # Description

    Display AlertIcon
      `,
    },
  },
};

export const Attention = () => <AlertIcon variant={'attention'} />;

Attention.story = {
  parameters: {
    info: {
      text: `
    # Description

    Display AlertIcon
      `,
    },
  },
};
