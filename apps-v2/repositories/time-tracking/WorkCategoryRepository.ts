import isNil from 'lodash/isNil';

import Api from '../../commons/api';
import DateUtil from '../../commons/utils/DateUtil';

import { WorkCategory } from '../../domain/models/time-tracking/WorkCategory';

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

const DEFAULT_LIMIT_NUMBER = 100;

export type ParamWithDateRange = {
  jobId: string;
  startDate: string;
  endDate: string;
  targetDate?: never;
};

export type ParamWithTargetDate = {
  jobId: string;
  startDate?: never;
  endDate?: never;
  targetDate: string;
};

export type Param = ParamWithDateRange | ParamWithTargetDate;

export default {
  /**
   * Execute to search work-category's IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{ ids: string[]; isOverLimit: boolean; totalCount: number }> => {
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: {
      idList: string[];
      recordSize: number;
    } = await Api.invoke({
      path: '/work-category/id/list',
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
   * Execute to get work-category's records
   */
  getRecords: (ids: string[]): Promise<WorkCategory[]> => {
    return Api.invoke({
      path: '/work-category/list',
      param: { ids },
    }).then((result: { records: WorkCategory[] }) => {
      return (result.records || []).map((record) => ({
        ...record,
        validDateTo: DateUtil.addDays(record.validDateTo || '', -1),
      }));
    });
  },

  /**
   * Fetch work-categories being active at a given targetDate
   */
  fetchList: async (param: Param): Promise<ReadonlyArray<WorkCategory>> => {
    const { workCategoryList } = await Api.invoke({
      path: '/time/work-category/get',
      param,
    });
    return workCategoryList;
  },
};
