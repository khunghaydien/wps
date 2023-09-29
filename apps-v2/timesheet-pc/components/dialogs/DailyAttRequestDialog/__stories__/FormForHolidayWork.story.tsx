import React from 'react';

import { action } from '@storybook/addon-actions';

import { SUBSTITUTE_LEAVE_TYPE } from '../../../../../domain/models/attendance/SubstituteLeaveType';

import FormForHolidayWork from '../FormForHolidayWork';
import {
  compensatoryStocked,
  noSubstitute,
  reapply,
  substitute,
} from './mock-data/holidayWorkRequests';

const substituteLeaveTypeList = [
  SUBSTITUTE_LEAVE_TYPE.None,
  SUBSTITUTE_LEAVE_TYPE.Substitute,
  SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
];

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FromForHolidayWork',
};

export const NoSubstituteNoList = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={noSubstitute}
      substituteLeaveTypeList={[SUBSTITUTE_LEAVE_TYPE.None]}
      onUpdateValue={action('Updated')}
    />
  );
};

NoSubstituteNoList.storyName = 'No Substitute (No list)';

export const NoSubstitute = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={noSubstitute}
      substituteLeaveTypeList={substituteLeaveTypeList}
      onUpdateValue={action('Updated')}
    />
  );
};

export const _Substitute = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={substitute}
      substituteLeaveTypeList={substituteLeaveTypeList}
      onUpdateValue={action('Updated')}
    />
  );
};

_Substitute.parameters = {
  info: { propTables: [FormForHolidayWork], inline: true, source: true },
};

export const _CompensatoryStocked = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={compensatoryStocked}
      substituteLeaveTypeList={substituteLeaveTypeList}
      onUpdateValue={action('Updated')}
    />
  );
};

_CompensatoryStocked.parameters = {
  info: { propTables: [FormForHolidayWork], inline: true, source: true },
};

export const Reapply = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={reapply}
      substituteLeaveTypeList={substituteLeaveTypeList}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForHolidayWork
      isReadOnly
      targetRequest={substitute}
      substituteLeaveTypeList={substituteLeaveTypeList}
      onUpdateValue={action('Updated')}
    />
  );
};
