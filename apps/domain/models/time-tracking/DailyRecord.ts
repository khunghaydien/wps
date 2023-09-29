import { DailyRecordItem } from './DailyRecordItem';

/**
 * 日次工数実績
 */
export type DailyRecord = {
  /**
   * 社員ID
   * Employee ID
   *
   * Logged-in user's employee id will be used on server side,
   * if empId is null.
   */
  empId: null | string;

  /**
   * 日付
   * Tareget Date
   *
   * Date formated by ISO8601.
   */
  targetDate: string;

  /**
   * 作業報告
   * The note to report about the job.
   */
  note: null | string;

  /**
   * アウトプット
   * output
   */
  output: null | string;

  /**
   * Total time of records
   */
  time: null | number;

  /**
   * 実績
   * Details about jobs
   */
  recordItems: DailyRecordItem[];
};
