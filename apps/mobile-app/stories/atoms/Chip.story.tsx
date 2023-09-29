import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';

import Chip from '../../components/atoms/Chip';

export default {
  title: 'Components/atoms/Chip',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
 # Description

  Show supplementary information
`)(() => (
  <Chip text={text('text', 'TEXT TEXT TEXT TEXT TEXT text text text text.')} />
));
