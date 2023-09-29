import * as React from 'react';

import classnames from 'classnames';

import Button from '@apps/commons/components/buttons/Button';
import Tooltip from '@apps/commons/components/Tooltip';
import iconSummaryDetail from '@apps/commons/images/iconTooltip.png';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import { getWithinRange } from '@attendance/libraries/utils/Records';

import DayTypeSymbol from '@attendance/ui/components/DayTypeSymbol';

import * as recordHelper from '@attendance/ui/helpers/attendanceSummary/record';
import * as tableHelper from '@attendance/ui/helpers/attendanceSummary/table';
import * as attentionHelper from '@attendance/ui/helpers/attentionDailyMessages';

import './TimesheetSummaryContent.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-content';

export type Props = {
  ownerInfos: State['ownerInfos'];
  records: State['records'];
  recordTotal: State['recordTotal'];
  workingType: State['workingType'];
  onRequestOpenAllowanceWindow: (event: React.MouseEvent) => void;
  onRequestOpenObjectivelyEventLogWindow: (event: React.MouseEvent) => void;
  onRequestOpenRestReasonWindow: (event: React.MouseEvent) => void;
};

export default class TimesheetSummaryContent extends React.Component<Props> {
  renderAttentions(
    attentions: State['records'][number]['attentions']
  ): React.ReactNode {
    const messages = attentionHelper.remarks(attentions || []);
    if (!messages) {
      return null;
    }
    return (
      <div className={`${ROOT}__system-remarks`}>
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    );
  }

  renderRecords(): React.ReactNode {
    const { workingType, ownerInfos } = this.props;

    return this.props.records.map<React.ReactElement<'tr'>>((record) => {
      const ownerInfo = getWithinRange(record.recordDate, ownerInfos);

      return (
        <tr
          key={record.recordDate}
          className={classnames({
            [`${ROOT}__row--boundary`]:
              ownerInfo.startDate === record.recordDate,
          })}
        >
          <td className={`${ROOT}__col-date`}>
            {recordHelper.date(record.recordDate)}
          </td>
          <td className={`${ROOT}__col-date-sign`}>
            <DayTypeSymbol dayType={record.dayType} />
          </td>
          <td>{record.event}</td>
          <td>{record.shift}</td>
          {workingType.useAllowanceManagement ? (
            <td className={`${ROOT}__col-number`}>
              {record.allowanceDailyRecordCount === 0
                ? null
                : record.allowanceDailyRecordCount}
            </td>
          ) : null}
          {workingType.useManageCommuteCount ? (
            <td>{recordHelper.commuteState(record.commuteState)}</td>
          ) : null}
          {workingType.useObjectivelyEventLog ? (
            <td className={`${ROOT}__col-text`}>
              {record.dailyObjectiveEventLog
                ? record.dailyObjectiveEventLog
                : null}
            </td>
          ) : null}
          <td
            className={`${ROOT}__col-time${
              record.startTimeModified ? '--modified' : ''
            }`}
          >
            {recordHelper.time(record.startTime)}
          </td>
          <td
            className={`${ROOT}__col-time${
              record.endTimeModified ? '--modified' : ''
            }`}
          >
            {recordHelper.time(record.endTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.restTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.realWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.overTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.nightTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.virtualWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.holidayWorkTime)}
          </td>
          <td className={`${ROOT}__col-duration`}>
            {recordHelper.duration(record.lostTime)}
          </td>
          <td>
            {record.remarks}
            {this.renderAttentions(record.attentions)}
          </td>
        </tr>
      );
    });
  }

  renderRecordTotalList(): React.ReactNode {
    const workingType = this.props.workingType;
    return (
      <tr>
        <td
          colSpan={tableHelper.colSpanNumber(workingType, 6)}
          className={`${ROOT}__col-label`}
        >
          {msg().Att_Lbl_Total}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.restTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.realWorkTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.overTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.nightTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.virtualWorkTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.holidayWorkTime)}
        </td>
        <td className={`${ROOT}__col-duration`}>
          {recordHelper.durationTotal(this.props.recordTotal.lostTime)}
        </td>
        <td />
      </tr>
    );
  }

  renderTable(): React.ReactNode {
    const workingType = this.props.workingType;
    return (
      <table className={`${ROOT}__table`}>
        <caption>{msg().Att_Lbl_TimeAttendance}</caption>
        <thead>
          <tr>
            <th colSpan={2}>{msg().Com_Lbl_Date}</th>
            <th>{msg().Att_Lbl_RequestAndEvent}</th>
            <th>{msg().Att_Lbl_ShiftAndShortTimeWork}</th>
            {workingType.useAllowanceManagement ? (
              <th>
                <Button
                  type="text"
                  onClick={this.props.onRequestOpenAllowanceWindow}
                >
                  {msg().Att_Lbl_Allowance}
                </Button>
              </th>
            ) : null}
            {workingType.useManageCommuteCount ? (
              <th>{msg().Att_Lbl_CommuteCountCommute}</th>
            ) : null}
            {workingType.useObjectivelyEventLog ? (
              <th>
                <Button
                  type="text"
                  onClick={this.props.onRequestOpenObjectivelyEventLogWindow}
                >
                  {msg().Att_Lbl_ObjectivelyEventLog}
                </Button>
              </th>
            ) : null}
            <th>{msg().Att_Lbl_TimeIn}</th>
            <th>{msg().Att_Lbl_TimeOut}</th>
            {workingType.useRestReason ? (
              <th>
                <Button
                  type="text"
                  onClick={this.props.onRequestOpenRestReasonWindow}
                >
                  {msg().$Att_Lbl_CustomRest}
                </Button>
              </th>
            ) : (
              <th>{msg().$Att_Lbl_CustomRest}</th>
            )}
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
        <tbody>{this.renderRecords()}</tbody>
        <tfoot>
          <tr className={`${ROOT}__divider`} />
          {this.renderRecordTotalList()}
        </tfoot>
      </table>
    );
  }

  render(): React.ReactNode {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__header`} />
        {this.renderTable()}
        <div className={`${ROOT}__footer`}>
          <div className={`${ROOT}__dayTypeIcon`}>
            <DayTypeSymbol dayType={DAY_TYPE.Holiday} />
          </div>
          <div className={`${ROOT}__dayType`}>
            = {msg().Att_Lbl_StatutoryHoliday},{' '}
          </div>

          <div className={`${ROOT}__dayTypeIcon`}>
            <DayTypeSymbol dayType={DAY_TYPE.LegalHoliday} />
          </div>
          <div className={`${ROOT}__dayType`}>
            = {msg().Att_Lbl_LegalHoliday},{' '}
          </div>
          <div className={`${ROOT}__dayTypeIcon`}>
            <DayTypeSymbol dayType={DAY_TYPE.PreferredLegalHoliday} />
          </div>
          <div className={`${ROOT}__dayType`}>
            = {msg().Att_Lbl_PreferredLegalHoliday}
          </div>
        </div>
      </div>
    );
  }
}
