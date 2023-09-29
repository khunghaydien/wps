import React from 'react';

import iconAttentions from '../../../../commons/images/iconAttention.png';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import TextUtil from '../../../../commons/utils/TextUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import { CODE as ATT_DAILY_ATTENTION_CODE } from '../../../../domain/models/attendance/AttDailyAttention';
// Use DayType from timesheet-pc-summary
// This is temporary fix. I don't think it's good idea to share this component.
import DayType from '../../../../timesheet-pc-summary/models/DayType';
import {
  canShowCommuteColumn,
  COMMUTE_STATE,
  CommuteState,
  toCommuteState,
} from '@apps/domain/models/attendance/CommuteCount';

import './RecordTable.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail-record-table';

const signTranslations = {
  [DayType.WORKDAY]: '',
  [DayType.HOLIDAY]: '◯',
  [DayType.LEGAL_HOLIDAY]: '◎',
};

const formatDate = (dateString) =>
  DateUtil.getDate(dateString) === 1
    ? DateUtil.formatMDW(dateString)
    : DateUtil.formatDW(dateString);

const formatDayType = (dayType) => {
  return dayType ? signTranslations[dayType] : '';
};

const formatDuration = (durationInMinutes) => {
  return durationInMinutes !== null ? TimeUtil.toHHmm(durationInMinutes) : '';
};

const formatTime = (timeInMinutes) => {
  return timeInMinutes !== null ? TimeUtil.toHHmm(timeInMinutes) : '';
};

const formatDurationTotal = (totalInMinutes) => {
  return TimeUtil.toHHmm(totalInMinutes || 0);
};
type Props = {
  records: Array<any>;
  attentions: Record<string, any>;
  restTimeTotal: number;
  realWorkTimeTotal: number;
  overTimeTotal: number;
  nightTimeTotal: number;
  lostTimeTotal: number;
  virtualWorkTimeTotal: number;
  holidayWorkTimeTotal: number;
};
export default class RecordTable extends React.Component<Props> {
  renderAttentions(attentions) {
    if (!attentions.length) {
      return '';
    }
    return (
      <div className={`${ROOT}__system-remarks`}>
        {attentions.map((attention, idx) => {
          const { code, value } = attention;
          switch (code) {
            case ATT_DAILY_ATTENTION_CODE.IneffectiveWorkingTime:
              return (
                <p key={idx}>
                  {TextUtil.template(
                    msg().Att_Msg_SummaryCommentIneffectiveWorkingTime,
                    TimeUtil.toHHmm(value.fromTime),
                    TimeUtil.toHHmm(value.toTime)
                  )}
                </p>
              );
            case ATT_DAILY_ATTENTION_CODE.InsufficientRestTime:
              return (
                <p key={idx}>
                  {TextUtil.template(
                    msg().Att_Msg_SummaryCommentInsufficientRestTime,
                    value
                  )}
                </p>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }

  renderRecords(showCommuteColumn) {
    const commuteCountTranslations: { [K in CommuteState]: string } = {
      [COMMUTE_STATE.UNENTERED]: msg().Att_Lbl_CommuteCountUnentered,
      [COMMUTE_STATE.NONE]: msg().Att_Lbl_CommuteCountNone,
      [COMMUTE_STATE.BOTH_WAYS]: msg().Att_Lbl_CommuteCountBothWays,
      [COMMUTE_STATE.FORWARD]: msg().Att_Lbl_CommuteCountForward,
      [COMMUTE_STATE.BACKWARD]: msg().Att_Lbl_CommuteCountBackward,
    };
    return this.props.records.map((record) => {
      const attentions = this.props.attentions[record.recordDate];
      return (
        <tr key={record.recordDate}>
          <td className={`${ROOT}__col-date`}>
            <div className={`${ROOT}__col-date-container`}>
              <div className={`${ROOT}__col-date-icon`}>
                {!!attentions.length && (
                  <img
                    src={iconAttentions}
                    title={msg().Appr_Msg_DailyAttentionTitle}
                  />
                )}
              </div>
              <div className={`${ROOT}__col-date-date`}>
                {formatDate(record.recordDate)}
              </div>
            </div>
          </td>
          <td className={`${ROOT}__col-date-sign`}>
            {formatDayType(record.dayType)}
          </td>
          <td>{record.event}</td>
          <td>{record.shift}</td>
          {showCommuteColumn ? (
            <td>
              {
                commuteCountTranslations[
                  toCommuteState(
                    record.commuteCountForward,
                    record.commuteCountBackward
                  )
                ]
              }
            </td>
          ) : null}
          <td
            className={`${ROOT}__col-time${
              record.startTimeModified ? '--modified' : ''
            }`}
          >
            {formatTime(record.startTime)}
          </td>
          <td
            className={`${ROOT}__col-time${
              record.endTimeModified ? '--modified' : ''
            }`}
          >
            {formatTime(record.endTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.restTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.realWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.overTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.nightTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.virtualWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.holidayWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {formatDuration(record.lostTime)}
          </td>
          <td>
            {record.remarks}
            {this.renderAttentions(attentions)}
          </td>
        </tr>
      );
    });
  }

  renderRecordTotalList(showCommuteColumn) {
    return (
      <tr>
        <td
          colSpan={showCommuteColumn ? 7 : 6}
          className={`${ROOT}__col-label`}
        >
          {msg().Att_Lbl_Total}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.restTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.realWorkTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.overTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.nightTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.virtualWorkTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.holidayWorkTimeTotal)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {formatDurationTotal(this.props.lostTimeTotal)}
        </td>
        <td />
      </tr>
    );
  }

  renderTable() {
    const showCommuteColumn = canShowCommuteColumn(this.props.records);
    return (
      <table className={`${ROOT}__table`}>
        <thead>
          <tr>
            <th colSpan={2}>{msg().Com_Lbl_Date}</th>
            <th>{msg().Att_Lbl_RequestAndEvent}</th>
            <th>{msg().Att_Lbl_ShiftAndShortTimeWork}</th>
            {showCommuteColumn ? (
              <th>{msg().Att_Lbl_CommuteCountCommute}</th>
            ) : null}
            <th>{msg().Att_Lbl_TimeIn}</th>
            <th>{msg().Att_Lbl_TimeOut}</th>
            <th>{msg().Att_Lbl_Rest}</th>
            <th>{msg().Att_Lbl_ActualWork}</th>
            <th>{msg().Att_Lbl_Overtime}</th>
            <th>{msg().Att_Lbl_LateNight}</th>
            <th>{msg().Att_Lbl_DailyVirtualWorkTime}</th>
            <th>{msg().Att_Lbl_HolidayWorkTime}</th>
            <th>{msg().Att_Lbl_Deducted}</th>
            <th>{msg().Att_Lbl_Remarks}</th>
          </tr>
        </thead>
        <tbody>{this.renderRecords(showCommuteColumn)}</tbody>
        <tfoot>
          <tr className={`${ROOT}__divider`} />
          {this.renderRecordTotalList(showCommuteColumn)}
        </tfoot>
      </table>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        {this.renderTable()}
        <div className={`${ROOT}__footer`}>
          {formatDayType(DayType.HOLIDAY)} = {msg().Att_Lbl_StatutoryHoliday},{' '}
          {formatDayType(DayType.LEGAL_HOLIDAY)} = {msg().Att_Lbl_LegalHoliday}
        </div>
      </div>
    );
  }
}
