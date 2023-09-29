import React from 'react';

import classNames from 'classnames';

import iconAttentions from '@apps/commons/images/iconAttention.png';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import { CheckBox } from '@apps/core';

import {
  AttendanceSummaryViewModel,
  DailyRecord,
} from '@apps/approvals-pc/models/attendance/AttendanceSummaryViewModel';
import {
  LAYOUT_ITEM_TYPE,
  LAYOUT_ITEM_VIEW_TYPE,
  LayoutDailyValuesViewModel,
  LayoutItemNumberValue,
  LayoutItemValueViewModel,
  LayoutItemViewModel,
} from '@apps/approvals-pc/models/attendance/DailyRecordDisplayFieldLayoutTableViewModel';

import DayTypeSymbol from '@apps/attendance/ui/components/DayTypeSymbol';

import * as recordHelper from '@attendance/ui/helpers/attendanceSummary/record';
import * as tableHelper from '@attendance/ui/helpers/attendanceSummary/table';
import * as attentionHelper from '@attendance/ui/helpers/attentionDailyMessages';

import './RecordTable.scss';

// 使用する Property 以外は除外してテスト時に不要な Property を使わなくても良いようにしています。
type PickedAttendanceSummary = Pick<
  AttendanceSummaryViewModel,
  'records' | 'recordTotal' | 'workingType' | 'displayFieldLayout'
>;

const ROOT = 'approvals-pc-attendance-record-table';

const getDisplayValue = (
  item: LayoutItemViewModel,
  itemValue: LayoutItemValueViewModel
): string | React.ReactNode => {
  const { type } = item;
  const { value, existing } = itemValue;
  if (!existing) {
    return null;
  }
  switch (type) {
    case LAYOUT_ITEM_TYPE.DATE:
      return DateUtil.formatYMD(value?.value as string);
    case LAYOUT_ITEM_TYPE.NUMBER: {
      const { viewType } = item;
      if (viewType && viewType === LAYOUT_ITEM_VIEW_TYPE.ATT_TIME) {
        return TimeUtil.toHHmm(value?.value as string);
      }
      return (value as LayoutItemNumberValue)?.textValue;
    }
    case LAYOUT_ITEM_TYPE.STRING: {
      if (item.pickList) {
        return item.pickList.filter((item) => item.value === value?.value)[0]
          ?.label;
      }
      return value?.value as string;
    }
    case LAYOUT_ITEM_TYPE.BOOLEAN:
      return <CheckBox disabled checked={value?.value as boolean} />;
    default:
      return value?.value as string;
  }
};

const Header: React.FC<
  PickedAttendanceSummary['workingType'] & {
    layoutHead: LayoutItemViewModel[];
  }
> = ({
  useAllowanceManagement: useAllowance,
  useManageCommuteCount,
  useObjectivelyEventLog,
  layoutHead,
}) => (
  <thead>
    <tr>
      <th>{msg().Com_Lbl_Date}</th>
      <th className={`${ROOT}__request-and-event`}>
        {msg().Att_Lbl_RequestAndEvent}
      </th>
      <th className={`${ROOT}__shift-and-short-time-work`}>
        {msg().Att_Lbl_ShiftAndShortTimeWork}
      </th>
      {useAllowance ? <th>{msg().Att_Lbl_Allowance}</th> : null}
      {useManageCommuteCount ? (
        <th className={`${ROOT}__commute-count-commute`}>
          {msg().Att_Lbl_CommuteCountCommute}
        </th>
      ) : null}
      {useObjectivelyEventLog ? (
        <th>{msg().Att_Lbl_ObjectivelyEventLog}</th>
      ) : null}
      <th>{msg().Att_Lbl_TimeIn}</th>
      <th>{msg().Att_Lbl_TimeOut}</th>
      <th>{msg().$Att_Lbl_CustomRest}</th>
      <th>{msg().Att_Lbl_ActualWork}</th>
      <th>{msg().Att_Lbl_Overtime}</th>
      <th>{msg().Att_Lbl_LateNight}</th>
      <th>{msg().Att_Lbl_DailyVirtualWorkTime}</th>
      <th>{msg().Att_Lbl_HolidayWorkTime}</th>
      <th>{msg().Att_Lbl_Deducted}</th>
      <th>{msg().Att_Lbl_Remarks}</th>
      {layoutHead?.map((layout) => {
        return <th key={layout.id}>{layout.name}</th>;
      })}
    </tr>
  </thead>
);

const AttentionRemarks: React.FC<{ attentions: DailyRecord['attentions'] }> = ({
  attentions,
}) => {
  const messages = attentionHelper.remarks(attentions);
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
};

const RecordRow: React.FC<{
  className?: string;
  mdw: boolean;
  record: DailyRecord;
  workingType: PickedAttendanceSummary['workingType'];
  layoutRow: LayoutItemViewModel[];
  layoutValue: LayoutDailyValuesViewModel[string];
}> = ({
  className,
  mdw,
  record,
  workingType: {
    useAllowanceManagement: useAllowance,
    useManageCommuteCount,
    useObjectivelyEventLog,
  },
  layoutRow,
  layoutValue,
}) => (
  <tr className={className}>
    <td className={`${ROOT}__col-date`}>
      <div className={`${ROOT}__col-date-container`}>
        <div className={`${ROOT}__col-date`}>
          <div className={`${ROOT}__col-date-icon`}>
            {!!record.attentions.length && (
              <img
                src={iconAttentions}
                alt={msg().Appr_Msg_DailyAttentionTitle}
                title={msg().Appr_Msg_DailyAttentionTitle}
              />
            )}
          </div>
          <div className={`${ROOT}__col-date-date`}>
            {recordHelper.date(record.recordDate, mdw)}
          </div>
        </div>
        <div className={`${ROOT}__col-date-sign`}>
          <div className={`${ROOT}__day-type-icon`}>
            <DayTypeSymbol dayType={record.dayType} />
          </div>
        </div>
      </div>
    </td>
    <td>{record.event}</td>
    <td>{record.shift}</td>
    {useAllowance ? (
      <td className={`${ROOT}__col-number`}>
        {record.allowanceDailyRecordCount === 0
          ? null
          : record.allowanceDailyRecordCount}
      </td>
    ) : null}
    {useManageCommuteCount ? (
      <td>{recordHelper.commuteState(record.commuteState)}</td>
    ) : null}
    {useObjectivelyEventLog ? (
      <td className={`${ROOT}__col-text`}>
        {record.dailyObjectiveEventLog ? record.dailyObjectiveEventLog : null}
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
      <AttentionRemarks attentions={record.attentions} />
    </td>
    {layoutRow?.map((item) => (
      <td key={item.id}>
        {getDisplayValue(
          item,
          layoutValue && layoutValue[item.id]
            ? layoutValue[item.id]
            : {
                existing: false,
                value: null,
              }
        )}
      </td>
    ))}
  </tr>
);
RecordRow.defaultProps = {
  className: '',
};

const TotalRow: React.FC<{
  recordTotal: PickedAttendanceSummary['recordTotal'];
  setting: PickedAttendanceSummary['workingType'];
  layoutRow: LayoutItemViewModel[];
}> = ({ recordTotal, setting, layoutRow }) => (
  <tr>
    <td
      colSpan={tableHelper.colSpanNumber(setting, 5)}
      className={`${ROOT}__col-label`}
    >
      {msg().Att_Lbl_Total}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.restTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.realWorkTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.overTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.nightTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.virtualWorkTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.holidayWorkTime)}
    </td>
    <td className={`${ROOT}__col-duration`}>
      {recordHelper.durationTotal(recordTotal.lostTime)}
    </td>
    <td />
    {layoutRow?.map((layout) => (
      <td key={layout.id} />
    ))}
  </tr>
);

const RecordTable = <AS extends PickedAttendanceSummary>({
  className,
  summary,
  targetDate,
  enabledTotal,
}: {
  className?: string;
  summary: AS;
  targetDate?: string | null;
  enabledTotal?: boolean;
}): ReturnType<React.FC> => (
  <div className={classNames(ROOT, className)}>
    <table className={`${ROOT}__table`}>
      <Header
        {...summary.workingType}
        layoutHead={summary.displayFieldLayout?.layoutRow}
      />
      <tbody>
        {summary.records.map((record, idx) => (
          <RecordRow
            key={record.recordDate}
            className={classNames({
              [`${ROOT}__row--selected`]: targetDate === record.recordDate,
            })}
            mdw={idx === 0 && !enabledTotal}
            record={record}
            workingType={summary.workingType}
            layoutRow={summary.displayFieldLayout?.layoutRow}
            layoutValue={
              summary.displayFieldLayout?.layoutValues &&
              summary.displayFieldLayout?.layoutValues[record.recordDate]
            }
          />
        ))}
      </tbody>
      {enabledTotal ? (
        <tfoot>
          <tr className={`${ROOT}__divider`} />
          <TotalRow
            recordTotal={summary.recordTotal}
            setting={summary.workingType}
            layoutRow={summary.displayFieldLayout?.layoutRow}
          />
        </tfoot>
      ) : (
        ''
      )}
    </table>
  </div>
);

RecordTable.defaultProps = {
  className: '',
  targetDate: null,
  enabledTotal: true,
};

export default RecordTable;
