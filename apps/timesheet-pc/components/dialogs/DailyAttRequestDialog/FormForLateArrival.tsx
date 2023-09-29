import React from 'react';

import AttTimeField from '../../../../commons/components/fields/AttTimeField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { Text, TextField } from '../../../../core';

import { LateArrivalRequest } from '../../../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';

import FormRow from './FormRow';

const ROOT =
  'timesheet-pc-dialogs-daily-att-request-dialog-form-for-late-arrival';

type Props = {
  isReadOnly: boolean;
  isBeforeWorking: boolean;
  targetRequest: LateArrivalRequest;
  onUpdateValue: (
    arg0: keyof LateArrivalRequest,
    arg1: LateArrivalRequest[keyof LateArrivalRequest]
  ) => void;
};

export default class FormForLateArrival extends React.Component<Props> {
  render() {
    const { isReadOnly, isBeforeWorking, targetRequest, onUpdateValue } =
      this.props;

    return (
      <div className={ROOT}>
        <FormRow key="date" labelText={msg().Att_Lbl_Date}>
          <Text size="large">
            {DateUtil.formatYMD(targetRequest.startDate)}
          </Text>
        </FormRow>

        <FormRow key="startTime" labelText={msg().Att_Lbl_ContractedStartTime}>
          <Text size="large">{TimeUtil.toHHmm(targetRequest.startTime)}</Text>
        </FormRow>

        <FormRow key="endTime" labelText={msg().Att_Lbl_LateArrivalStartTime}>
          <AttTimeField
            value={TimeUtil.toHHmm(targetRequest.endTime)}
            onBlur={(value) =>
              onUpdateValue('endTime', TimeUtil.toMinutes(value))
            }
            disabled={!isBeforeWorking || isReadOnly}
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
