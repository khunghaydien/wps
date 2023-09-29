import React from 'react';

import AttTimeField from '../../../../commons/components/fields/AttTimeField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { Text, TextField } from '../../../../core';

import { EarlyLeaveRequest } from '../../../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';

import FormRow from './FormRow';

const ROOT =
  'timesheet-pc-dialogs-daily-att-request-dialog-form-for-early-leave';

type Props = Readonly<{
  isReadOnly: boolean;
  isLeavingOffice: boolean;
  targetRequest: EarlyLeaveRequest;
  onUpdateValue: (
    arg0: keyof EarlyLeaveRequest,
    arg1: EarlyLeaveRequest[keyof EarlyLeaveRequest]
  ) => void;
}>;

export default class FormForEarlyLeave extends React.Component<Props> {
  render() {
    const { isReadOnly, isLeavingOffice, targetRequest, onUpdateValue } =
      this.props;

    return (
      <div className={ROOT}>
        <FormRow key="date" labelText={msg().Att_Lbl_Date}>
          <Text size="large">
            {DateUtil.formatYMD(targetRequest.startDate)}
          </Text>
        </FormRow>

        <FormRow key="endTime" labelText={msg().Att_Lbl_ContractedEndTime}>
          <Text size="large">{TimeUtil.toHHmm(targetRequest.endTime)}</Text>
        </FormRow>

        <FormRow key="startTime" labelText={msg().Att_Lbl_EarlyLeaveStartTime}>
          <AttTimeField
            value={TimeUtil.toHHmm(targetRequest.startTime)}
            onBlur={(value) =>
              onUpdateValue('startTime', TimeUtil.toMinutes(value))
            }
            disabled={isLeavingOffice || isReadOnly}
            required
          />
        </FormRow>

        <FormRow key="reason" labelText={msg().Att_Lbl_Reason}>
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
  }
}
