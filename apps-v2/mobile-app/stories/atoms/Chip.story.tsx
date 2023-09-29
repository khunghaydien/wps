import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Chip from '../../components/atoms/Chip';

export default {
  title: 'Components/atoms/Chip',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Chip text={text('text', 'TEXT TEXT TEXT TEXT TEXT text text text text.')} />
);

Basic.story = {
  parameters: {
    info: {
      text: `
 # Description

  Show supplementary information
      `,
    },
  },
};
