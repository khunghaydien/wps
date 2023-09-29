import React from 'react';

import { action } from '@storybook/addon-actions';

import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import FormForHolidayWork from '../../FormForHolidayWork';
import {
  compensatoryStocked,
  noSubstitute,
  reapply,
  substitute,
} from '../mock-data/holidayWorkRequests';

const substituteLeaveTypes = [
  SUBSTITUTE_LEAVE_TYPE.None,
  SUBSTITUTE_LEAVE_TYPE.Substitute,
  SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
];

export default {
  title:
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FromForHolidayWork/Default',
};

export const NoSubstituteNoList = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes: [SUBSTITUTE_LEAVE_TYPE.None],
      }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};

NoSubstituteNoList.storyName = 'No Substitute (No list)';

export const NoSubstitute = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
      }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};

export const Substitute = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...substitute,
        substituteLeaveTypes,
      }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};

export const CompensatoryStocked = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{ ...compensatoryStocked, substituteLeaveTypes }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};

export const Reapply = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{ ...reapply, substituteLeaveTypes }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForHolidayWork
      isReadOnly
      targetRequest={{ ...substitute, substituteLeaveTypes }}
      selectedAttPattern={null}
      onUpdateValue={action('Updated')}
    />
  );
};
