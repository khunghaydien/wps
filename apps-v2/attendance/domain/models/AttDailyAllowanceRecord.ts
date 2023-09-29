/**
 * 手当日次明細レコード
 */
export type DailyRecord = {
  /**
   * 手当日次明細ID
   */
  id: string;

  /**
   * 手当ID
   */
  allowanceId: string;

  /**
   * 手当名
   */
  allowanceName: string;

  /**
   * 手当コード
   */
  allowanceCode: string;

  /**
   * 管理種別
   */
  managementType: string;

  /**
   * 表示順
   */
  order: number | null | undefined;

  /**
   * 開始時刻
   */
  startTime: number | null | undefined;

  /**
   * 終了時刻
   */
  endTime: number | null | undefined;

  /**
   * 合計時間
   */
  totalTime: number | null | undefined;

  /**
   * 数量
   */
  quantity: number | null | undefined;
};
