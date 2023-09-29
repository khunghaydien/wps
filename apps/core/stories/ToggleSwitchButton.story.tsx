import React from 'react';

import { action } from '@storybook/addon-actions';

import { Icons, ToggleSwitchButton } from '../index';

export default {
  title: 'core/ToggleSwitchButton',
};

export const Default = () => (
  <>
    <ToggleSwitchButton
      onClick={action('onClick')}
      options={[
        { label: 'search', icon: Icons.Search, value: '1' },
        { label: 'check', icon: Icons.Check, value: '2' },
      ]}
      value="2"
    />
  </>
);

Default.storyName = 'default';

export const Disabled = () => (
  <>
    <ToggleSwitchButton
      disabled
      onClick={action('onClick')}
      options={[
        { label: 'search', icon: Icons.Search, value: '1' },
        { label: 'check', icon: Icons.Check, value: '2' },
      ]}
      value="2"
    />
  </>
);

Disabled.storyName = 'disabled';
