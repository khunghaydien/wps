import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForLateArrival from '../FormForLateArrival';
import { AdvanceRequest, AfterRequest } from './mock-data/lateArrivalRequests';

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormForLateArrival',
};

export const _AdvanceRequest = () => {
  return (
    <FormForLateArrival
      isReadOnly={false}
      isBeforeWorking
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
    />
  );
};

export const _AfterRequest = () => {
  return (
    <FormForLateArrival
      isReadOnly={false}
      isBeforeWorking={false}
      targetRequest={AfterRequest}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForLateArrival
      isReadOnly
      isBeforeWorking={false}
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
    />
  );
};
