import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForDirect from '../FormForDirect';
import { FullRestTimes, OneDay, Range } from './mock-data/directRequests';

export default {
  title: 'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForDirect',
};

export const _OneDay = () => {
  return (
    <FormForDirect
      isReadOnly={false}
      hasRange={false}
      targetRequest={OneDay}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

_OneDay.storyName = 'One day';

export const OneDayReadOnly = () => {
  return (
    <FormForDirect
      isReadOnly
      hasRange={false}
      targetRequest={OneDay}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

OneDayReadOnly.storyName = 'One day (Read only)';

export const _Range = () => {
  return (
    <FormForDirect
      isReadOnly={false}
      hasRange
      targetRequest={Range}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

export const RangeReadOnly = () => {
  return (
    <FormForDirect
      isReadOnly
      hasRange
      targetRequest={Range}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

RangeReadOnly.storyName = 'Range (Read Only)';

export const _FullRestTimes = () => {
  return (
    <FormForDirect
      isReadOnly={false}
      hasRange={false}
      targetRequest={FullRestTimes}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

_FullRestTimes.storyName = 'Full rest times';

export const FullRestTimesReadOnly = () => {
  return (
    <FormForDirect
      isReadOnly
      hasRange={false}
      targetRequest={FullRestTimes}
      maxRestTimesCount={5}
      onUpdateHasRange={action('UpdatedHasRange')}
      onUpdateValue={action('Updated')}
    />
  );
};

FullRestTimesReadOnly.storyName = 'Full rest times (Read Only)';
