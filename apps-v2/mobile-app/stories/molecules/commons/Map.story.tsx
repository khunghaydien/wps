import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { number, withKnobs } from '@storybook/addon-knobs';

import Map from '../../../components/molecules/commons/Map';

export default {
  title: 'Components/molecules/commons/Map',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => (
  <Map
    latitude={number('latitude', 35.658581)}
    longitude={number('longitude', 139.745433)}
  />
);

Basic.story = {
  parameters: {
    info: {
      text: `
    # Description

    Show map
      `,
    },
  },
};
