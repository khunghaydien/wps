import * as React from 'react';

import moment from 'moment';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { DatePicker, TextField } from '../../../../core';

import { isForReapply } from '../../../../domain/models/attendance/AttDailyRequest';
import { HolidayWorkRequest } from '../../../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import {
  ORDER_OF_SUBSTITUTE_LEAVE_TYPES,
  SUBSTITUTE_LEAVE_TYPE,
  SubstituteLeaveType,
} from '../../../../domain/models/attendance/SubstituteLeaveType';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import RadioGroupField from '../fields/RadioGroupField';
import FormRow from './FormRow';

type Props = {
  isReadOnly: boolean;
  targetRequest: HolidayWorkRequest;
  substituteLeaveTypeList: SubstituteLeaveType[];
  onUpdateValue: (
    arg0: keyof HolidayWorkRequest,
    arg1: HolidayWorkRequest[keyof HolidayWorkRequest]
  ) => void;
};

const LEAVE_TYPE_LABEL_MAP = {
  [SUBSTITUTE_LEAVE_TYPE.None]: () => msg().Att_Lbl_DoNotUseReplacementDayOff,
  [SUBSTITUTE_LEAVE_TYPE.Substitute]: () => msg().Att_Lbl_Substitute,
  [SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked]: () =>
    msg().Att_Lbl_CompensatoryLeave,
};

export default class FormForHolidayWork extends React.Component<Props> {
  renderOriginalTargetDateField() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    const enabled = isForReapply(targetRequest);

    return (
      <FormRow labelText={msg().Att_Lbl_HolidayWorkDate}>
        <DatePicker
          value={DateUtil.formatYMD(targetRequest.startDate)}
          selected={
            targetRequest.startDate
              ? new Date(targetRequest.startDate)
              : new Date()
          }
          onChange={(value: Date | null) =>
            onUpdateValue(
              'startDate',
              value ? moment(value).format('YYYY-MM-DD') : ''
            )
          }
          showsIcon={!isReadOnly && enabled}
          disabled={isReadOnly || !enabled}
          required
        />
      </FormRow>
    );
  }

  renderSubstituteLeaveDateField() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;
    const { substituteDate, startDate } = targetRequest;

    return (
      <FormRow
        labelText={msg().Att_Lbl_ScheduledDateOfSubstitute}
        key="substituteDate"
      >
        <DatePicker
          value={DateUtil.formatYMD(substituteDate)}
          selected={
            substituteDate || startDate
              ? new Date(substituteDate || startDate)
              : new Date()
          }
          onChange={(value: Date | null) =>
            onUpdateValue(
              'substituteDate',
              value ? moment(value).format('YYYY-MM-DD') : ''
            )
          }
          showsIcon={!isReadOnly}
          disabled={isReadOnly}
          required
        />
      </FormRow>
    );
  }

  renderSubstituteLeaveFields() {
    const {
      isReadOnly,
      targetRequest,
      substituteLeaveTypeList,
      onUpdateValue,
    } = this.props;
    const { substituteLeaveType } = targetRequest;

    // 「利用しない」しか選択肢がない場合は、関連フィールドを出力しない
    if (substituteLeaveTypeList.length === 1) {
      return null;
    }

    const fieldsDOMList = [];

    const leaveTypeOptions = ORDER_OF_SUBSTITUTE_LEAVE_TYPES.filter(
      (leaveType) => substituteLeaveTypeList.includes(leaveType)
    ).map((leaveType) => ({
      label: LEAVE_TYPE_LABEL_MAP[leaveType](),
      value: leaveType,
    }));

    fieldsDOMList.push(
      <FormRow
        labelText={msg().Att_Lbl_ReplacementDayOff}
        key="substituteLeaveType"
      >
        <RadioGroupField
          options={leaveTypeOptions}
          value={substituteLeaveType}
          onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
            onUpdateValue('substituteLeaveType', e.currentTarget.value)
          }
          disabled={isReadOnly}
        />
      </FormRow>
    );

    switch (substituteLeaveType) {
      case SUBSTITUTE_LEAVE_TYPE.Substitute:
        fieldsDOMList.push(this.renderSubstituteLeaveDateField());
        break;

      default:
    }

    return fieldsDOMList;
  }

  render() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    return (
      <div>
        {this.renderOriginalTargetDateField()}

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

        {this.renderSubstituteLeaveFields()}

        <FormRow labelText={msg().Att_Lbl_Remarks}>
          <TextField
            maxLength={255}
            minRows={3}
            value={targetRequest.remarks || ''}
            onChange={(e: React.SyntheticEvent<HTMLTextAreaElement>) =>
              onUpdateValue('remarks', e.currentTarget.value)
            }
            readOnly={isReadOnly}
          />
        </FormRow>
      </div>
    );
  }
}
