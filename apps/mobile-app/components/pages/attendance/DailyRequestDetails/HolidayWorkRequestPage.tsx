import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import SFDateField from '../../../molecules/commons/Fields/SFDateField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { isForReapply } from '../../../../../domain/models/attendance/AttDailyRequest';
import { HolidayWorkRequest } from '../../../../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import { SUBSTITUTE_LEAVE_TYPE } from '../../../../../domain/models/attendance/SubstituteLeaveType';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import RadioButtonGroup from '../../../atoms/RadioButtonGroup';
import AttTimeSelectRangeField from '../../../molecules/attendance/AttTimeSelectRangeField';

import './HolidayWorkRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-holiday-work-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: HolidayWorkRequest;
  typeOptions: Array<{
    label: string;
    value: string;
  }>;
  onChangeStartTime: (arg0: number | null, arg1: number | null) => void;
  onChangeEndTime: (arg0: number | null, arg1: number | null) => void;
  onChangeStartDate: (arg0: string) => void;
  onChangeSubstituteLeaveType: (arg0: string) => void;
  onChangeSubstituteDate: (arg0: string) => void;
  onChangeRemarks: (arg0: string) => void;
  validation: {
    [key: string]: string[];
  };
}>;

export default class HolidayWorkRequestPage extends React.Component<Props> {
  render() {
    const {
      readOnly,
      request,
      onChangeStartDate,
      onChangeStartTime,
      onChangeEndTime,
      onChangeRemarks,
    } = this.props;

    const isReapplying = isForReapply(request);

    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__item`}>
            <SFDateField
              readOnly={readOnly}
              disabled={!readOnly && !isReapplying}
              required
              label={msg().Att_Lbl_HolidayWorkDate}
              value={request.startDate}
              onChange={(e: React.ChangeEvent<HTMLElement>, { date }) =>
                onChangeStartDate(DateUtil.fromDate(date))
              }
              errors={this.props.validation.startDate}
            />
          </div>
          <div className={`${ROOT}__item`}>
            <AttTimeSelectRangeField
              className={`${ROOT}__time-range`}
              readOnly={readOnly}
              errors={
                this.props.validation.startTime || this.props.validation.endTime
              }
              required
              placeholder="(00:00)"
              from={{
                label: msg().Att_Lbl_StartTime,
                value: request.startTime,
                onChangeValue: onChangeStartTime,
              }}
              to={{
                label: msg().Att_Lbl_EndTime,
                value: request.endTime,
                onChangeValue: onChangeEndTime,
              }}
            />
          </div>
          <div className={`${ROOT}__item`}>
            <RadioButtonGroup
              label={{ label: msg().Att_Lbl_ReplacementDayOff }}
              options={this.props.typeOptions}
              value={this.props.request.substituteLeaveType || ''}
              onChange={(e: any) =>
                this.props.onChangeSubstituteLeaveType(e.target.value)
              }
              readOnly={this.props.readOnly}
              classic
            />
          </div>
          {this.props.request.substituteLeaveType ===
            SUBSTITUTE_LEAVE_TYPE.Substitute && (
            <div className={`${ROOT}__item`}>
              <SFDateField
                readOnly={readOnly}
                required
                label={msg().Att_Lbl_ScheduledDateOfSubstitute}
                value={this.props.request.substituteDate || ''}
                onChange={(e: React.ChangeEvent<HTMLElement>, { date }) =>
                  this.props.onChangeSubstituteDate(DateUtil.fromDate(date))
                }
                errors={this.props.validation.substituteDate}
              />
            </div>
          )}
          <div className={`${ROOT}__item`}>
            <TextAreaField
              className={`${ROOT}__remarks`}
              label={msg().Att_Lbl_Remarks}
              rows={3}
              value={request.remarks}
              onChange={(event: React.SyntheticEvent<HTMLTextAreaElement>) =>
                onChangeRemarks(event.currentTarget.value)
              }
              readOnly={readOnly}
            />
          </div>
        </Layout>
      </div>
    );
  }
}
