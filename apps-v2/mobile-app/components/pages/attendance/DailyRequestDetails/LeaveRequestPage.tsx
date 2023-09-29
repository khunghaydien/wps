import * as React from 'react';

import msg from '../../../../../commons/languages';
import DurationUtil from '../../../../../commons/utils/DurationUtil';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';
import ViewItem from '../../../molecules/commons/ViewItem';

import { isForReapply } from '@attendance/domain/models/AttDailyRequest';
import { LeaveRequest } from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import * as Leave from '@attendance/domain/models/Leave';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import RadioButtonGroup from '../../../atoms/RadioButtonGroup';
import LeaveStartEndField from '../../../molecules/attendance/LeaveStartEndField';
import * as helpers from '@attendance/ui/helpers/dailyRequest/leaveRequest';

import './LeaveRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-leave-request-page';

export type Props = Readonly<{
  request: LeaveRequest;
  onChange: (arg0: string, arg1: LeaveRequest[keyof LeaveRequest]) => void;
  readOnly: boolean;
  validation: {
    [key: string]: string[];
  };
}>;

const LeaveRequestPage: React.FC<Props> = ({
  request,
  onChange,
  readOnly,
  validation,
}) => {
  const selectedLeave = React.useMemo(
    () => helpers.selectedLeave(request),
    [request]
  );
  const leaveOptions = React.useMemo(
    () => helpers.leaveOptions(request),
    [request]
  );
  const leaveDetailOptions = React.useMemo(() => {
    const options = helpers.leaveDetailOptions(request);
    if (readOnly) {
      return options?.filter(({ value }) => value);
    } else {
      return options;
    }
  }, [readOnly, request]);
  const leaveRangeOptions = React.useMemo(
    () => helpers.leaveRangeOptions(request),
    [request]
  );
  const readOnlyForReapply = React.useMemo(
    () => isForReapply(request),
    [request]
  );

  return (
    <Layout>
      <div className={`${ROOT}__item`}>
        <SelectField
          label={msg().Att_Lbl_CustomLeaveType}
          options={leaveOptions}
          readOnly={readOnly || readOnlyForReapply}
          value={request.leaveCode}
          onChange={(e) => onChange('leaveCode', e.currentTarget.value)}
          required
          errors={validation.leaveCode}
        />
      </div>

      {leaveDetailOptions && (
        <div className={`${ROOT}__item`}>
          <SelectField
            label={msg().$Att_Lbl_LeaveDetail}
            options={leaveDetailOptions}
            readOnly={readOnly || readOnlyForReapply}
            value={request.leaveDetailCode}
            onChange={(e) => onChange('leaveDetailCode', e.currentTarget.value)}
            errors={validation.leaveCode}
          />
        </div>
      )}

      {Leave.isDaysLeftManaged(selectedLeave) && (
        <div className={`${ROOT}__item`}>
          <ViewItem
            label={`${msg().Att_Lbl_DaysLeft}${
              msg().$Att_Help_AboutLeaveDaysLeftDailyRequest
            }`}
          >
            {DurationUtil.formatDaysAndHoursWithUnit(
              selectedLeave.daysLeft || 0,
              selectedLeave.hoursLeft
            )}
          </ViewItem>
        </div>
      )}

      <div className={`${ROOT}__item`}>
        <RadioButtonGroup
          label={{ label: msg().Att_Lbl_Range }}
          options={leaveRangeOptions}
          value={request.leaveRange || ''}
          onChange={(e: any) => onChange('leaveRange', e.target.value)}
          readOnly={readOnly || readOnlyForReapply}
          classic
          required
        />
      </div>

      <div className={`${ROOT}__item`}>
        <LeaveStartEndField
          request={request}
          onChange={onChange}
          readOnly={readOnly}
          isDaysLeftManaged={Leave.isDaysLeftManaged(selectedLeave)}
          required
          errors={
            request.leaveRange === LEAVE_RANGE.Day
              ? validation.startDate || validation.endDate
              : validation.startTime || validation.endTime
          }
        />
      </div>

      {selectedLeave?.requireReason ? (
        <div className={`${ROOT}__item`}>
          <TextAreaField
            key="reason"
            label={msg().Att_Lbl_Reason}
            maxLength={255}
            value={request.reason}
            onChange={(e: any) => onChange('reason', e.target.value)}
            readOnly={readOnly}
            errors={validation.reason}
            required
          />
        </div>
      ) : (
        <div className={`${ROOT}__item`}>
          <TextAreaField
            key="remarks"
            label={msg().Att_Lbl_Remarks}
            maxLength={255}
            value={request.remarks}
            onChange={(e: any) => onChange('remarks', e.target.value)}
            readOnly={readOnly}
            errors={validation.remarks}
          />
        </div>
      )}
    </Layout>
  );
};

export default LeaveRequestPage;
