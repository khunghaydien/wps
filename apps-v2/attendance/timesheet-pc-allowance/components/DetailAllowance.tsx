import * as React from 'react';

import msg from '../../../../apps/commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import TextUtil from '../../../commons/utils/TextUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import { AllowanceRecord } from '../models/types';

import './DetailList.scss';

const ROOT = 'timesheet-pc-allowance-detail-list';

const formatDate = (recordDate: string): string => {
  return DateUtil.formatYMD(recordDate);
};

const formatTotalTime = (totalTime: number | null | undefined): string => {
  return TimeUtil.toHHmm(totalTime);
};

const formatTimeRange = (
  startTime: number | null | undefined,
  endTime: number | null | undefined
): string => {
  return (startTime !== null && startTime !== undefined) ||
    (endTime !== null && endTime !== undefined)
    ? `${TextUtil.template(
        msg().Att_Msg_Range,
        TimeUtil.toHHmm(startTime),
        TimeUtil.toHHmm(endTime)
      )}`
    : '';
};

export type Props = {
  recordDate: string;
  dailyAllowanceList: AllowanceRecord[];
};

export default class AllowanceDetail extends React.Component<Props> {
  render() {
    return this.props.dailyAllowanceList.length === 0
      ? null
      : this.props.dailyAllowanceList.map((_records, _index) => (
          <tr key={_index}>
            {_index === 0 ? (
              <td
                className={`${ROOT}__date`}
                rowSpan={this.props.dailyAllowanceList.length}
              >
                {formatDate(this.props.recordDate)}
              </td>
            ) : null}
            <td className={`${ROOT}__allowance-name`}>
              {_records.allowanceName}
            </td>
            <td className={`${ROOT}__allowance-code`}>
              {_records.allowanceCode}
            </td>
            <td className={`${ROOT}__allowance-total-time`}>
              {_records.managementType === 'Hours' ||
              _records.managementType === 'StartEndTime'
                ? formatTotalTime(_records.totalTime)
                : null}
            </td>
            <td className={`${ROOT}__allowance-start-end-time`}>
              {_records.managementType === 'StartEndTime'
                ? formatTimeRange(_records.startTime, _records.endTime)
                : null}
            </td>
            <td className={`${ROOT}__quantity`}>
              {_records.managementType === 'Quantity'
                ? _records.quantity
                : null}
            </td>
          </tr>
        ));
  }
}
