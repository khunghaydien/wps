import isNil from 'lodash/isNil';

import Api from '../../../commons/api';

export type Order = 'ASC' | 'DESC';

export type SearchQuery = {
  companyId: string;
  sortCondition?: {
    field: string;
    order: Order;
  };
  code?: string;
  name?: string;
  limitNumber?: number;
};

export type JobType = {
  id: string;
  name: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  code: string;
  companyId: string;
  workCategoryIdList: string[];
};

export const defaultValue = {
  id: '',
  name: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L0: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L1: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L2: '',
  code: '',
  companyId: '',
  workCategoryIdList: [],
};

const DEFAULT_LIMIT_NUMBER = 100;

export const Repository = {
  /**
   * Execute to search job-type's IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{
    ids: string[];
    isOverLimit: boolean;
    totalCount: number;
  }> => {
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: {
      idList: string[];
      recordSize: number;
    } = await Api.invoke({
      path: '/job-type/id/list',
      param: {
        ...param,
        limitNumber: limitNumber + 1,
      },
    });
    const recordIds = result.idList || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
      totalCount: result.recordSize,
    };
  },

  /**
   * Execute to get job-type's records
   */
  getRecords: (ids: string[]): Promise<JobType> => {
    return Api.invoke({
      path: '/job-type/list',
      param: { ids },
    }).then((result: { records: JobType[] }) => {
      return result.records || [];
    });
  },

  linkWorkCategories: (
    jobTypeId: string,
    workCategoryIds: string[]
  ): Promise<JobType> => {
    return Api.invoke({
      path: '/job-type/work-category/link',
      param: { jobTypeId, workCategoryIds },
    });
  },

  unlinkWorkCategories: (
    jobTypeId: string,
    workCategoryIds: string[]
  ): Promise<JobType> => {
    return Api.invoke({
      path: '/job-type/work-category/unlink',
      param: { jobTypeId, workCategoryIds },
    });
  },

  searchJobTypes: (param: {
    code: string;
    name: string;
    companyId: string;
  }): JobType[] => {
    return Api.invoke({
      path: '/job-type/search',
      param,
    }).then((res: { records: JobType[] }) => {
      return res.records;
    });
  },
};
