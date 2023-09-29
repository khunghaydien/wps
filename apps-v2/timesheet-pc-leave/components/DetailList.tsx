import * as React from 'react';

import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';
import TimeUtil from '../../commons/utils/TimeUtil';

import { LeaveDetail, LeaveRange } from '../models/types';

import './DetailList.scss';

const ROOT = 'timesheet-pc-leave-detail-list';

const formatDate = (startDate: string, endDate: string): string => {
  return (
    DateUtil.formatYMD(startDate) +
    (startDate !== endDate ? ` – ${DateUtil.formatYMD(endDate)}` : '')
  );
};

const formatDays = (
  range: LeaveRange,
  days: number | null | undefined,
  leaveTime: number | null | undefined
): string => {
  if (range === 'Time') {
    return leaveTime !== null ? TimeUtil.toHHmm(leaveTime) : '';
  }

  return days !== null && days !== undefined
    ? DateUtil.formatDaysWithUnit(days)
    : '';
};

export type Props = {
  leaveDetails: LeaveDetail[];
};

export default class DetailList extends React.Component<Props> {
  renderDetailList() {
    return this.props.leaveDetails.map<React.ReactElement<'tr'>>((detail) => (
      <tr key={detail.requestId}>
        <td className={`${ROOT}__date`}>
          {formatDate(detail.startDate, detail.endDate)}
        </td>
        <td className={`${ROOT}__leave-type`}>{detail.name}</td>
        <td className={`${ROOT}__leave-duration`}>
          {formatDays(detail.range, detail.days, detail.leaveTime)}
        </td>
        <td className={`${ROOT}__remarks`}>{detail.remarks}</td>
      </tr>
    ));
  }

  render() {
    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          <caption>{msg().Att_Lbl_LeaveTakenDetails}</caption>
          <thead>
            <tr>
              <th>{msg().Com_Lbl_Date}</th>
              <th>{msg().Att_Lbl_LeaveType}</th>
              <th>{msg().Att_Lbl_LeaveDays}</th>
              <th>{msg().Com_Lbl_Remarks}</th>
            </tr>
          </thead>
          <tbody>{this.renderDetailList()}</tbody>
        </table>
      </div>
    );
  }
}
