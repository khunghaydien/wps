import isNil from 'lodash/isNil';

import Api from '../../commons/api';
import DateUtil from '@apps/commons/utils/DateUtil';

import { JobHistory } from '../../domain/models/time-tracking/JobHistory';

import adapter from '../adapters';

const ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT = 1000;

async function* searchAll({
  codeOrName,
  startDate,
  endDate,
  parentJobId,
  empId,
}: {
  codeOrName: string;
  empId?: string;
  parentJobId?: string;
  startDate: string;
  endDate: string;
}): AsyncGenerator<JobHistory, void, void> {
  const commonParam: { [key: string]: unknown } = {
    codeOrName,
    empId,
    parentBaseId: parentJobId,
    startDate,
    endDate,
  };
  const search = (
    tailUniqueKey?: string,
    // @ts-ignore
    pageSize: number
  ): Promise<{ jobList: JobHistory[]; tailUniqueKey: null | string }> => {
    return Api.invoke({
      path: '/time/job/history/get',
      param: {
        ...commonParam,
        tailUniqueKey,
        pageSize,
      },
    });
  };

  const INITIAL_PAGE_SIZE = 30;
  const PAGE_SIZE = 3000;
  // @ts-ignore
  const loadLazy = async function* (prev?: string, pageSize: number) {
    const { jobList, tailUniqueKey } = await search(prev, pageSize);
    for (const job of jobList) {
      yield adapter.fromRemote(job, [
        (job) => ({
          ...job,
          validTo: DateUtil.addDays(job.validTo, -1),
        }),
      ]);
    }
    if (!isNil(tailUniqueKey) && jobList.length > 0) {
      yield* loadLazy(tailUniqueKey, PAGE_SIZE);
    }
  };

  yield* loadLazy(undefined, INITIAL_PAGE_SIZE);
}

async function* fetchAll(param: {
  startDate: string;
  endDate: string;
  parentJobId?: string;
  empId?: string;
}): AsyncGenerator<JobHistory, void, void> {
  yield* searchAll({ ...param, codeOrName: '' });
}

export default {
  searchAll: (param: {
    codeOrName: string;
    startDate: string;
    endDate: string;
    parentJobId?: string;
    parent?: JobHistory | null | undefined;
    empId?: string;
  }): AsyncGenerator<JobHistory, void, void> => {
    return searchAll({
      codeOrName: param.codeOrName,
      startDate: param.startDate,
      endDate: param.endDate,
      parentJobId:
        param.parentJobId || param.parent ? param.parent?.baseId : undefined,
      empId: param.empId,
    });
  },

  fetchAll: (param: {
    startDate: string;
    endDate: string;
    parentJobId?: string;
    parent?: JobHistory | null | undefined;
    empId?: string;
  }): AsyncGenerator<JobHistory, void, void> => {
    return fetchAll({
      startDate: param.startDate,
      endDate: param.endDate,
      parentJobId:
        param.parentJobId || param.parent ? param.parent?.baseId : undefined,
      empId: param.empId,
    });
  },

  allHierarchicalSearch: async ({
    empId,
    startDate,
    endDate,
    codeOrName,
    recordCount = ALL_HIERARCHICAL_SEARCH_DEFAULT_RECORD_COUNT,
  }: {
    empId?: string;
    startDate: string;
    endDate: string;
    codeOrName: string;
    recordCount?: number;
  }): Promise<{
    isMoreThanRecordCount: boolean;
    records: Array<JobHistory>;
  }> => {
    const {
      isMoreThanRecordCount,
      records,
    }: {
      isMoreThanRecordCount: boolean;
      records: Array<JobHistory>;
    } = await Api.invoke({
      path: '/time/job/history/all-hierarchical/search',
      param: {
        empId,
        startDate,
        endDate,
        codeOrName,
        recordCount,
      },
    });
    return {
      isMoreThanRecordCount,
      records: records.map<JobHistory>((record) => ({
        ...record,
        validTo: DateUtil.addDays(record.validTo, -1),
      })),
    };
  },
};
