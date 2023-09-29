import React from 'react';

import { object, withKnobs } from '@storybook/addon-knobs';

import HorizontalBarGraph from '../../components/atoms/HorizontalBarGraph';

export default {
  title: 'Components/atoms/HorizontalBarGraph',
  decorators: [withKnobs],
};

export const Basic = () => (
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
);
