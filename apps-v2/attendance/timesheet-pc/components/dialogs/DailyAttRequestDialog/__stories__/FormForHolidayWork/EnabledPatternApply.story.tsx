import React from 'react';

import { action } from '@storybook/addon-actions';

import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import FormForHolidayWork from '../../FormForHolidayWork';
import {
  compensatoryStocked,
  noSubstitute,
  patterns,
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
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FromForHolidayWork/EnabledPatternApply',
};

export const NoSubstitute = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[1]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const WithDirectInput = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[0]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const WithNoList = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[0]],
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[0]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpFlex = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[2]],
        patternCode: patterns[2].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[2]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpFlexWithoutCoreTime = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[3]],
        patternCode: patterns[3].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[3]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpDiscretion = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[4]],
        patternCode: patterns[4].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[4]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpManager = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[5]],
        patternCode: patterns[5].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[5]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const JpModified = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns: [patterns[6]],
        patternCode: patterns[6].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[6]}
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
        patterns,
        patternCode: patterns[0].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[0]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const CompensatoryStocked = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...compensatoryStocked,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[1]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const Reapply = () => {
  return (
    <FormForHolidayWork
      isReadOnly={false}
      targetRequest={{
        ...reapply,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[1]}
      onUpdateValue={action('Updated')}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForHolidayWork
      isReadOnly
      targetRequest={{
        ...noSubstitute,
        substituteLeaveTypes,
        patterns,
        patternCode: patterns[1].code,
        enabledPatternApply: true,
      }}
      selectedAttPattern={patterns[1]}
      onUpdateValue={action('Updated')}
    />
  );
};
