import React from 'react';

import { action } from '@storybook/addon-actions';

import DirectApplyRestTimeRangeFormRows from '../DirectApplyRestTimeRangeFormRows';

const defaultRestTimes = [
  {
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  { startTime: null, endTime: null, restReason: null },
];

const minRestTimes = [
  {
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
];

const maxRestTimes = [
  {
    startTime: 60,
    endTime: 120,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  {
    startTime: 180,
    endTime: 240,
    restReason: {
      id: 'a0A2800000FmMQCEA1',
      name: 'お昼休み',
      code: '001',
    },
  },
  { startTime: null, endTime: null, restReason: null },
  { startTime: null, endTime: null, restReason: null },
  { startTime: null, endTime: null, restReason: null },
];

export default {
  title:
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/DirectApplyRestTimeRangeFormRows',
};

export const Default = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={defaultRestTimes}
    isReadOnly={false}
    maxRestTimesCount={5}
    onUpdateValue={action('onUpdateValue')}
  />
);

Default.storyName = 'default';

export const Min = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={minRestTimes}
    isReadOnly={false}
    maxRestTimesCount={5}
    onUpdateValue={action('onUpdateValue')}
  />
);

Min.storyName = 'min';

export const Max = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={maxRestTimes}
    isReadOnly={false}
    maxRestTimesCount={5}
    onUpdateValue={action('onUpdateValue')}
  />
);

Max.storyName = 'max';

export const Readonly = () => (
  <DirectApplyRestTimeRangeFormRows
    directApplyRestTimes={defaultRestTimes}
    isReadOnly
    maxRestTimesCount={5}
    onUpdateValue={action('onUpdateValue')}
  />
);

Readonly.storyName = 'readonly';
