import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { object, withKnobs } from '@storybook/addon-knobs';

import HorizontalBarGraph from '../../components/atoms/HorizontalBarGraph';

export default {
  title: 'Components/atoms/HorizontalBarGraph',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
# Description

`)(() => (
  <HorizontalBarGraph
    data={object('data', [
      {
        color: '#0083b6',
        value: 510,
        label: 'TEST',
      },
      {
        color: '#00a3df',
        value: 370,
        label: 'TEST',
      },
      {
        color: '#ddd',
        value: 900,
        label: 'TEST',
        labelColor: 'black',
        labelAlign: 'right',
      },
    ])}
  />
));
