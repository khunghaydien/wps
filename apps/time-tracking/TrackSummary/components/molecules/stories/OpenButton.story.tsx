import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

/* eslint-disable import/no-extraneous-dependencies */
import OpenButton from '../OpenButton';

export default {
  title: 'time-tracking/TrackSummary/Buttons',
  decorators: [withKnobs],
};

export const _OpenButton = () => (
  <OpenButton
    disableMotion
    isOpen={boolean('isOpen', false)}
    onClick={action('onClick')}
  >
    Open
  </OpenButton>
);

_OpenButton.storyName = 'OpenButton';
_OpenButton.parameters = {
  info: { propTables: false, inline: false, source: true },
};
