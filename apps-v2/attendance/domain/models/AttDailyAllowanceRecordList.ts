import { DailyRecord } from './AttDailyAllowanceRecord';

/**
 * 手当日次明細
 */
export type DailyRecordList = {
  /**
   * 日付
   * Record Date
   *
   * Date formated by ISO8601.
   */
  recordDate: string;
  /**
   * 手当日次明細リスト
   * list of daily allowance
   */
  dailyAllowanceList: DailyRecord[];
};
