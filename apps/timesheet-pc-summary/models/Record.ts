import { DayTypeEnum } from './DayType';

/**
 * 日次データ
 */
export type Record = {
  /**
   * 日付(ISO8601)
   */
  recordDate: string;

  /**
   * 日タイプ
   */
  dayType: DayTypeEnum | null | undefined;

  /**
   * イベント
   */
  event: string | null | undefined;

  /**
   * シフト名
   * 勤務パターン名・短時間勤務設定名(・休職休業名)
   */
  shift: string | null | undefined;

  /**
   * 通勤往路回数
   */
  commuteCountForward: number | null;

  /**
   * 通勤復路回数
   */
  commuteCountBackward: number | null;

  /**
   * 出勤時刻
   */
  startTime: number | null;

  /**
   * 退勤時刻
   */
  endTime: number | null;

  /**
   * 出勤打刻時刻
   */
  startStampTime: number | null;

  /**
   * 退勤打刻時刻
   */
  endStampTime: number | null;

  /**
   * 休憩時間
   */
  restTime: number;

  /**
   * 実労働時間
   */
  realWorkTime: number;

  /**
   * 残業時間
   */
  overTime: number | null;

  /**
   * 休日勤務時間
   */
  holidayWorkTime: number | null;

  /**
   * 深夜時間
   */
  nightTime: number | null;

  /**
   * 控除時間
   */
  lostTime: number | null;

  /**
   * 不足休憩時間
   */
  insufficientRestTime: number | null;

  /**
   * 勤務相当時間
   */
  virtualWorkTime: number | null;

  /**
   * 実効出勤時刻
   */
  outStartTime: number | null;

  /**
   * 実効退勤時刻
   */
  outEndTime: number | null;

  /**
   * 備考
   */
  remarks: string | null;

  startTimeModified: boolean;
  endTimeModified: boolean;
};
