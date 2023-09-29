import React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { Text, TextField } from '../../../../../core';

import { OvertimeWorkRequest } from '@attendance/domain/models/AttDailyRequest/OvertimeWorkRequest';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import FormRow from './FormRow';

const ROOT =
  'timesheet-pc-dialogs-daily-att-request-dialog-form-for-overtime-work';

type Props = {
  isReadOnly: boolean;
  targetRequest: OvertimeWorkRequest;
  onUpdateValue: (
    arg0: keyof OvertimeWorkRequest,
    arg1: OvertimeWorkRequest[keyof OvertimeWorkRequest]
  ) => void;
};

export default class FormForOvertimeWork extends React.Component<Props> {
  render() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    return (
      <div className={ROOT}>
        <FormRow labelText={msg().Att_Lbl_Date} height="thin">
          <Text size="large">
            {DateUtil.formatYMD(targetRequest.startDate)}
          </Text>
        </FormRow>

        <FormRow labelText={msg().Att_Lbl_Duration}>
          <AttTimeRangeField
            startTime={{
              value: TimeUtil.toHHmm(targetRequest.startTime),
              onBlur: (value) =>
                onUpdateValue('startTime', TimeUtil.toMinutes(value)),
            }}
            endTime={{
              value: TimeUtil.toHHmm(targetRequest.endTime),
              onBlur: (value) =>
                onUpdateValue('endTime', TimeUtil.toMinutes(value)),
            }}
            disabled={isReadOnly}
            required
          />
        </FormRow>

        <FormRow labelText={msg().Att_Lbl_Remarks}>
          <TextField
            maxLength={255}
            minRows={3}
            value={targetRequest.remarks || ''}
            onChange={(e) => onUpdateValue('remarks', e.target.value)}
            readOnly={isReadOnly}
          />
        </FormRow>
      </div>
    );
  }
}
