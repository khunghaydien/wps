import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForEarlyStartWork from '../FormForEarlyStartWork';
import * as earlyStartWorkRequests from './mock-data/earlyStartWorkRequests';

export default {
  title:
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForEarlyStartWork',
};

export const Default = () => {
  return (
    <FormForEarlyStartWork
      isReadOnly={false}
      targetRequest={earlyStartWorkRequests.defaultValues}
      onUpdateValue={action('Updated')}
    />
  );
};

Default.storyName = 'default';

export const ReadOnly = () => {
  return (
    <FormForEarlyStartWork
      isReadOnly
      targetRequest={earlyStartWorkRequests.defaultValues}
      onUpdateValue={action('Updated')}
    />
  );
};
