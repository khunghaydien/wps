import isNil from 'lodash/isNil';

import Api from '../../commons/api';

import { Job, Jobable, JobTree } from '../../domain/models/time-tracking/Job';

import adapter from '../adapters';

const ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT = 1000;

async function* searchAll({
  codeOrName,
  empId,
  parentJobId,
  targetDate,
  startDate,
  endDate,
}: {
  codeOrName: string;
  empId?: string;
  parentJobId?: string;
  targetDate?: string;
  startDate?: string;
  endDate?: string;
}): AsyncGenerator<Job, void, void> {
  const commonParam: { [key: string]: unknown } = {
    codeOrName,
    empId,
    parentId: parentJobId,
  };
  if (targetDate) {
    commonParam.targetDate = targetDate;
  }
  if (startDate || endDate) {
    commonParam.startDate = startDate;
    commonParam.endDate = endDate;
  }

  const search = (
    tailCode?: string,
    // @ts-ignore
    pageSize: number
  ): Promise<{ jobList: Job[]; tailCode: null | string }> => {
    return Api.invoke({
      path: '/time/job/get',
      param: {
        ...commonParam,
        tailCode,
        pageSize,
      },
    });
  };

  const INITIAL_PAGE_SIZE = 30;
  const PAGE_SIZE = 3000;
  // @ts-ignore
  const loadLazy = async function* (prev?: string, pageSize: number) {
    const { jobList, tailCode } = await search(prev, pageSize);
    for (const job of jobList) {
      yield adapter.fromRemote(job);
    }
    if (!isNil(tailCode) && jobList.length > 0) {
      yield* loadLazy(tailCode, PAGE_SIZE);
    }
  };

  yield* loadLazy(undefined, INITIAL_PAGE_SIZE);
}

async function* fetchAll(param: {
  targetDate?: string;
  startDate?: string;
  endDate?: string;
  parentJobId?: string;
  empId?: string;
}): AsyncGenerator<Job, void, void> {
  yield* searchAll({ ...param, codeOrName: '' });
}

export type SearchAllParam = {
  codeOrName: string;
  targetDate: string;
  empId?: string;
} & (
  | {
      parent?: Job | null | undefined;
      parentJobId?: never;
    }
  | {
      parent?: never;
      parentJobId?: string;
    }
);

export type FetchAllParam = { targetDate: string; empId?: string } & (
  | {
      parent?: Job | null | undefined;
      parentJobId?: never;
    }
  | {
      parent?: never;
      parentJobId?: string;
    }
);

export default {
  searchAll: (param: SearchAllParam): AsyncGenerator<Job, void, void> => {
    if ('parentJobId' in param) {
      return searchAll({
        codeOrName: param.codeOrName,
        targetDate: param.targetDate,
        parentJobId: param.parentJobId,
        empId: param.empId,
      });
    } else {
      return searchAll({
        codeOrName: param.codeOrName,
        targetDate: param.targetDate,
        parentJobId: 'parent' in param ? param.parent?.id : undefined,
        empId: param.empId,
      });
    }
  },

  searchAllByDateRange: (param: {
    codeOrName: string;
    startDate: string;
    endDate: string;
    parent?: Job | null | undefined;
    empId?: string;
  }): AsyncGenerator<Job, void, void> => {
    return searchAll({
      codeOrName: param.codeOrName,
      startDate: param.startDate,
      endDate: param.endDate,
      parentJobId: param.parent ? param.parent.id : undefined,
      empId: param.empId,
    });
  },

  fetchAll: (param: FetchAllParam): AsyncGenerator<Job, void, void> => {
    if ('parentJobId' in param) {
      return fetchAll({
        targetDate: param.targetDate,
        parentJobId: param.parentJobId,
        empId: param.empId,
      });
    } else {
      return fetchAll({
        targetDate: param.targetDate,
        parentJobId: 'parent' in param ? param.parent.id : undefined,
        empId: param.empId,
      });
    }
  },

  fetchAllByDateRange: (param: {
    startDate: string;
    endDate: string;
    parent?: Job | null | undefined;
    empId?: string;
  }): AsyncGenerator<Job, void, void> => {
    return fetchAll({
      startDate: param.startDate,
      endDate: param.endDate,
      parentJobId: param.parent ? param.parent.id : undefined,
      empId: param.empId,
    });
  },

  /**
   * Execute search for entity with a given query
   */
  search: async (param: {
    targetDate: string;
    parent?: Job | null | undefined;
    ancestors?: JobTree;
    empId?: string;
  }): Promise<JobTree> => {
    const { jobList }: { jobList: Job[] } = await Api.invoke({
      path: '/time/job/get',
      param: {
        targetDate: param.targetDate,
        parentId: param.parent ? param.parent.id : undefined,
        empId: param.empId,
      },
    });
    const parentLevelItems: Job[][] = [...(param.ancestors || [])];
    const childLevelItems: Job[] = [
      ...jobList.map((job) => adapter.fromRemote<Job>(job)),
    ];
    return [...parentLevelItems, childLevelItems];
  },

  allHierarchicalSearch: async <T extends Jobable>({
    empId,
    targetDate,
    codeOrName,
    recordCount = ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT,
  }: {
    empId?: string;
    targetDate: string;
    codeOrName: string;
    recordCount?: number;
  }): Promise<{
    isMoreThanRecordCount: boolean;
    // FIXME: Array<Job>であるべきだが影響が広範なため時間がある時に見直す
    records: Array<T>;
  }> =>
    Api.invoke({
      path: '/time/job/all-hierarchical/search',
      param: {
        empId,
        targetDate,
        codeOrName,
        recordCount,
      },
    }),
};
