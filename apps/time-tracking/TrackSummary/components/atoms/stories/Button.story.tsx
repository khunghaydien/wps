import React from 'react';

import { action } from '@storybook/addon-actions';

import Button from '../Button';

export default {
  title: 'time-tracking/TrackSummary',
};

export const Buttons = () => (
  <>
    <Button onClick={action('onClick')}>Button</Button>
    <Button onClick={action('onClick')} default>
      Default
    </Button>
    <Button onClick={action('onClick')} primary>
      Primary
    </Button>
    <Button onClick={action('onClick')} secondary>
      Secondary
    </Button>
    <Button onClick={action('onClick')} error>
      Error
    </Button>
    <Button onClick={action('onClick')} text>
      Text
    </Button>
  </>
);

Buttons.parameters = {
  info: { propTables: false, inline: false, source: true },
};
