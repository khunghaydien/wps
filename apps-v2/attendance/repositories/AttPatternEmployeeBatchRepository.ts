import Api from '../../commons/api';
// import adapter from @apps/repositories/';

export type EmployeePattern = {
  /**
   * Employee Code
   * 社員コード
   */
  employeeCode: string;

  /**
   * YYYY-MM-DD
   *
   * The date when attendance pattern is applied to an employee
   * 勤務パターンを適用する日
   */
  targetDate?: string;

  /**
   * Day type
   *
   * Day type should be one of the following codes:
   * W - Workday
   * H - Holiday
   * L - Leagal holiday
   *
   * 日タイプ
   *
   * 日タイプは以下のコード値のうちどれか
   * W - 勤務日
   * H - 休日
   * L - 法定休日
   */
  dayType?: 'W' | 'H' | 'L';

  /**
   * the code of attendance pattern
   * 勤務パターンコード
   */
  patternCode?: string;

  /**
   * 所定勤務時間確定操作を指定する。
   * M: 当月の所定勤務確定情報を確定する
   * D: 当日の所定勤務確定情報を再確定する
   */
  fixContractType?: string;
};

export type EmployeePatternResultHeader =
  | keyof EmployeePattern
  | 'status'
  | 'errorDetail';

export const EMPLOYEE_PATTERN_RESULT_HEADERS: EmployeePatternResultHeader[] = [
  'employeeCode',
  'targetDate',
  'patternCode',
  'dayType',
  'fixContractType',
  'status',
  'errorDetail',
];

export type CreateQuery = {
  /**
   * Company ID
   * 会社ID
   */
  companyId: string;

  /**
   * A list of attendance pattern
   * 勤務パターン適用一覧
   *
   * maximum length: 3000 items
   * 最大3000件
   */
  records: EmployeePattern[];

  /**
   * Comment
   * コメント
   */
  comment?: string;
};

/**
 * Batch result
 *
 * Do not move this object under domain directory.
 * This object is not domain object.
 * In general, Batch has responsibility for appliation service.
 */
export type BatchResult = {
  id: string;
  importDateTime: string;
  status: string;
  actorName: string;
  comment: string;
  count: number;
  successCount: number;
  failureCount: number;
};

export type BatchResultStatus =
  | 'Waiting'
  | 'Processing'
  | 'Completed'
  | 'Failed';

export const BATCH_RESULT_STATUS: {
  [key in BatchResultStatus]?: BatchResultStatus;
} = {
  Waiting: 'Waiting',
  Processing: 'Processing',
  Completed: 'Completed',
  Failed: 'Failed',
};

export default {
  /**
   * Find results of batches
   */
  search: (companyId: string): Promise<BatchResult[]> => {
    return Api.invoke({
      path: '/att/pattern/employee/batch/result/list',
      param: { companyId },
    }).then((result) => result.records);
  },

  /**
   * Find result of batch
   */
  fetch: (id: string): Promise<any> => {
    return Api.invoke({
      path: '/att/pattern/employee/batch/result/get',
      param: { id },
    }).then((result) => result.records);
  },

  /**
   * Execute batch
   */
  create: (query: CreateQuery): Promise<void> => {
    return Api.invoke({
      path: '/att/pattern/employee/batch/execute',
      param: { ...query },
    });
  },
};
