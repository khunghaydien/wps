import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForLateArrival from '../FormForLateArrival';
import {
  AdvanceRequest,
  AfterRequest,
  LateArrivalAndUseLateArrivalReasonRequest,
  LateArrivalReasonList,
} from './mock-data/lateArrivalRequests';

export default {
  title:
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForLateArrival',
};

export const _AdvanceRequest = () => {
  return (
    <FormForLateArrival
      isReadOnly={false}
      isBeforeWorking
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
      lateArrivalReasonList={[]}
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
      lateArrivalReasonList={[]}
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
      lateArrivalReasonList={[]}
    />
  );
};

export const LateArrivalRequestForUseLateArrivalReason = () => {
  return (
    <FormForLateArrival
      isReadOnly={false}
      isBeforeWorking
      targetRequest={LateArrivalAndUseLateArrivalReasonRequest}
      onUpdateValue={action('Updated')}
      lateArrivalReasonList={LateArrivalReasonList}
    />
  );
};
