import * as React from 'react';

import { action } from '@storybook/addon-actions';

import AttTimeRangeField from '../AttTimeRangeField';

export default {
  title: 'attendance/timesheet-pc/dialogs/fields/AttTimeRangeField',
};

export const Default = () => (
  <AttTimeRangeField
    startTime={{
      value: '9:00',
      onBlur: action('startTime.onBlur()'),
    }}
    endTime={{
      value: '18:00',
      onBlur: action('endTime.onBlur()'),
    }}
  />
);

Default.storyName = 'default';

export const Required = () => (
  <AttTimeRangeField
    startTime={{
      value: '9:00',
      onBlur: action('startTime.onBlur()'),
    }}
    endTime={{
      value: '18:00',
      onBlur: action('endTime.onBlur()'),
    }}
    required
  />
);

Required.storyName = 'required';

export const Disabled = () => (
  <AttTimeRangeField
    startTime={{
      value: '9:00',
      onBlur: action('startTime.onBlur()'),
    }}
    endTime={{
      value: '18:00',
      onBlur: action('endTime.onBlur()'),
    }}
    disabled
  />
);

Disabled.storyName = 'disabled';
