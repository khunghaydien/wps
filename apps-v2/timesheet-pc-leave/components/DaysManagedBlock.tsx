import React from 'react';

import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';
import DurationUtil from '../../commons/utils/DurationUtil';

import { DaysManagedLeave, GrantedAndTaken } from '../models/types';

import './DaysManagedBlock.scss';

const ROOT = 'timesheet-pc-leave-days-managed-block';

const ListRow = (grantedAndTaken: GrantedAndTaken, idx) => (
  <tr key={`grantedAndTaken${idx}`}>
    <td className={`${ROOT}__col-valid-date-from`}>
      {DateUtil.formatYMD(grantedAndTaken.validDateFrom)}
    </td>
    <td className={`${ROOT}__col-valid-date-to`}>
      {DateUtil.formatYMD(grantedAndTaken.validDateTo)}
    </td>
    <td className={`${ROOT}__col-days-granted`}>
      {DurationUtil.formatDaysAndHoursWithUnit(grantedAndTaken.daysGranted)}
    </td>
    <td className={`${ROOT}__col-days-taken`}>
      {DurationUtil.formatDaysAndHoursWithUnit(
        grantedAndTaken.daysTaken,
        grantedAndTaken.hoursTaken
      )}
    </td>
    <td className={`${ROOT}__col-days-left`}>
      {DurationUtil.formatDaysAndHoursWithUnit(
        grantedAndTaken.daysLeft,
        grantedAndTaken.hoursLeft
      )}
    </td>
    <td className={`${ROOT}__col-comment`}>{grantedAndTaken.comment}</td>
  </tr>
);

export type Props = {
  daysManagedLeave: DaysManagedLeave;
  isWithoutLeaveName: boolean;
};

export default class DaysManagedBlock extends React.Component<Props> {
  static defaultProps = {
    isWithoutLeaveName: false,
  };

  render() {
    const { daysManagedLeave, isWithoutLeaveName } = this.props;

    if (!daysManagedLeave) {
      return null;
    }

    const {
      leaveName,
      grants,
      daysGrantedTotal,
      daysTakenTotal,
      hoursTakenTotal,
      daysLeftTotal,
      hoursLeftTotal,
    } = daysManagedLeave;

    return (
      <div className={ROOT}>
        <table className={`${ROOT}__table`}>
          {isWithoutLeaveName || leaveName === null ? null : (
            <caption>{`\u00b7 ${leaveName || ''}`}</caption>
          )}
          <thead>
            <tr>
              <th className={`${ROOT}__col-valid-date-from`}>
                {msg().Att_Lbl_DaysManagedValidDateFrom}
              </th>
              <th className={`${ROOT}__col-valid-date-to`}>
                {msg().Att_Lbl_DaysManagedValidDateTo}
              </th>
              <th className={`${ROOT}__col-days-granted`}>
                {msg().Att_Lbl_DaysManagedDaysGranted}
              </th>
              <th className={`${ROOT}__col-days-taken`}>
                {msg().Att_Lbl_DaysManagedDaysTaken}
              </th>
              <th className={`${ROOT}__col-days-left`}>
                {msg().Att_Lbl_DaysManagedDaysLeft}
              </th>
              <th className={`${ROOT}__col-comment`}>
                {msg().Att_Lbl_Remarks}
              </th>
            </tr>
          </thead>
          <tbody>{(grants || []).map(ListRow)}</tbody>
          <tfoot>
            <tr>
              <th colSpan={2}>{msg().Att_Lbl_Total}</th>
              <td className={`${ROOT}__col-days-granted`}>
                {DurationUtil.formatDaysAndHoursWithUnit(daysGrantedTotal)}
              </td>
              <td className={`${ROOT}__col-days-taken`}>
                {DurationUtil.formatDaysAndHoursWithUnit(
                  daysTakenTotal,
                  hoursTakenTotal
                )}
              </td>
              <td className={`${ROOT}__col-days-left`}>
                {DurationUtil.formatDaysAndHoursWithUnit(
                  daysLeftTotal,
                  hoursLeftTotal
                )}
              </td>
              <td className={`${ROOT}__col-comment`} />
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}
