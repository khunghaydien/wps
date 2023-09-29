import { DailyRecord } from './AttDailyAllowanceRecord';
import { DailyRecordList } from './AttDailyAllowanceRecordList';
/**
 * 手当日次明細とサマリーの情報
 */
export type DailyAllowanceSummary = {
  /**
   * 月度
   */
  period: string;

  /**
   * 部署名
   */
  departmentName: string;

  /**
   * 勤務体系名
   */
  workingTypeName: string;

  /**
   * 社員コード
   */
  employeeCode: string;

  /**
   * 社員名
   */
  employeeName: string;

  /**
   * 手当日次明細リスト
   * list of daily allowance
   */
  dailyRecordList: DailyRecordList[];
};

export type DailyRecordRemote = {
  id: string;
  allowanceId: string;
  allowanceName: string;
  allowanceCode: string;
  managementType: string;
  order: number | null | undefined;
  startTime: number | null | undefined;
  endTime: number | null | undefined;
  totalTime: number | null | undefined;
  quantity: number | null | undefined;
};
export type DailyRecordListFromRemote = {
  recordDate: string;
  dailyAllowanceList: DailyRecordRemote[];
};

export type AttDailyAllowanceSummaryRemote = {
  period: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  dailyRecordList: DailyRecordListFromRemote[];
};

export const convertDailyRecordFromRemote = (
  dailyRecordRemote: DailyRecordRemote
): DailyRecord => ({
  id: dailyRecordRemote.id,
  allowanceId: dailyRecordRemote.allowanceId,
  allowanceName: dailyRecordRemote.allowanceName,
  allowanceCode: dailyRecordRemote.allowanceCode,
  managementType: dailyRecordRemote.managementType,
  order: dailyRecordRemote.order,
  startTime: dailyRecordRemote.startTime,
  endTime: dailyRecordRemote.endTime,
  totalTime: dailyRecordRemote.totalTime,
  quantity: dailyRecordRemote.quantity,
});

export const convertDailyRecordListFromRemote = (
  dailyRecordListFromRemote: DailyRecordListFromRemote
): DailyRecordList => ({
  recordDate: dailyRecordListFromRemote.recordDate,
  dailyAllowanceList: dailyRecordListFromRemote.dailyAllowanceList.map(
    convertDailyRecordFromRemote
  ),
});

const convertDailyAllowanceSummaryFromRemote = (
  contentsFromRemote: AttDailyAllowanceSummaryRemote
): DailyAllowanceSummary => ({
  period: contentsFromRemote.period,
  departmentName: contentsFromRemote.departmentName,
  workingTypeName: contentsFromRemote.workingTypeName,
  employeeCode: contentsFromRemote.employeeCode,
  employeeName: contentsFromRemote.employeeName,
  dailyRecordList: contentsFromRemote.dailyRecordList.map(
    convertDailyRecordListFromRemote
  ),
});

export const convertFromRemote = (
  remote: AttDailyAllowanceSummaryRemote
): DailyAllowanceSummary => {
  return convertDailyAllowanceSummaryFromRemote(remote);
};
