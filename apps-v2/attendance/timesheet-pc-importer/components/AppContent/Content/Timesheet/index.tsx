import * as React from 'react';

import classNames from 'classnames';

import styled from 'styled-components';

import DateUtil from '@apps/commons/utils/DateUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';
import msg from '@commons/languages';

import { Cell, CellChange, CellId, Column, Row } from './models/Table';
import { COMPENSATORY_LEAVE_CODE } from '@attendance/domain/models/Leave';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

import { AttTimeCellTemplate } from './CellTemplates/AttTimeCellTemplate';
import { DropdownCellTemplate } from './CellTemplates/DropdownCellTemplate';
import { ErrorsCellTemplate } from './CellTemplates/ErrorsCellTemplate';
import { color } from '@attendance/timesheet-pc-importer/styles';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';
import substituteLeaveTypeName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/substituteLeaveTypeName';
import leaveRangeName from '@attendance/ui/helpers/leave/rangeName';
import { ReactGrid } from '@silevis/reactgrid';

import './index.scss';

const Container = styled.div.attrs({
  className: 'attendance-ui-page-timesheet-pc-importer-timesheet',
})`
  > .reactgrid {
    .rg-cell.invalid {
      background-color: ${color.background.error} !important;
    }
    .rg-cell.cell-error {
      color: ${color.color.error};
    }
  }
`;

const DEFAULT_WIDTH = 150;

type CellMetaData = {
  key: keyof DailyRecordViewModel.DailyRecordViewModel | 'dayOfWeek';
  label?: string;
  width?: number;
  resizable?: boolean;
  createCell: (dailyRecord: DailyRecordViewModel.DailyRecordViewModel) => Cell;
};

const createLoadingCell = (): Cell => ({
  type: 'text',
  text: msg().Att_Lbl_ImpCellLoading,
  nonEditable: true,
});

/**
 * Cell を作成するのに必要な情報を作成する
 * msg() を呼び出す必要があるのでメソッド化している。
 * @returns
 */
const createCellMetaData = (): CellMetaData[] => [
  {
    key: 'checked',
    label: '',
    width: 50,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.checked,
    }),
  },
  // 日付
  {
    key: 'recordDate',
    width: 50,
    createCell: (value) => ({
      type: 'header',
      text: DateUtil.formatD(value.recordDate),
      nonEditable: true,
    }),
  },
  {
    key: 'dayOfWeek',
    label: msg().Att_Lbl_ImpHeaderDayOfWeek,
    width: 50,
    createCell: (value) => ({
      type: 'header',
      text: DateUtil.formatW(value.recordDate),
      nonEditable: true,
    }),
  },
  // 勤務情報
  {
    key: 'startTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.startTime),
      value: value.startTime,
    }),
  },
  {
    key: 'endTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.endTime),
      value: value.endTime,
    }),
  },
  {
    key: 'rest1StartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.rest1StartTime),
      value: value.rest1StartTime,
    }),
  },
  {
    key: 'rest1EndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.rest1EndTime),
      value: value.rest1EndTime,
    }),
  },
  {
    key: 'rest1ReasonCode',
    width: 100,
    resizable: true,
    createCell: (value) => {
      if (value.loadingRestTimeReasons) {
        return createLoadingCell();
      } else {
        return {
          type: 'dropdown',
          date: value.recordDate,
          selectedValue: value.rest1ReasonCode,
          values:
            value.restTimeReasons?.map((restReason) => ({
              label: `${restReason.code}-${restReason.name}`,
              value: restReason.code,
            })) ?? [],
          // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
          // nonEditable: !value.restTimeReasons,
        };
      }
    },
  },
  {
    key: 'rest2StartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.rest2StartTime),
      value: value.rest2StartTime,
    }),
  },
  {
    key: 'rest2EndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.rest2EndTime),
      value: value.rest2EndTime,
    }),
  },
  {
    key: 'rest2ReasonCode',
    width: 100,
    resizable: true,
    createCell: (value) => {
      if (value.loadingRestTimeReasons) {
        return createLoadingCell();
      } else {
        return {
          type: 'dropdown',
          selectedValue: value.rest2ReasonCode,
          values:
            value.restTimeReasons?.map((restReason) => ({
              label: `${restReason.code}-${restReason.name}`,
              value: restReason.code,
            })) ?? [],
          // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
          // nonEditable: !value.restTimeReasons,
        };
      }
    },
  },
  // 休暇申請
  {
    key: 'appliedLeaveRequest1',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedLeaveRequest1,
    }),
  },
  {
    key: 'leaveRequest1Code',
    resizable: true,
    createCell: (value) => {
      if (value.loadingLeaveRequestLeaves) {
        return createLoadingCell();
      } else {
        return {
          type: 'dropdown',
          selectedValue: value.leaveRequest1Code,
          values:
            value.leaveRequestLeaves?.map((leave) => ({
              label:
                COMPENSATORY_LEAVE_CODE === leave.code
                  ? leave.name
                  : `${leave.code}-${leave.name}`,
              value: leave.code,
            })) ?? [],
          // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
          // nonEditable: !value.appliedLeaveRequest1,
        };
      }
    },
  },
  {
    key: 'leaveRequest1Range',
    resizable: true,
    createCell: (value) => ({
      type: 'dropdown',
      selectedValue: value.leaveRequest1Range,
      values:
        value.leaveRequest1Leave?.ranges?.map((range) => ({
          label: leaveRangeName(range),
          value: range,
        })) ?? [],
      // nonEditable: !value.leaveRequest1Code,
    }),
  },
  {
    key: 'leaveRequest1StartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.leaveRequest1StartTime),
      value: value.leaveRequest1StartTime,
    }),
  },
  {
    key: 'leaveRequest1EndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.leaveRequest1EndTime),
      value: value.leaveRequest1EndTime,
    }),
  },
  {
    key: 'leaveRequest1Reason',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.leaveRequest1Reason || '',
      value: value.leaveRequest1Reason,
    }),
  },
  {
    key: 'leaveRequest1Remark',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.leaveRequest1Remark || '',
      value: value.leaveRequest1Remark,
    }),
  },
  // 残業申請
  {
    key: 'appliedOvertimeWorkRequest',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedOvertimeWorkRequest,
    }),
  },
  {
    key: 'overtimeWorkRequestStartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.overtimeWorkRequestStartTime),
      value: value.overtimeWorkRequestStartTime,
    }),
  },
  {
    key: 'overtimeWorkRequestEndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.overtimeWorkRequestEndTime),
      value: value.overtimeWorkRequestEndTime,
    }),
  },
  {
    key: 'overtimeWorkRequestRemark',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.overtimeWorkRequestRemark || '',
      value: value.overtimeWorkRequestRemark,
    }),
  },
  // 早朝勤務申請
  {
    key: 'appliedEarlyStartWorkRequest',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedEarlyStartWorkRequest,
    }),
  },
  {
    key: 'earlyStartWorkRequestStartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.earlyStartWorkRequestStartTime),
      value: value.earlyStartWorkRequestStartTime,
    }),
  },
  {
    key: 'earlyStartWorkRequestEndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.earlyStartWorkRequestEndTime),
      value: value.earlyStartWorkRequestEndTime,
    }),
  },
  {
    key: 'earlyStartWorkRequestRemark',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.earlyStartWorkRequestRemark || '',
      value: value.earlyStartWorkRequestRemark,
    }),
  },
  // 遅刻申請
  {
    key: 'appliedLateArrivalRequest',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedLateArrivalRequest,
    }),
  },
  {
    key: 'lateArrivalRequestReasonText',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.lateArrivalRequestReasonText || '',
      value: value.lateArrivalRequestReasonText,
    }),
  },
  {
    key: 'lateArrivalRequestReasonCode',
    resizable: true,
    createCell: (value) => {
      if (value.loadingLateArrivalRequestReasons) {
        return createLoadingCell();
      } else {
        return {
          type: 'dropdown',
          selectedValue: value.lateArrivalRequestReasonCode,
          values:
            value.lateArrivalReasons?.map((reason) => ({
              label: `${reason.code}-${reason.name}`,
              value: reason.code,
            })) ?? [],
          // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
          // nonEditable: !value.appliedLeaveRequest1,
        };
      }
    },
  },
  // 早退申請
  {
    key: 'appliedEarlyLeaveRequest',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedEarlyLeaveRequest,
    }),
  },
  {
    key: 'earlyLeaveRequestReasonText',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.earlyLeaveRequestReasonText || '',
      value: value.earlyLeaveRequestReasonText,
    }),
  },
  {
    key: 'earlyLeaveRequestReasonCode',
    resizable: true,
    createCell: (value) => {
      if (value.loadingEarlyLeaveRequestReasons) {
        return createLoadingCell();
      } else {
        return {
          type: 'dropdown',
          selectedValue: value.earlyLeaveRequestReasonCode,
          values:
            value.earlyLeaveReasons?.map((reasons) => ({
              label: `${reasons.code}-${reasons.name}`,
              value: reasons.code,
            })) ?? [],
          // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
          // nonEditable: !value.appliedLeaveRequest1,
        };
      }
    },
  },
  // 欠勤申請
  // {
  //   key: 'appliedAbsenceRequest',
  //   label: msg().Att_Lbl_ImpHeaderAppliedAbsence,
  //   createCell: (value) => ({
  //     type: 'checkbox',
  //     checked: value.appliedAbsenceRequest,
  //   }),
  // },
  // {
  //   key: 'absenceRequestReason',
  //   label: msg().Att_Lbl_ImpHeaderAbsenceRequestReason,
  //   createCell: (value) => ({
  //     type: 'text',
  //     text: value.absenceRequestReason || '',
  //     value: value.absenceRequestReason,
  //   }),
  // },
  // 休日出勤申請
  {
    key: 'appliedHolidayWorkRequest',
    width: 100,
    createCell: (value) => ({
      type: 'checkbox',
      checked: value.appliedHolidayWorkRequest,
    }),
  },
  {
    key: 'holidayWorkRequestSubstituteLeaveType',
    resizable: true,
    createCell: (value) => ({
      type: 'dropdown',
      selectedValue: value.holidayWorkRequestSubstituteLeaveType,
      values: [
        SUBSTITUTE_LEAVE_TYPE.None,
        // SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
      ].map((type) => ({
        label: substituteLeaveTypeName(type),
        value: type,
      })),
      // nonEditable を true にするとコピペ の時に遅延代入ができなくなる
      // nonEditable: !value.appliedLeaveRequest1,
    }),
  },
  {
    key: 'holidayWorkRequestStartTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.holidayWorkRequestStartTime),
      value: value.startTime,
    }),
  },
  {
    key: 'holidayWorkRequestEndTime',
    width: 100,
    resizable: true,
    createCell: (value) => ({
      type: 'attTime',
      text: TimeUtil.toHHmm(value.holidayWorkRequestEndTime),
      value: value.endTime,
    }),
  },
  {
    key: 'holidayWorkRequestRemark',
    resizable: true,
    createCell: (value) => ({
      type: 'text',
      text: value.holidayWorkRequestRemark || '',
      value: value.holidayWorkRequestRemark,
    }),
  },
  // その他
  {
    key: 'errors',
    resizable: true,
    createCell: (value) => ({
      type: 'errors',
      className: 'cell-error',
      errors: value.errors,
      nonEditable: true,
    }),
  },
];

const createHeaderRow = (
  cellMetaData: CellMetaData[],
  dailyRecords: DailyRecordViewModel.DailyRecordViewModel[]
): Row => ({
  rowId: 'header',
  cells: cellMetaData.map((value) => {
    if (value.key === 'checked') {
      return {
        type: 'checkbox',
        checked: dailyRecords?.every(({ checked }) => checked),
      };
    } else {
      return {
        type: 'header',
        text: DailyRecordViewModel.getLabel(value.key) || value.label || '',
      };
    }
  }),
});

/**
 * ReactGrid で使用する Row に変換する
 *
 * RowId（行名） は `recordDate` 、
 * ColumnId（列名） は プロパティ名にしている。
 */
const createDataRow = (
  cellMetaData: CellMetaData[],
  dailyRecords: DailyRecordViewModel.DailyRecordViewModel[],
  {
    openedOption: [openedRowId, openedColumnId],
  }: {
    openedOption: [CellId, CellId];
  }
): Row[] => {
  const rows = (dailyRecords || [DailyRecordViewModel.create()]).map(
    (record) => {
      const rowId = record.recordDate;
      return {
        rowId,
        cells: cellMetaData.map((meta) => {
          const columnId = meta.key;
          const cell = meta.createCell(record);
          if (
            cell.type === 'dropdown' &&
            openedRowId === rowId &&
            openedColumnId === columnId
          ) {
            cell.isOpen = true;
          }
          if (record.serverErrors?.length) {
            cell.className = classNames(cell.className, `invalid`);
          } else if (record.validationErrors?.size) {
            if (
              record.validationErrors.has(
                columnId as unknown as keyof DailyRecordViewModel.DailyRecordViewModel
              )
            ) {
              cell.className = classNames(cell.className, `invalid`);
            }
          }
          return cell;
        }),
      };
    }
  );
  return rows || [];
};

/**
 * 更新したい値だけを持つ DailyRecordViewModel を作成します。
 * @param changes
 * @returns
 */
const createDailyRecordForApplying = (
  changes: CellChange[],
  dailyRecords: Map<string, DailyRecordViewModel.DailyRecordViewModel>
): Map<string, DailyRecordViewModel.DailyRecordViewModel> => {
  // module の不具合で Excel から貼り付けると次の行を上書きしてしまう。
  // 原因は改行が入っているため。
  // なので改行があるかを確認して削除している。
  const $changes = [...changes];
  const last2 = $changes.at(-2);
  if (last2 && 'text' in last2.newCell && /\r$/.test(last2.newCell.text)) {
    last2.newCell.text = last2.newCell.text.trim();
    $changes.pop();
  }
  const recordsForApplying: Map<
    string,
    DailyRecordViewModel.DailyRecordViewModel
  > = new Map<string, DailyRecordViewModel.DailyRecordViewModel>();
  $changes.forEach((change) => {
    const rowId = change.rowId as string;
    const columnId = change.columnId;
    const record = recordsForApplying.get(rowId) || {
      ...dailyRecords.get(rowId),
    };
    if (change.newCell.type !== 'errors') {
      if (change.newCell.type === 'attTime') {
        record[columnId] = change.newCell.value;
      } else if (change.newCell.type === 'dropdown') {
        record[columnId] = change.newCell.selectedValue;
      } else if (change.newCell.type === 'checkbox') {
        record[columnId] = change.newCell.checked;
      } else {
        record[columnId] = change.newCell.text;
      }
    }
    recordsForApplying.set(rowId, record);
  });
  return recordsForApplying;
};

const Table: React.FC<{
  dailyRecords: Map<string, DailyRecordViewModel.DailyRecordViewModel>;
  onClickCheckAll: () => void;
  onUpdateDailyRecords: (
    dailyRecords: Map<string, DailyRecordViewModel.DailyRecordViewModel>
  ) => void;
}> = ({ dailyRecords, onClickCheckAll, onUpdateDailyRecords }) => {
  // プルダウンの開閉を管理する
  const [openedOption, setIsOpenedOption] = React.useState<[CellId, CellId]>([
    null,
    null,
  ]);
  const records = React.useMemo(
    () => (dailyRecords ? [...dailyRecords.values()] : []),
    [dailyRecords]
  );
  const cellMetaData = React.useMemo(() => createCellMetaData(), []);
  const headerRow: Row = React.useMemo(
    () => createHeaderRow(cellMetaData, records),
    [cellMetaData, records]
  );
  const dataRow: Row[] = React.useMemo(
    () =>
      createDataRow(cellMetaData, records, {
        openedOption,
      }),
    [cellMetaData, openedOption, records]
  );

  const rows: Row[] = React.useMemo(
    () => [headerRow, ...dataRow],
    [dataRow, headerRow]
  );

  const [columns, setColumns] = React.useState<Column[]>(() =>
    cellMetaData.map((value) => ({
      columnId: value.key,
      width: value.width || DEFAULT_WIDTH,
      resizable: value.resizable,
    }))
  );

  const handleChanges = React.useCallback(
    (changes: CellChange[]) => {
      // Dropdown の開閉だけだった場合は内部Stateだけ更新する
      const change = changes.at(0);
      const { rowId, columnId } = change ?? {};
      if (
        change?.newCell.type === 'dropdown' &&
        change?.previousCell.type === 'dropdown' &&
        change?.newCell.isOpen !== change?.previousCell.isOpen
      ) {
        setIsOpenedOption(
          change?.newCell.isOpen
            ? [change?.rowId, change?.columnId]
            : [null, null]
        );
        if (
          change?.newCell.selectedValue === change?.previousCell.selectedValue
        ) {
          return;
        }
      }

      if (rowId === 'header' && columnId === 'checked') {
        onClickCheckAll();
      } else {
        onUpdateDailyRecords(
          createDailyRecordForApplying(changes, dailyRecords)
        );
      }
    },
    [dailyRecords, onClickCheckAll, onUpdateDailyRecords]
  );

  const handleColumnResize = (ci: CellId, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
    });
  };

  return (
    <Container>
      <ReactGrid
        stickyTopRows={1}
        stickyLeftColumns={5}
        stickyRightColumns={1}
        rows={rows}
        columns={columns}
        // @ts-ignore
        onCellsChanged={handleChanges}
        onColumnResized={handleColumnResize}
        enableRangeSelection
        customCellTemplates={{
          attTime: new AttTimeCellTemplate(),
          dropdown: new DropdownCellTemplate(),
          errors: new ErrorsCellTemplate(),
        }}
      />
    </Container>
  );
};

export default Table;
