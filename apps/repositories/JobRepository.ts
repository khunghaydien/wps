import isNil from 'lodash/isNil';

import Api from '../commons/api';

import { Job } from '../domain/models/organization/Job';

import adapter from './adapters';

const ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT = 1000;

// The API '/job/search' and '/time/job/get' have different field names for the time-tracking results edit lock.
// As of Jul'21, the field name of '/time/job/get' (isEditLocked) is assumed to be correct.
// API'/job/search' と '/time/job/get' では、工数実績編集ロックのフィールド名が異なる。
// Jul'21時点では、'/time/job/get'のフィールド名（isEditLocked）を正として、FE側の取り扱いを統一した
const convertResponses = (result: {
  records: Array<Job & { isEditLockedOfTimeTracking: boolean }>;
  tailCode: null | string;
}): { records: Array<Job>; tailCode: null | string } => ({
  ...result,
  records: result.records.map((job) => ({
    ...job,
    isEditLocked: job.isEditLockedOfTimeTracking,
  })),
});

type Param = {
  id?: string;
  companyId?: string;
  departmentId?: string;
  empId?: string;
  onlyHighestLevel?: boolean;
  parentId?: string;
  query?: string;
  targetDate?: string;
  usedIn?: string;
  tailCode?: string;
  recordCount?: number;
};

async function* searchAll({
  codeOrName,
  companyId,
  targetDate,
  parentJobId,
  parent,
  empId,
}:
  | {
      codeOrName: string;
      companyId: string;
      targetDate: string;
      empId?: string;
      parentJobId: string | null | undefined;
      parent?: never;
    }
  | {
      codeOrName: string;
      companyId: string;
      targetDate: string;
      empId?: string;
      parentJobId?: never;
      parent: Job | null | undefined;
    }): AsyncGenerator<Job, void, void> {
  const INITIAL_RECORD_COUNT = 30;
  const RECORD_COUNT = 3000;

  const parentId = parentJobId || parent?.id || undefined;
  const commonParam: Partial<Param> = {
    query: codeOrName,
    companyId,
    empId,
    targetDate,
    parentId,
    onlyHighestLevel: isNil(parentId),
  };

  const search = (
    tailCode?: string,
    recordCount: number = RECORD_COUNT
  ): Promise<{ records: Job[]; tailCode: null | string }> => {
    return Api.invoke({
      path: '/job/search',
      param: {
        ...commonParam,
        tailCode,
        recordCount,
      },
    }).then(convertResponses);
  };

  const loadLazy = async function* (prev?: string, recordCount?: number) {
    const { records, tailCode } = await search(prev, recordCount);
    for (const job of records) {
      yield adapter.fromRemote(job);
    }
    if (!isNil(tailCode) && records.length > 0) {
      yield* loadLazy(tailCode, RECORD_COUNT);
    }
  };

  yield* loadLazy(undefined, INITIAL_RECORD_COUNT);
}

async function* fetchAll(param: {
  companyId: string;
  targetDate: string;
  parentId: string | null | undefined;
  empId?: string;
}): AsyncGenerator<Job, void, void> {
  yield* searchAll({ ...param, parentJobId: param.parentId, codeOrName: '' });
}

// TODO Move it to organization/job
export default {
  searchAll,
  fetchAll,

  /**
   * Execute search for entity with a given query
   *
   * TODO:
   * Add a model representing Job
   */
  search: (param: Param): Promise<{ records: ReadonlyArray<Job> }> => {
    return Api.invoke({
      path: '/job/search',
      param,
    }).then((result) => adapter.fromRemote(result));
  },

  allHierarchicalSearch: ({
    companyId,
    empId,
    targetDate,
    codeOrName,
    recordCount = ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT,
  }: {
    companyId?: string;
    empId?: string;
    targetDate: string;
    codeOrName: string;
    recordCount?: number;
  }): Promise<{
    isMoreThanRecordCount: boolean;
    records: Array<Job>;
  }> =>
    Api.invoke({
      path: '/job/search',
      param: {
        query: codeOrName,
        companyId,
        empId,
        targetDate,
        onlyHighestLevel: false,
        recordCount,
      },
    }).then(convertResponses),
};
