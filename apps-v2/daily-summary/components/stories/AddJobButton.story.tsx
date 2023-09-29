import React from 'react';

import { action } from '@storybook/addon-actions';

import AddJobButton from '../TaskCard/AddJobButton';

export default {
  title: 'daily-summary/TaskCard/AddJobButton',
};

export const Default = () => <AddJobButton onClick={action('onClick')} />;

Default.storyName = 'default';

export const Disabled = () => (
  <AddJobButton onClick={action('onClick')} disabled />
);

Disabled.storyName = 'disabled';
