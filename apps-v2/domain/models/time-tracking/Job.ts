import { WorkCategory } from './WorkCategory';

export type Jobable = {
  /**
   * ジョブID
   */
  id: string;

  /**
   * ジョブコード
   */
  code: string;

  /**
   * ジョブ名
   */
  name: string;

  /**
   * Whether jot has child level or not.
   */
  hasChildren?: boolean;

  /**
   * 有効期間開始日
   */
  validFrom?: string;

  /*
   * 有効期間終了日
   */
  validTo?: string;

  /**
   * ジョブがロックされているかどうか
   */
  isEditLocked: boolean;
};

export type Job = {
  /**
   * ジョブID
   */
  id: string;

  /**
   * ジョブコード
   */
  code: string;

  /**
   * ジョブ名
   */
  name: string;

  /**
   * 親ジョブID
   */
  parentId: string | null | undefined;

  /**
   * Whether jot has parent or not.
   */
  hasJobType: boolean;

  /**
   * ジョブに紐付く作業分類のリスト
   */
  workCategories: WorkCategory[];

  /**
   * Whether jot has child level or not.
   */
  hasChildren: boolean;

  /**
   * 直課か否か
   */
  isDirectCharged: boolean;

  /**
   * ジョブがロックされているかどうか
   */
  isEditLocked: boolean;
};

export type JobPickListItem = {
  jobId: string;
  jobCode: string;
  jobName: string;
  hasJobType: boolean;
};

export type JobPickList = {
  byId: { [id: string]: JobPickListItem };
  allIds: string[];
};

export type JobTree = Job[][];

export const hasWorkCategory = (job: Job): boolean => {
  return job.hasJobType;
};

type FetchAllParam<T extends Jobable> =
  | { targetDate: string; parent?: T | null | undefined; empId?: string }
  | { targetDate: string; parentJobId?: string; empId?: string };

type SearchAllParam<T extends Jobable> =
  | {
      codeOrName: string;
      targetDate: string;
      parent?: T | null | undefined;
      empId?: string;
      companyId?: string;
    }
  | {
      codeOrName: string;
      targetDate: string;
      parentJobId?: string;
      empId?: string;
      companyId?: string;
    };

export interface TimeTrackJobRepository<T extends Jobable> {
  fetchAll: (arg0: FetchAllParam<T>) => AsyncGenerator<T, void, void>;
  searchAll: (arg0: SearchAllParam<T>) => AsyncGenerator<T, void, void>;
  search: (param: {
    targetDate: string;
    parent?: T | null | undefined;
    ancestors?: T[][];
    empId?: string;
  }) => Promise<T[][]>;
  allHierarchicalSearch: (arg0: {
    codeOrName: string;
    targetDate: string;
    companyId?: string;
    empId?: string;
    recordCount?: number;
  }) => Promise<{ isMoreThanRecordCount: boolean; records: Array<T> }>;
}
