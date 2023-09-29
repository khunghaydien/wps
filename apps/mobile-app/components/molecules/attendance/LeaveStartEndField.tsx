import * as React from 'react';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import DateRangeField from '../commons/Fields/DateRangeField';

import STATUS from '../../../../domain/models/approval/request/Status';
import { LeaveRequest } from '../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { LEAVE_RANGE } from '../../../../domain/models/attendance/LeaveRange';

import AttTimeSelectRangeField from './AttTimeSelectRangeField';

import './LeaveStartEndField.scss';

const ROOT = 'mobile-app-molecules-attendance-leave-start-end-field';

export type Props = {
  testId?: string;
  request: LeaveRequest;
  isDaysLeftManaged: boolean;
  onChange: (
    key: keyof LeaveRequest,
    value: LeaveRequest[keyof LeaveRequest] | null
  ) => void;
  readOnly?: boolean;
  required?: boolean;
  errors?: string[];
};

export default class LeaveStartEndField extends React.Component<Props> {
  render() {
    switch (this.props.request.leaveRange) {
      case LEAVE_RANGE.Day:
        return (
          <div>
            <DateRangeField
              testId={`${this.props.testId || ROOT}__date-range-field`}
              label={msg().Att_Lbl_Period}
              required={this.props.required}
              start={{
                readOnly: this.props.readOnly,
                disabled: !this.props.readOnly,
                value: this.props.request.startDate,
                errors: this.props.errors,
                onChange: (_e: React.SyntheticEvent<HTMLElement>, { date }) =>
                  this.props.onChange('startDate', DateUtil.fromDate(date)),
              }}
              end={{
                readOnly: this.props.readOnly,
                value: this.props.request.endDate,
                errors: this.props.errors,
                onChange: (_e: React.SyntheticEvent<HTMLElement>, { date }) =>
                  this.props.onChange('endDate', DateUtil.fromDate(date)),
              }}
            />
          </div>
        );
      case LEAVE_RANGE.Half:
        return null;
      case LEAVE_RANGE.Time: {
        const notices = [];
        if (this.props.isDaysLeftManaged) {
          notices.push(msg().Att_Msg_RoundingUpNotice);
        }
        if (
          !this.props.readOnly ||
          this.props.request.status === STATUS.ApprovalIn ||
          this.props.request.status === STATUS.Approved
        ) {
          notices.push(msg().Att_Msg_RestInTimeLeaveRequestNotice);
        }

        return (
          <div>
            <AttTimeSelectRangeField
              required={this.props.required}
              readOnly={this.props.readOnly}
              testId={`${this.props.testId || ROOT}__att-time-range-field`}
              placeholder="(00:00)"
              errors={this.props.errors}
              from={{
                label: msg().Att_Lbl_StartTime,
                value: this.props.request.startTime,
                onChangeValue: (startTime, _endTime) =>
                  this.props.onChange('startTime', startTime),
              }}
              to={{
                label: msg().Att_Lbl_EndTime,
                value: this.props.request.endTime,
                onChangeValue: (_startTiem, endTime) =>
                  this.props.onChange('endTime', endTime),
              }}
            />
            {notices.length > 0 && (
              <ul className={`${ROOT}__duration-notice`}>
                {notices.map((notice) => (
                  <li key={`duration-notice-${notice}`}>{notice}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  }
}
