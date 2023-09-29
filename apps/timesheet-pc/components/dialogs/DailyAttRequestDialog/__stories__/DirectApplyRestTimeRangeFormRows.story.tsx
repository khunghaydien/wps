import React from 'react';

import { action } from '@storybook/addon-actions';

import DirectApplyRestTimeRangeFormRows from '../DirectApplyRestTimeRangeFormRows';

const defaultRestTimes = [
  { startTime: 60, endTime: 120 },
  { startTime: null, endTime: null },
];

const minRestTimes = [{ startTime: 60, endTime: 120 }];

const maxRestTimes = [
  { startTime: 60, endTime: 120 },
  { startTime: 180, endTime: 240 },
  { startTime: null, endTime: null },
  { startTime: null, endTime: null },
  { startTime: null, endTime: null },
];

export default {
  title:
    'timesheet-pc/dialogs/DailyAttRequestDialog/DirectApplyRestTimeRangeFormRows',
};

export const Default = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={defaultRestTimes}
    isReadOnly={false}
    onUpdateValue={action('onUpdateValue')}
  />
);

Default.storyName = 'default';

export const Min = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={minRestTimes}
    isReadOnly={false}
    onUpdateValue={action('onUpdateValue')}
  />
);

Min.storyName = 'min';

export const Max = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={maxRestTimes}
    isReadOnly={false}
    onUpdateValue={action('onUpdateValue')}
  />
);

Max.storyName = 'max';

export const Readonly = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={defaultRestTimes}
    isReadOnly
    onUpdateValue={action('onUpdateValue')}
  />
);

Readonly.storyName = 'readonly';
