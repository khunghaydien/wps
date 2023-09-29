import * as React from 'react';

import moment from 'moment';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { DatePicker, Dropdown, Text, TextField } from '../../../../../core';

import { isForReapply } from '@attendance/domain/models/AttDailyRequest';
import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { AttPattern, DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import {
  ORDER_OF_SUBSTITUTE_LEAVE_TYPES,
  SUBSTITUTE_LEAVE_TYPE,
} from '@attendance/domain/models/SubstituteLeaveType';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import RangeMark from '../../../images/rangeMark.svg';
import AttTimeRangeField from '../fields/AttTimeRangeField';
import RadioGroupField from '../fields/RadioGroupField';
import FormRow from './FormRow';
import substituteLeaveTypeName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/substituteLeaveTypeName';

import './FormForHolidayWork.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-holiday';
type Props = {
  isReadOnly: boolean;
  targetRequest: HolidayWorkRequest;
  onUpdateValue: (
    arg0: keyof HolidayWorkRequest,
    arg1: HolidayWorkRequest[keyof HolidayWorkRequest]
  ) => void;
  selectedAttPattern: AttPattern | null;
};

const isDirectInputOnly = (request: HolidayWorkRequest) =>
  request.patterns?.length === 1 &&
  request.patterns?.at(0)?.code === DIRECT_INPUT;

const isFlexWithoutCore = (pattern: AttPattern) =>
  pattern.workSystem === WORK_SYSTEM_TYPE.JP_Flex && pattern.withoutCoreTime;

const TimeRange = ({
  startTime,
  endTime,
}: {
  startTime: number | null;
  endTime: number | null;
}) => (
  <div className={`${ROOT}__time-range`}>
    <Text size="large">{TimeUtil.toHHmm(startTime)}</Text>
    <div className={`${ROOT}__range-mark`}>
      <RangeMark />
    </div>
    <Text size="large">{TimeUtil.toHHmm(endTime)}</Text>
  </div>
);

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

  renderSubstitutePatternCode() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    return (
      <FormRow labelText={msg().Att_Lbl_WorkingPattern}>
        <Dropdown
          options={targetRequest.patterns.map(({ name, code }) => ({
            label: name,
            value: code,
          }))}
          value={targetRequest.patternCode}
          onSelect={(e) => onUpdateValue('patternCode', e.value)}
          readOnly={isReadOnly}
        />
      </FormRow>
    );
  }

  renderTimeRangeField() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    return (
      <FormRow labelText={msg().Att_Lbl_Duration}>
        <AttTimeRangeField
          startTime={{
            value: TimeUtil.toHHmm(targetRequest.startTime),
            onBlur: (value) =>
              onUpdateValue('startTime', TimeUtil.parseMinutes(value) || ''),
          }}
          endTime={{
            value: TimeUtil.toHHmm(targetRequest.endTime),
            onBlur: (value) =>
              onUpdateValue('endTime', TimeUtil.parseMinutes(value) || ''),
          }}
          disabled={isReadOnly}
          required
        />
      </FormRow>
    );
  }

  renderSubstituteLeaveFields() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;
    const { substituteLeaveType, substituteLeaveTypes } = targetRequest;

    // 「利用しない」しか選択肢がない場合は、関連フィールドを出力しない
    if (substituteLeaveTypes.length === 1) {
      return null;
    }

    const fieldsDOMList = [];

    const leaveTypeOptions = ORDER_OF_SUBSTITUTE_LEAVE_TYPES.filter(
      (leaveType) => substituteLeaveTypes.includes(leaveType)
    ).map((leaveType) => ({
      label: substituteLeaveTypeName(leaveType),
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
        break;
    }

    return fieldsDOMList;
  }

  renderSubstitutePattern() {
    const { targetRequest, selectedAttPattern } = this.props;
    const { enabledPatternApply, substituteLeaveType } = targetRequest;

    const fieldsDOMList = [];

    switch (substituteLeaveType) {
      case SUBSTITUTE_LEAVE_TYPE.Substitute:
        fieldsDOMList.push(this.renderTimeRangeField());
        break;

      default:
        if (enabledPatternApply) {
          // 勤務パターン一覧は直接入力しかない場合は表示しない
          if (!isDirectInputOnly(targetRequest)) {
            fieldsDOMList.push(this.renderSubstitutePatternCode());
          }

          if (targetRequest.patternCode === DIRECT_INPUT) {
            fieldsDOMList.push(this.renderTimeRangeField());
          } else {
            if (isFlexWithoutCore(selectedAttPattern)) {
              fieldsDOMList.push(this.renderTimeRangeField());
            } else {
              fieldsDOMList.push(
                <FormRow labelText={msg().Att_Lbl_Duration} height="thin">
                  <TimeRange
                    startTime={selectedAttPattern.startTime}
                    endTime={selectedAttPattern.endTime}
                  />
                </FormRow>
              );
            }
            selectedAttPattern.restTimes.forEach((restTime, idx) => {
              if (restTime.startTime !== null && restTime.endTime !== null) {
                fieldsDOMList.push(
                  <FormRow
                    key={idx}
                    labelText={`${msg().$Att_Lbl_CustomRest}${idx + 1}`}
                    height="thin"
                  >
                    <TimeRange
                      startTime={restTime.startTime}
                      endTime={restTime.endTime}
                    />
                  </FormRow>
                );
              }
            });
          }
        } else {
          // 表示は直接入力のみ
          fieldsDOMList.push(this.renderTimeRangeField());
        }
        break;
    }

    return fieldsDOMList;
  }

  render() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    return (
      <div>
        {this.renderOriginalTargetDateField()}

        {this.renderSubstituteLeaveFields()}

        {this.renderSubstitutePattern()}

        <FormRow labelText={msg().Att_Lbl_Remarks} height="thin">
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
