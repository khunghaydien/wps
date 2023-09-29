/**
 * 実績レコード
 */
export type DailyRecordItem = {
  /**
   * Job Id
   */
  jobId: string;

  /**
   * Job code
   */
  jobCode: string;

  /**
   * Job name
   */
  jobName: string;

  /**
   * 作業分類ID
   */
  workCategoryId: null | string;

  /**
   * 作業分類 Code
   */
  workCategoryCode: null | string;

  /**
   * 作業分類 Name
   */
  workCategoryName: null | string;

  /**
   * 時間入力
   *
   * true: 時間入力
   * false: 割合入力
   */
  isDirectInput?: boolean;

  /*
   * 工数
   *
   * 時間入力の場合には必須
   */
  taskTime: null | number;

  /**
   * 比率
   *
   * 割合入力の場合には必須
   */
  ratio: null | number;

  /**
   * @deprecated
   * ボリューム
   */
  volume?: null | number;

  /**
   * タスクの作業報告
   */
  taskNote: null | string;
};
