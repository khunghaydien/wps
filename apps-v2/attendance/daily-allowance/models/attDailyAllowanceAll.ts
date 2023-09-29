export type Allowances = {
  /**
   * allowanceId
   */
  allowanceId: string | null | undefined;
  /**
   * 手当名
   */
  allowanceName: string | null | undefined;
  /**
   * 手当コード
   */
  allowanceCode: string | null | undefined;
  /**
   * 管理種別
   */
  managementType: string | null | undefined;
  /**
   * 数量
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
  /**
   * 選ぶ
   */
  isSelected: boolean | null | undefined;
};
