import isNil from 'lodash/isNil';

import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

import { Job } from '../../../domain/models/organization/Job';

export type Order = 'ASC' | 'DESC';

export type SearchQuery = {
  companyId: string;
  sortCondition?: {
    field: string;
    order: Order;
  };
  code?: string;
  name?: string;
  jobType?: string;
  departmentName?: string;
  parentJobName?: string;
  limitNumber?: number;
  targetDate?: string;
};

const DEFAULT_LIMIT_NUMBER = 100;

export default {
  /**
   * Execute to search job's IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{ ids: string[]; isOverLimit: boolean; totalCount: number }> => {
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: {
      idList: string[];
      totalCount: number;
    } = await Api.invoke({
      path: '/job/id/list',
      param: {
        ...param,
        limitNumber: limitNumber + 1,
      },
    });
    const recordIds = result.idList || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
      totalCount: result.totalCount,
    };
  },

  /**
   * Execute to get job's records
   */
  getRecords: (ids: string[]): Promise<Job[]> => {
    return Api.invoke({
      path: '/job/list',
      param: { ids },
    }).then((result: { records: Job[] }) => {
      return (result.records || []).map((record) => ({
        ...record,
        validDateTo: DateUtil.addDays(record.validDateTo, -1),
      }));
    });
  },
};
