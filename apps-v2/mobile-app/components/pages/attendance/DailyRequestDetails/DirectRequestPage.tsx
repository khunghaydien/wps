import * as React from 'react';

import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import DateRangeField from '../../../molecules/commons/Fields/DateRangeField';
import TextAreaField from '../../../molecules/commons/Fields/TextAreaField';

import {
  DirectRequest,
  RestTime,
  RestTimes,
} from '@mobile/modules/attendance/dailyRequest/ui/requests/directRequest';

import Layout from '../../../../containers/organisms/attendance/DailyRequestDetailLayoutContainer';

import AttTimeList from '../../../organisms/attendance/AttTimeList';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

import './DirectRequestPage.scss';

const createRestTimesFactory = $createRestTimesFactory();

const ROOT =
  'mobile-app-pages-attendance-daily-request-details-direct-request-page';

export type Props = Readonly<{
  readOnly: boolean;
  request: DirectRequest;
  validation: {
    [key: string]: string[];
  };
  minRestTimesCount?: number;
  maxRestTimesCount?: number;
  onChangeStartDate: (arg0: string) => void;
  onChangeEndDate: (arg0: string) => void;
  onChangeStartTime: (arg0: number | null) => void;
  onChangeEndTime: (arg0: number | null) => void;
  onChangeRestTime: (index: number, value: RestTime | null) => void;
  onClickRemoveRestTime: (index: number) => void;
  onClickAddRestTime: () => void;
  onChangeRemarks: (arg0: string) => void;
}>;

export default class DirectRequestPage extends React.Component<Props> {
  RestTimesFactory = () => createRestTimesFactory();

  render() {
    const {
      readOnly,
      request,
      validation,
      minRestTimesCount,
      maxRestTimesCount,
      onChangeStartDate,
      onChangeEndDate,
      onChangeStartTime,
      onChangeEndTime,
      onChangeRestTime,
      onClickAddRestTime,
      onClickRemoveRestTime,
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
              }}
              end={{
                readOnly,
                value: request.endDate,
                onChange: (e: React.ChangeEvent<HTMLElement>, { date }) =>
                  onChangeEndDate(DateUtil.fromDate(date)),
              }}
              required
            />
          </div>
          <AttTimeList
            className={`${ROOT}__att-time-list`}
            readOnly={readOnly}
            workingTime={{
              placeholder: '(00:00)',
              from: {
                value: request.startTime,
                onChangeValue: (from, _to) => onChangeStartTime(from),
                required: true,
              },
              to: {
                value: request.endTime,
                onChangeValue: (_from, to) => onChangeEndTime(to),
                required: true,
              },
              errors: validation.startTime || validation.endTime,
            }}
            restTimes={{
              placeholder: '(00:00)',
              value:
                readOnly && request.directApplyRestTimes.length < 1
                  ? (this.RestTimesFactory().filter(
                      request.directApplyRestTimes
                    ) as unknown as RestTimes)
                  : request.directApplyRestTimes,
              min: minRestTimesCount,
              max: maxRestTimesCount,
              onChangeValue: onChangeRestTime,
              onClickAdd: onClickAddRestTime,
              onClickRemove: onClickRemoveRestTime,
            }}
          />
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
