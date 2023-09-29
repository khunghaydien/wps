// @flow

import isNil from 'lodash/isNil';

import Api from '../../../commons/api';

export type Order = 'ASC' | 'DESC';

const DEFAULT_LIMIT_NUMBER = 100;

export type SearchQuery = {|
  companyId: string,
  sortCondition: {
    field: string,
    order: Order,
  },
  targetDate?: string,
  code?: string,
  name?: string,
  remarks?: string,
  limitNumber?: number,
|};

export type Department = {|
  id: string,
  code: string,
  name: string,
  remarks: string,
  validFrom: string,
  validTo: string,
|};

export default {
  /**
   * Execute to search department's IDs
   */
  searchIds: async (
    param: SearchQuery
  ): Promise<{ ids: string[], isOverLimit: boolean }> => {
    const { sortCondition, name, code, targetDate, companyId } = param;
    const { field, order } = sortCondition;
    const limitNumber = isNil(param.limitNumber)
      ? DEFAULT_LIMIT_NUMBER
      : param.limitNumber;
    const result: { idList: string[] } = await Api.invoke({
      path: '/department/id/list',
      param: {
        searchCondition: { name, code, targetDate, companyId },
        sortCondition: {
          field,
          order: order === 'DESC' ? 'DESC NULLS LAST' : 'ASC NULLS FIRST',
        },
        limitNumber: limitNumber + 1,
      },
    });
    const idList = result.idList || [];
    return {
      ids: idList.slice(0, limitNumber),
      isOverLimit: idList.length > limitNumber,
    };
  },

  /**
   * Execute to get department's records
   */
  getRecords: async (
    ids: string[],
    targetDate: string
  ): Promise<Department[]> => {
    const result: { baseList: Department[] } = await Api.invoke({
      path: '/department/list',
      param: {
        ids,
        targetDate,
      },
    });
    return result.baseList || [];
  },
};
