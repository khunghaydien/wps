import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import DateRangeField from '../../../molecules/commons/Fields/DateRangeField';
import SelectField from '../../../molecules/commons/Fields/SelectField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import { PatternRequest } from '../../../../../domain/models/attendance/AttDailyRequest/PatternRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import AttTimeSelectRangeField from '../../../molecules/attendance/AttTimeSelectRangeField';

import './PatternRequestPage.scss';

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-pattern-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: PatternRequest;
  validation: {
    [key: string]: string[];
  };
  patternOptions: {
    label: string;
    value: string;
  }[];
  onChangeStartDate: (arg0: string) => void;
  onChangeEndDate: (arg0: string) => void;
  onChangePatternCode: (arg0: string) => void;
  onChangeRemarks: (arg0: string) => void;
}>;

export default class PatternRequestPage extends React.Component<Props> {
  render() {
    const {
      readOnly,
      request,
      validation,
      patternOptions,
      onChangeStartDate,
      onChangeEndDate,
      onChangePatternCode,
      onChangeRemarks,
    } = this.props;

    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__item`}>
            <DateRangeField
              label={msg().Att_Lbl_Period}
              start={{
                readOnly,
                disabled: !readOnly,
                value: request.startDate,
                onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onChangeStartDate(DateUtil.fromDate(date)),
                errors: validation.startDate,
              }}
              end={{
                readOnly,
                value: request.endDate,
                onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onChangeEndDate(DateUtil.fromDate(date)),
                errors: validation.endDate,
              }}
              required
            />
          </div>
          <div className={`${ROOT}__item`}>
            <SelectField
              className={`${ROOT}__patterns`}
              label={msg().Att_Lbl_AttPattern}
              options={patternOptions || []}
              readOnly={readOnly}
              value={request.patternCode}
              onChange={(e) => onChangePatternCode(e.currentTarget.value)}
              errors={validation.patternCode}
              required
            />
          </div>
          <div className={`${ROOT}__item`}>
            <AttTimeSelectRangeField
              className={`${ROOT}__times`}
              from={{
                label: msg().Admin_Lbl_WorkingTypeStartTime,
                value: request.startTime,
              }}
              to={{
                label: msg().Admin_Lbl_WorkingTypeEndTime,
                value: request.endTime,
              }}
              readOnly={readOnly}
              disabled={!readOnly}
            />
          </div>
          {request.patternRestTimes &&
            request.patternRestTimes.map((restTime, idx: number) => (
              <div key={idx} className={`${ROOT}__item`}>
                <AttTimeSelectRangeField
                  className={`${ROOT}__times`}
                  label={`${msg().Admin_Lbl_WorkingTypeRest}${idx + 1}`}
                  from={{
                    value: restTime.startTime,
                  }}
                  to={{
                    value: restTime.endTime,
                  }}
                  readOnly={readOnly}
                  disabled={!readOnly}
                />
              </div>
            ))}
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
              errors={validation.remarks}
            />
          </div>
        </Layout>
      </div>
    );
  }
}
