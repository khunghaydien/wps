import * as React from 'react';

import msg from '../../../../../commons/languages';
import DurationUtil from '../../../../../commons/utils/DurationUtil';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';
import ViewItem from '../../../molecules/commons/ViewItem';

import { isForReapply } from '../../../../../domain/models/attendance/AttDailyRequest';
import { LeaveRequest } from '../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import { AttLeave } from '../../../../../domain/models/attendance/AttLeave';
import { LEAVE_RANGE } from '../../../../../domain/models/attendance/LeaveRange';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import RadioButtonGroup from '../../../atoms/RadioButtonGroup';
import LeaveStartEndField from '../../../molecules/attendance/LeaveStartEndField';

import './LeaveRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-leave-request-page';

export type Props = Readonly<{
  request: LeaveRequest;
  leaveTypeOptions: Array<{
    label: string;
    value: string;
  }>;
  rangeOptions: Array<{
    label: string;
    value: string;
  }>;
  selectedAttLeave: AttLeave | null;
  onChange: (arg0: string, arg1: LeaveRequest[keyof LeaveRequest]) => void;
  readOnly: boolean;
  validation: {
    [key: string]: string[];
  };
}>;

export default class LeaveRequestPage extends React.Component<Props> {
  render() {
    const isReadOnlyForReapply = isForReapply(this.props.request);
    const rangeOption = this.props.rangeOptions.find(({ value }) => {
      return value === this.props.request.leaveRange;
    });

    const options =
      isReadOnlyForReapply && rangeOption
        ? [rangeOption]
        : this.props.rangeOptions;

    return (
      <Layout>
        <div className={`${ROOT}__item`}>
          <SelectField
            label={msg().Att_Lbl_LeaveType}
            options={this.props.leaveTypeOptions}
            readOnly={this.props.readOnly || isReadOnlyForReapply}
            value={this.props.request.leaveCode}
            onChange={(e) =>
              this.props.onChange('leaveCode', e.currentTarget.value)
            }
            required
            errors={this.props.validation.leaveCode}
          />
        </div>

        {this.props.selectedAttLeave &&
          this.props.selectedAttLeave.isDaysLeftManaged && (
            <div className={`${ROOT}__item`}>
              <ViewItem
                label={`${msg().Att_Lbl_DaysLeft}${
                  msg().$Att_Help_AboutLeaveDaysLeftDailyRequest
                }`}
              >
                {DurationUtil.formatDaysAndHoursWithUnit(
                  this.props.selectedAttLeave.daysLeft || 0,
                  this.props.selectedAttLeave.hoursLeft
                )}
              </ViewItem>
            </div>
          )}

        <div className={`${ROOT}__item`}>
          <RadioButtonGroup
            label={{ label: msg().Att_Lbl_Range }}
            options={options}
            value={this.props.request.leaveRange || ''}
            onChange={(e: any) =>
              this.props.onChange('leaveRange', e.target.value)
            }
            readOnly={this.props.readOnly || isReadOnlyForReapply}
            classic
            required
          />
        </div>

        <div className={`${ROOT}__item`}>
          <LeaveStartEndField
            request={this.props.request}
            onChange={this.props.onChange}
            readOnly={this.props.readOnly}
            isDaysLeftManaged={
              this.props.selectedAttLeave !== null &&
              this.props.selectedAttLeave.isDaysLeftManaged
            }
            required
            errors={
              this.props.request.leaveRange === LEAVE_RANGE.Day
                ? this.props.validation.startDate ||
                  this.props.validation.endDate
                : this.props.validation.startTime ||
                  this.props.validation.endTime
            }
          />
        </div>

        {this.props.request.requireReason ? (
          <div className={`${ROOT}__item`}>
            <TextAreaField
              key="reason"
              label={msg().Att_Lbl_Reason}
              maxLength={255}
              value={this.props.request.reason}
              onChange={(e: any) =>
                this.props.onChange('reason', e.target.value)
              }
              readOnly={this.props.readOnly}
              errors={this.props.validation.reason}
              required
            />
          </div>
        ) : (
          <div className={`${ROOT}__item`}>
            <TextAreaField
              key="remarks"
              label={msg().Att_Lbl_Remarks}
              maxLength={255}
              value={this.props.request.remarks}
              onChange={(e: any) =>
                this.props.onChange('remarks', e.target.value)
              }
              readOnly={this.props.readOnly}
              errors={this.props.validation.remarks}
            />
          </div>
        )}
      </Layout>
    );
  }
}
