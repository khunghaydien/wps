import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForEarlyLeave from '../FormForEarlyLeave';
import { AdvanceRequest, AfterRequest } from './mock-data/earlyRequests';

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormForEarlyLeave',
};

export const PreRequest = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
    />
  );
};

export const PostRequest = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice={false}
      targetRequest={AfterRequest}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForEarlyLeave
      isReadOnly
      isLeavingOffice={false}
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
    />
  );
};
