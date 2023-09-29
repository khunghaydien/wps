import * as React from 'react';

import classnames from 'classnames';

import Tooltip from '../../commons/components/Tooltip';
import iconSummaryDetail from '../../commons/images/iconTooltip.png';
import msg from '../../commons/languages';
import DateUtil from '../../commons/utils/DateUtil';
import TextUtil from '../../commons/utils/TextUtil';
import TimeUtil from '../../commons/utils/TimeUtil';

import {
  AttDailyAttention,
  CODE as ATT_DAILY_ATTENTION_CODE,
} from '../../domain/models/attendance/AttDailyAttention';
import DayType from '../models/DayType';
import { Record } from '../models/Record';
import {
  canShowCommuteColumn,
  COMMUTE_STATE,
  CommuteState,
  toCommuteState,
} from '@apps/domain/models/attendance/CommuteCount';

import './TimesheetSummaryContent.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-content';

export type Props = {
  records: Record[];
  attentions: {
    [key: string]: AttDailyAttention[];
  };
  restTimeTotal: number;
  realWorkTimeTotal: number;
  overTimeTotal: number;
  nightTimeTotal: number;
  virtualWorkTimeTotal: number;
  holidayWorkTimeTotal: number;
  lostTimeTotal: number;
};

const signTranslations: {
  [key: string]: string;
} = {
  [DayType.WORKDAY]: '',
  [DayType.HOLIDAY]: '◯',
  [DayType.LEGAL_HOLIDAY]: '◎',
};

const formatDate = (dateString: string): string =>
  DateUtil.getDate(dateString) === 1
    ? DateUtil.formatMDW(dateString)
    : DateUtil.formatDW(dateString);

const formatDayType = (dayType) => {
  return dayType ? signTranslations[dayType] : '';
};

const formatDuration = (durationInMinutes: number | null): string => {
  return durationInMinutes !== null ? TimeUtil.toHHmm(durationInMinutes) : '';
};

const formatTime = (timeInMinutes: number | null): string => {
  return timeInMinutes !== null ? TimeUtil.toHHmm(timeInMinutes) : '';
};

const formatDurationTotal = (
  totalInMinutes: number | null | undefined
): string => {
  return TimeUtil.toHHmm(totalInMinutes || 0);
};

export default class TimesheetSummaryContent extends React.Component<Props> {
  renderAttentions(targetDate: string) {
    const { attentions: _attentions } = this.props;
    if (!_attentions || !(targetDate in _attentions)) {
      return null;
    }

    const attentions = _attentions[targetDate];

    return (
      <div className={`${ROOT}__system-remarks`}>
        {attentions.map((attention, idx) => {
          switch (attention.code) {
            case ATT_DAILY_ATTENTION_CODE.IneffectiveWorkingTime: {
              return (
                <p key={idx}>
                  {TextUtil.template(
                    msg().Att_Msg_SummaryCommentIneffectiveWorkingTime,
                    TimeUtil.toHHmm(attention.value.fromTime),
                    TimeUtil.toHHmm(attention.value.toTime)
                  )}
                </p>
              );
            }
            case ATT_DAILY_ATTENTION_CODE.InsufficientRestTime:
              return (
                <p key={idx}>
                  {TextUtil.template(
                    msg().Att_Msg_SummaryCommentInsufficientRestTime,
                    attention.value
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

  renderRecords(showCommuteColumn: boolean) {
    const commuteCountTranslations: { [K in CommuteState]: string } = {
      [COMMUTE_STATE.UNENTERED]: msg().Att_Lbl_CommuteCountUnentered,
      [COMMUTE_STATE.NONE]: msg().Att_Lbl_CommuteCountNone,
      [COMMUTE_STATE.BOTH_WAYS]: msg().Att_Lbl_CommuteCountBothWays,
      [COMMUTE_STATE.FORWARD]: msg().Att_Lbl_CommuteCountForward,
      [COMMUTE_STATE.BACKWARD]: msg().Att_Lbl_CommuteCountBackward,
    };
    return this.props.records.map<React.ReactElement<'tr'>>((record) => (
      <tr key={record.recordDate}>
        <td className={`${ROOT}__col-date`}>{formatDate(record.recordDate)}</td>
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
          {this.renderAttentions(record.recordDate)}
        </td>
      </tr>
    ));
  }

  renderRecordTotalList(showCommuteColumn: boolean) {
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
        <caption>{msg().Att_Lbl_TimeAttendance}</caption>
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
            <th>
              {msg().Att_Lbl_Overtime}
              <Tooltip
                className={classnames(
                  `${ROOT}__tooltip`,
                  `${ROOT}__tooltip-overtime`
                )}
                align="bottom left"
                content={TextUtil.nl2br(
                  // FIXME: EXATT-847 本来はApex側で改行した文字列になっていて欲しいが時間が間に合わないのでJSで丸め込んだ。要修正。
                  `${msg().$Att_Help_AboutOvertimeAttReport1.replace(
                    /\\n/g,
                    '\n'
                  )}${msg().$Att_Help_AboutOvertimeAttReport2.replace(
                    /\\n/g,
                    '\n'
                  )}${msg().$Att_Help_AboutOvertimeAttReport3.replace(
                    /\\n/g,
                    '\n'
                  )}`
                )}
              >
                <img
                  className={`${ROOT}__tooltip-overtime-img`}
                  src={iconSummaryDetail}
                  alt={`${msg().$Att_Help_AboutOvertimeAttReport1}${
                    msg().$Att_Help_AboutOvertimeAttReport2
                  }${msg().$Att_Help_AboutOvertimeAttReport3}`}
                />
              </Tooltip>
            </th>
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
        <div className={`${ROOT}__header`} />
        {this.renderTable()}
        <div className={`${ROOT}__footer`}>
          {formatDayType(DayType.HOLIDAY)} = {msg().Att_Lbl_StatutoryHoliday},{' '}
          {formatDayType(DayType.LEGAL_HOLIDAY)} = {msg().Att_Lbl_LegalHoliday}
        </div>
      </div>
    );
  }
}
