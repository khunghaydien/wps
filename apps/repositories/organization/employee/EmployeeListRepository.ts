import { cloneDeep, get, isNil, set } from 'lodash';

import Api from '../../../commons/api';

export type Order = 'ASC' | 'DESC';

const DEFAULT_LIMIT_NUMBER = 100;

export type SearchQuery = {
  companyId: string;
  sortCondition?: {
    field: string;
    order: Order;
  };
  targetDate?: string;
  code?: string;
  name?: string;
  departmentName?: string;
  title?: string;
  managerName?: string;
  workingTypeName?: string;
  limitNumber?: number;
};

export type SearchConditionV2 = {
  companyId?: string;
  name?: string;
  code?: string;
  departmentName?: string;
  positionName?: string;
  companyName?: string;
  targetDate: string;
  includeInactiveEmployee: boolean;
};

export type SearchQueryV2 = {
  searchCondition: SearchConditionV2;
  sortCondition: {
    field: string;
    order: Order;
  };
  numberOfRecordsToRetrieve: number;
};

export type Employee = {
  id: string;
  historyId: string;
  code: string;
  name: string;
  departmentName: string;
  managerName: string;
  title: string;
  photoUrl: string;
  workingTypeName: string;
};

export type EmployeeV2 = Employee & {
  positionName: string;
};

export default {
  /**
   * Execute to search employee's IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{ ids: string[]; isOverLimit: boolean }> => {
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: { recordIds: string[] } = await Api.invoke({
      path: '/employee/id/search',
      param: {
        ...param,
        limitNumber: limitNumber + 1,
      },
    });
    const recordIds = result.recordIds || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
    };
  },

  /**
   * Execute to get employee's records
   */
  getRecords: async (
    ids: string[],
    targetDate: string
  ): Promise<EmployeeV2[]> => {
    const result: { empDataList: EmployeeV2[] } = await Api.invoke({
      path: '/employee/list',
      param: {
        ids,
        targetDate,
      },
    });
    return result.empDataList || [];
  },

  /**
   * Execute to search employee's IDs for V2
   */
  searchIdsV2: async (
    param: SearchQueryV2
  ): Promise<{ ids: string[]; isOverLimit: boolean }> => {
    const limitNumber = isNil(param.numberOfRecordsToRetrieve)
      ? DEFAULT_LIMIT_NUMBER
      : param.numberOfRecordsToRetrieve;

    const paramCopy = cloneDeep(param);
    const order =
      get(paramCopy, 'sortCondition.order') === 'DESC'
        ? 'DESC NULLS LAST'
        : 'ASC NULLS FIRST';
    set(paramCopy, 'sortCondition.order', order);

    const result: { idList: string[]; totalCount: number } = await Api.invoke({
      path: '/employee/id/search',
      param: {
        ...paramCopy,
        numberOfRecordsToRetrieve: limitNumber + 1,
      },
    });
    const recordIds = result.idList || [];
    return {
      ids: recordIds.slice(0, limitNumber),
      isOverLimit: recordIds.length > limitNumber,
    };
  },

  /**
   * Execute to get employee's records
   */
  getRecordsV2: async (
    ids: string[],
    targetDate: string
  ): Promise<EmployeeV2[]> => {
    const result: { empDataList: EmployeeV2[] } = await Api.invoke({
      path: '/employee/list',
      param: {
        ids,
        targetDate,
        primary: true,
      },
    });
    return result.empDataList || [];
  },
};
