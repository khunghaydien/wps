import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import { TextField } from '../../../../../core';

import { AbsenceRequest } from '@attendance/domain/models/AttDailyRequest/AbsenceRequest';

import DateRangeField from '../fields/DateRangeField';
import FormRow from './FormRow';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-absence';

export type Props = {
  // state
  isReadOnly: boolean;
  targetRequest: AbsenceRequest;
  hasRange: boolean;

  // actions
  onUpdateHasRange: (arg0: boolean) => void;
  onUpdateValue: (
    arg0: keyof AbsenceRequest,
    arg1: AbsenceRequest[keyof AbsenceRequest]
  ) => void;
};

export default (props: Props) => {
  const {
    isReadOnly,
    targetRequest,
    hasRange,
    onUpdateValue,
    onUpdateHasRange,
  } = props;
  const minOfEndDate = DateUtil.addDays(targetRequest.startDate, 1);
  return (
    <div className={ROOT}>
      <FormRow labelText={msg().Att_Lbl_Period}>
        <DateRangeField
          startDateFieldProps={{
            disabled: true,
            showsIcon: false,
            value: targetRequest.startDate,
            selected: targetRequest.startDate,
            onChange: (value) => onUpdateValue('startDate', value),
          }}
          endDateFieldProps={{
            disabled: isReadOnly,
            showsIcon: !isReadOnly,
            value: targetRequest.endDate,
            selected: targetRequest.endDate,
            minDate: minOfEndDate,
            onChange: (value) => onUpdateValue('endDate', value),
          }}
          onChangeHasRange={onUpdateHasRange}
          hasRange={hasRange}
          disabled={isReadOnly}
          required
        />
      </FormRow>

      <FormRow labelText={msg().Att_Lbl_Reason}>
        <TextField
          maxLength={255}
          minRows={3}
          value={targetRequest.reason || ''}
          onChange={(e) => onUpdateValue('reason', e.target.value)}
          readOnly={isReadOnly}
          required
        />
      </FormRow>
    </div>
  );
};
