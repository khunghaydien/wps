import * as React from 'react';

import msg from '../../../../apps/commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import { RestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

import { date } from '@attendance/ui/helpers/attendanceSummary/record';

import './DetailList.scss';

const ROOT = 'timesheet-pc-rest-detail-list';

const formatTimeRange = (
  startTime: number | null | undefined,
  endTime: number | null | undefined
): string => {
  return typeof startTime === 'number' && typeof endTime === 'number'
    ? `${TextUtil.template(
        msg().Att_Msg_Range,
        TimeUtil.toHHmm(startTime),
        TimeUtil.toHHmm(endTime)
      )}`
    : '';
};

export type Props = {
  recordDate: string;
  dailyRestList: RestRecord[];
  mdw: boolean;
};

export default class RestReasonDetail extends React.Component<Props> {
  render() {
    return this.props.dailyRestList.length === 0
      ? null
      : this.props.dailyRestList.map((records, index) => (
          <tr key={index}>
            {index === 0 ? (
              <td
                className={`${ROOT}__date`}
                rowSpan={this.props.dailyRestList.length}
              >
                {date(this.props.recordDate, this.props.mdw)}
              </td>
            ) : null}
            <td className={`${ROOT}__rest-reason-name`}>
              {records.restReasonName}
            </td>
            <td className={`${ROOT}__rest-reason-code`}>
              {records.restReasonCode}
            </td>
            <td className={`${ROOT}__rest-start-end-time`}>
              {formatTimeRange(records.outStartTime, records.outEndTime)}
            </td>
            <td className={`${ROOT}__rest-time`}>
              {TimeUtil.toHHmm(records.outRestTime)}
            </td>
          </tr>
        ));
  }
}
