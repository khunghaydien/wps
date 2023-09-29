import Api from '../../commons/api';

/*
 * NOTE
 * * CSVファイルが選択（ドロップ）された時には、フィールドの値は必ずstringになる。
 *   セルの値が空白であっても、csvParserは空文字と解釈する。
 *
 * * APIからのデータ取得時には、フィールドの値はnullの可能性がある。
 *   （https://teamspiritdev.atlassian.net/l/c/saPCwYJm）
 *   csvStringifyは、nullを空白として出力するので、空文字への変換は省略して良い。
 */
export type TimeRecordItemImportRecord = {
  /**
   * Employee Code
   * 社員コード
   */
  employeeCode: string | null;

  /**
   * YYYY-MM-DD
   *
   * the Date of achievement
   * 実績をつける日付
   */
  recordDate: string | null;

  /**
   * the code of job
   * ジョブコード
   */
  jobCode: string | null;

  /**
   * the code of work category
   * 作業分類コード
   */
  workCategoryCode: string | null;

  /**
   * working hours
   * 作業時間
   */
  taskTime: string | null;
};

export const IMPORT_RESULT_STATUS = {
  Waiting: 'Waiting',
  Processing: 'Processing',
  Completed: 'Completed',
  Failed: 'Failed',
} as const;

export type ImportResultStatus =
  typeof IMPORT_RESULT_STATUS[keyof typeof IMPORT_RESULT_STATUS];

export type TimeRecordItemImportResult = {
  id: string;
  importDateTime: string;
  status: string;
  actorName: string;
  count: number;
  successCount: number;
  failureCount: number;
};

export type TimeRecordItemImportResultDetail = TimeRecordItemImportRecord & {
  status: ImportResultStatus;
  errorDetail: string;
};

export const TIME_RECORD_ITEM_IMPORT_HEADER: Array<
  keyof TimeRecordItemImportRecord
> = ['employeeCode', 'recordDate', 'jobCode', 'workCategoryCode', 'taskTime'];

export const TIME_RECORD_ITEM_IMPORT_RESULT_HEADER: Array<
  keyof TimeRecordItemImportResultDetail
> = [...TIME_RECORD_ITEM_IMPORT_HEADER, 'status', 'errorDetail'];

export type ExecuteImportParam = {
  /**
   * Company ID
   * 会社ID
   */
  companyId: string;

  /**
   * A list of time data
   * 工数実績インポートのレコード
   *
   * maximum length: 5000 items
   * 最大5000件
   */
  records: TimeRecordItemImportRecord[];
};

export default {
  /**
   * List results of imports
   */
  listResult: (companyId: string): Promise<TimeRecordItemImportResult[]> => {
    return Api.invoke({
      path: '/time-track/record-item/import/result/list',
      param: { companyId },
    }).then((result) => result.records);
  },

  /**
   * Fetch result of import
   */
  fetchResult: (id: string): Promise<TimeRecordItemImportResultDetail[]> => {
    return Api.invoke({
      path: '/time-track/record-item/import/result/get',
      param: { id },
    }).then((result) => result.records);
  },

  /**
   * Execute import
   */
  executeImport: (payload: ExecuteImportParam): Promise<void> => {
    return Api.invoke({
      path: '/time-track/record-item/import',
      param: { ...payload },
    });
  },
};
