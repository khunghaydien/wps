import Api from '../../commons/api';

import { Allowances } from '../daily-allowance/models/attDailyAllowanceAll';
import { recordAllowance } from '../daily-allowance/models/attDailyRecordAllowance';
import {
  convertFromRemote,
  DailyAllowanceSummary,
} from '@attendance/domain/models/AttDailyAllowanceSummary';

export default {
  /**
   * Execute search for entity with a given query
   */
  search: async (param: {
    empId?: string;
    startDate: string;
    endDate: string;
  }): Promise<DailyAllowanceSummary> => {
    const result = await Api.invoke({
      path: '/att/daily-allowance/get',
      param,
    });
    return convertFromRemote(result);
  },

  /**
   * Execute search for List of available allowances
   */
  searchAvailableAllowances: async (
    targetDate: string,
    empId?: string
  ): Promise<recordAllowance> => {
    const params = {
      targetDate,
      empId,
    };
    return Api.invoke({
      path: '/att/daily-allowance/list',
      param: params || {},
    });
  },

  /**
   * save selected allowances
   */
  saveDailyAllowances: async (
    dailyAllowances: Allowances[],
    targetDate: string,
    empId: string
  ): Promise<Readonly<{ isSuccess: true; result: null }>> => {
    const param = {
      dailyAllowances,
      targetDate,
      empId,
    };
    return Api.invoke({
      path: '/att/daily-allowance/save',
      param: param || {},
    });
  },

  /**
   * Execute to get an entity
   */

  /*
  fetch: async (param: {|
  |}): Promise<{}> => {
  },
    */

  /**
   * Execute to update an entity
   */

  /*
  update: async (
  ): Promise<{}> => {
  },
    */

  /**
   * Execute to create a new entity
   */

  /*
  create: (entity: {||}): Promise<void> => {},
  */

  /**
   * Execute to delete an employee
   */

  /*
  delete: (id: string): Promise<void> => {
  },
  */
};
