import React from 'react';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import DurationUtil from '../../../../commons/utils/DurationUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import { Dropdown, Text, TextField } from '../../../../core';

import STATUS from '../../../../domain/models/approval/request/Status';
import { isForReapply } from '../../../../domain/models/attendance/AttDailyRequest';
import { LeaveRequest } from '../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import * as AttLeave from '../../../../domain/models/attendance/AttLeave';
import {
  LeaveRange,
  ORDER_OF_RANGE_TYPES,
} from '../../../../domain/models/attendance/LeaveRange';

import AttTimeRangeField from '../fields/AttTimeRangeField';
import DateRangeField from '../fields/DateRangeField';
import RadioGroupField from '../fields/RadioGroupField';
import FormRow from './FormRow';

import './FormForLeave.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-for-leave';

const RANGE_LABEL_MAP = {
  Day: () => msg().Att_Lbl_FullDayLeave,
  AM: () => msg().Att_Lbl_FirstHalfOfDayLeave,
  PM: () => msg().Att_Lbl_SecondHalfOfDayLeave,
  Half: () => msg().Att_Lbl_HalfDayLeave,
  Time: () => msg().Att_Lbl_HourlyLeave,
};

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
  attLeaveList: AttLeave.AttLeave[];
  selectedAttLeave: AttLeave.AttLeave | null;
  onUpdateValue: (
    arg0: keyof LeaveRequest,
    arg1: LeaveRequest[keyof LeaveRequest]
  ) => void;
  onUpdateHasRange: (arg0: boolean) => void;
};

export default class FormForLeave extends React.Component<Props> {
  renderDaysLeftField() {
    const { selectedAttLeave } = this.props;

    if (!selectedAttLeave || !AttLeave.isDaysLeftManaged(selectedAttLeave)) {
      return null;
    }

    return (
      <FormRow labelText={msg().Att_Lbl_DaysLeft}>
        {DurationUtil.formatDaysAndHoursWithUnit(
          Number(selectedAttLeave.daysLeft),
          Number(selectedAttLeave.hoursLeft)
        )}
        {msg().$Att_Help_AboutLeaveDaysLeftDailyRequest}
      </FormRow>
    );
  }

  renderStartEndField() {
    const { isReadOnly, targetRequest, onUpdateValue } = this.props;

    switch (targetRequest.leaveRange) {
      case 'Day':
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
      case 'Half':
        return null;
      case 'Time': {
        const { selectedAttLeave } = this.props;

        const notices = [];
        if (selectedAttLeave && AttLeave.isDaysLeftManaged(selectedAttLeave)) {
          notices.push(msg().Att_Msg_RoundingUpNotice);
        }
        if (
          !isReadOnly ||
          targetRequest.status === STATUS.ApprovalIn ||
          targetRequest.status === STATUS.Approved
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
    const {
      isReadOnly,
      targetRequest,
      attLeaveList,
      selectedAttLeave,
      onUpdateValue,
    } = this.props;

    const LeaveTypeOptions = attLeaveList.map((leaveType) => ({
      label: leaveType.name,
      value: leaveType.code,
    }));

    const formatRangeLabel = (
      rangeKey: LeaveRange,
      selectedAttLeave: AttLeave.AttLeave | null
    ) => {
      // 年間取得制限のある時間単位休暇の場合
      if (
        rangeKey === 'Time' &&
        selectedAttLeave !== null &&
        selectedAttLeave.timeLeaveDaysLeft !== null &&
        selectedAttLeave.timeLeaveHoursLeft !== null
      ) {
        // 時間単位休(残り: x日 x時間)
        return `${RANGE_LABEL_MAP[rangeKey]()} (${
          msg().Att_Lbl_TimeLeaveDaysLeft
        }: ${DurationUtil.formatDaysAndHoursWithUnit(
          Number(selectedAttLeave.timeLeaveDaysLeft),
          Number(selectedAttLeave.timeLeaveHoursLeft)
        )})`;
      }
      return RANGE_LABEL_MAP[rangeKey]();
    };

    const rangeOptions = ORDER_OF_RANGE_TYPES.filter(
      (
        rangeType // FIXME: 「selectedAttLeave &&」は既存編集のエラー回避で、本来は不要。勤務表データ取得APIでLeaveCodeを貰えれば解決するかも？？
      ) => selectedAttLeave && selectedAttLeave.ranges.includes(rangeType) // selectedAttLeave.ranges.includes(rangeType)
    ).map((rangeKey) => {
      return {
        label: formatRangeLabel(rangeKey, selectedAttLeave),
        value: rangeKey,
      };
    });

    // 承認内容変更申請の場合には読み取り専用になるフィールドかどうか
    const isReadOnlyForReapply = isForReapply(targetRequest);

    return (
      <div>
        <FormRow labelText={msg().Att_Lbl_LeaveType}>
          <Dropdown
            options={LeaveTypeOptions}
            value={targetRequest.leaveCode}
            onSelect={(e) => onUpdateValue('leaveCode', e.value)}
            readOnly={isReadOnly || isReadOnlyForReapply}
          />
        </FormRow>

        {this.renderDaysLeftField()}

        <FormRow labelText={msg().Att_Lbl_Range}>
          {targetRequest.leaveRange &&
            (isReadOnly || isReadOnlyForReapply ? (
              <Text size="large">
                {formatRangeLabel(targetRequest.leaveRange, selectedAttLeave)}
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

        {selectedAttLeave && selectedAttLeave.requireReason ? (
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
