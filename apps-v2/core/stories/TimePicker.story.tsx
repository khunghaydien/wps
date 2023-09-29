/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import { action } from '@storybook/addon-actions';

import { TimePicker } from '../index';

export default {
  title: 'core/TimePicker',
};

export const Default = () => (
  <TimePicker onSelect={action('onSelect')} value="11:30" placeholder="TEST" />
);

Default.storyName = 'default';

export const OpeningMenu = () => (
  <TimePicker isOpenByDefault value="12:00" onSelect={action('onSelect')} />
);

OpeningMenu.storyName = 'opening  menu';

export const Placeholder = () => (
  <TimePicker
    onSelect={action('onSelect')}
    value={undefined}
    placeholder="TEST"
  />
);

Placeholder.storyName = 'placeholder';

export const InvalidValue = () => (
  <TimePicker value="HOGE" onSelect={action('onSelect')} />
);

InvalidValue.storyName = 'invalid value';

export const Disabled = () => (
  <TimePicker disabled value="00:30" onSelect={action('onSelect')} />
);

Disabled.storyName = 'disabled';

export const ReadOnly = () => (
  <TimePicker readOnly value="00:30" onSelect={action('onSelect')} />
);

ReadOnly.storyName = 'readOnly';
