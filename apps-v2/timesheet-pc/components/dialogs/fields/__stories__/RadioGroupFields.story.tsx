import * as React from 'react';

import { action } from '@storybook/addon-actions';

import RadioGroupField from '../RadioGroupField';

const options = [
  {
    label: 'Label',
    value: 1,
  },
  {
    label: 'SELECTED',
    value: 2,
  },
  {
    label:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTU',
    value: 3,
  },
];

export default {
  title: 'timesheet-pc/dialogs/fields/RadioGroupField',
};

export const Default = () => (
  <RadioGroupField options={options} onChange={action('onChange')} />
);

Default.storyName = 'default';

export const Checked = () => (
  <RadioGroupField value={2} options={options} onChange={action('onChange')} />
);

Checked.storyName = 'checked';

export const Disabled = () => (
  <RadioGroupField
    value={2}
    options={options}
    onChange={action('onChange')}
    disabled
  />
);

Disabled.storyName = 'disabled';
