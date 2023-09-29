import React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import DurationUtil from '../../../../../commons/utils/DurationUtil';
import TimeUtil from '../../../../../commons/utils/TimeUtil';
import { Dropdown, Text, TextField } from '../../../../../core';

import {
  isForReapply,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import * as Leave from '@attendance/domain/models/Leave';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import DateRangeField from '../fields/DateRangeField';
import RadioGroupField from '../fields/RadioGroupField';
import FormRow from './FormRow';
import * as helpers from '@attendance/ui/helpers/dailyRequest/leaveRequest';

import './FormForLeave.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-leave';

const FieldNoticeItem = (notice: string) => (
  <li key={`duration-notice-${notice}`}>
    <Text size="large" color="secondary">
      {notice}
    </Text>
  </li>
);

type Props = {
  isReadOnly: boolean;
  hasRange: boolean;
  targetRequest: LeaveRequest;
  onUpdateValue: (
    arg0: keyof LeaveRequest,
    arg1: LeaveRequest[keyof LeaveRequest]
  ) => void;
  onUpdateHasRange: (arg0: boolean) => void;
};

export default class FormForLeave extends React.Component<Props> {
  renderDaysLeftField() {
    const selectedLeave = helpers.selectedLeave(this.props.targetRequest);

    if (!Leave.isDaysLeftManaged(selectedLeave)) {
      return null;
    }

    return (
      <FormRow labelText={msg().Att_Lbl_DaysLeft} height="thin">
        {DurationUtil.formatDaysAndHoursWithUnit(
          Number(selectedLeave.daysLeft),
          Number(selectedLeave.hoursLeft)
        )}
        {msg().$Att_Help_AboutLeaveDaysLeftDailyRequest}
      </FormRow>
    );
  }

  renderStartEndField() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    switch (targetRequest.leaveRange) {
      case LEAVE_RANGE.Day:
        const { hasRange, onUpdateHasRange } = this.props;
        const minOfEndDate = DateUtil.addDays(targetRequest.startDate, 1);
        return (
          <FormRow labelText={msg().Att_Lbl_Period}>
            <DateRangeField
              startDateFieldProps={{
                disabled: true,
                showsIcon: false,
                value: targetRequest.startDate,
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
        );
      case LEAVE_RANGE.Time: {
        const selectedLeave = helpers.selectedLeave(this.props.targetRequest);

        const notices = [];
        if (Leave.isDaysLeftManaged(selectedLeave)) {
          notices.push(msg().Att_Msg_RoundingUpNotice);
        }
        if (
          !isReadOnly ||
          targetRequest.status === STATUS.APPROVAL_IN ||
          targetRequest.status === STATUS.APPROVED
        ) {
          notices.push(msg().Att_Msg_RestInTimeLeaveRequestNotice);
        }

        return (
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

            {notices.length > 0 && (
              <ul className={`${ROOT}__duration-notice`}>
                {notices.map(FieldNoticeItem)}
              </ul>
            )}
          </FormRow>
        );
      }

      default:
        return null;
    }
  }

  render() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    const selectedLeave = helpers.selectedLeave(targetRequest);

    const leaveTypeOptions = helpers.leaveOptions(targetRequest);

    const leaveDetailOptions = helpers.leaveDetailOptions(targetRequest);

    const rangeOptions = helpers.leaveRangeOptions(targetRequest);

    // 承認内容変更申請の場合には読み取り専用になるフィールドかどうか
    const isReadOnlyForReapply = isForReapply(targetRequest);

    return (
      <div>
        <FormRow labelText={msg().Att_Lbl_CustomLeaveType}>
          <Dropdown
            options={leaveTypeOptions}
            value={targetRequest.leaveCode}
            onSelect={(e) => onUpdateValue('leaveCode', e.value)}
            readOnly={isReadOnly || isReadOnlyForReapply}
          />
        </FormRow>

        {leaveDetailOptions && (
          <FormRow labelText={msg().$Att_Lbl_LeaveDetail}>
            <Dropdown
              options={leaveDetailOptions}
              value={targetRequest.leaveDetailCode}
              onSelect={(e) => onUpdateValue('leaveDetailCode', e.value)}
              readOnly={isReadOnly || isReadOnlyForReapply}
            />
          </FormRow>
        )}

        {this.renderDaysLeftField()}

        <FormRow labelText={msg().Att_Lbl_Range} height="thin">
          {targetRequest.leaveRange &&
            (isReadOnly || isReadOnlyForReapply ? (
              <Text size="large">
                {
                  rangeOptions?.find(
                    ({ value }) => targetRequest.leaveRange === value
                  )?.label
                }
              </Text>
            ) : (
              <RadioGroupField
                options={rangeOptions}
                value={targetRequest.leaveRange}
                onChange={(e) =>
                  onUpdateValue('leaveRange', e.currentTarget.value)
                }
              />
            ))}
        </FormRow>

        {this.renderStartEndField()}

        {selectedLeave?.requireReason ? (
          <FormRow labelText={msg().Att_Lbl_Reason}>
            <TextField
              maxLength={255}
              minRows={3}
              value={targetRequest.reason || ''}
              onChange={(e) => onUpdateValue('reason', e.target.value)}
              disabled={isReadOnly}
              required
            />
          </FormRow>
        ) : (
          <FormRow labelText={msg().Att_Lbl_Remarks}>
            <TextField
              maxLength={255}
              minRows={3}
              value={targetRequest.remarks || ''}
              onChange={(e) => onUpdateValue('remarks', e.target.value)}
              readOnly={isReadOnly}
            />
          </FormRow>
        )}
      </div>
    );
  }
}
