import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForOvertimeWork from '../FormForOvertimeWork';
import * as overtimeWorkRequests from './mock-data/overtimeWorkRequests';

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormForOvertimeWork',
};

export const Default = () => {
  return (
    <FormForOvertimeWork
      isReadOnly={false}
      targetRequest={overtimeWorkRequests.defaultValues}
      onUpdateValue={action('Updated')}
    />
  );
};

Default.storyName = 'default';

export const ReadOnly = () => {
  return (
    <FormForOvertimeWork
      isReadOnly
      targetRequest={overtimeWorkRequests.defaultValues}
      onUpdateValue={action('Updated')}
    />
  );
};
