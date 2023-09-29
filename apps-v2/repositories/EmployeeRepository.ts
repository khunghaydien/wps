import { $Shape } from 'utility-types';

import Api from '../commons/api';

import {
  PRODUCT_CATEGORY,
  ProductCategory,
} from '../domain/models/access-control/RecordAccess';
import { Employee } from '../domain/models/organization/Employee';

import adapter from './adapters';

export const PRODUCT_CATEGORY_OF_RECORD_ACCESS = PRODUCT_CATEGORY;

export type SearchQuery = $Shape<{
  id?: string;
  companyId?: string;
  targetDate?: string;
  code?: string;
  name?: string;
  departmentId?: string;
  departmentCode?: string;
  departmentName?: string;
  title?: string;
  managerName?: string;
  workingTypeName?: string;
  approvalAuthority01?: boolean;
  hasRecordAccess?: boolean;
  isHadRecordAccess?: boolean;
  product?: ProductCategory;
  limitNumber?: number;
  primary?: boolean;
}>;

const queryToParam = (query: SearchQuery) => {
  return { ...query };
};

// NOTE
// Api.invoke should be also abstracted for testability?
export default {
  /**
   * Execture search for emloyees with a given query
   */
  search: (query: SearchQuery): Promise<Employee[]> => {
    return Api.invoke({
      path: '/employee/search',
      param: queryToParam(query),
    }).then((result: { records: Record<string, any>[] }) => {
      return (result.records || []).map((record) => adapter.fromRemote(record));
    });
  },

  /**
   * Set limits and search for employees.
   * Returns the number of records below the limit and a flag indicating whether the limit is exceeded.
   */
  searchBySettingLimit: (
    query: SearchQuery,
    limitNumber: number
  ): Promise<{ records: Employee[]; isOverLimit: boolean }> => {
    return Api.invoke({
      path: '/employee/search',
      param: queryToParam({ ...query, limitNumber: limitNumber + 1 }),
    }).then((result: { records: Record<string, any>[] }) => {
      const convertedRecords = (result.records || []).map((record) =>
        adapter.fromRemote(record)
      );
      return {
        records: convertedRecords.slice(0, limitNumber),
        isOverLimit: convertedRecords.length > limitNumber,
      };
    });
  },

  /**
   * Set limits and search for employees, Returns records with the specified employee removed.
   * Returns the number of records below the limit and a flag indicating whether the limit is exceeded.
   *
   * FIXME: Since the logic to remove the selected record should be in BE, this function will be deleted in the future
   */
  searchAndRemoveUserBySettingLimit: (
    query: SearchQuery,
    limitNumber: number,
    removeEmpId: string
  ): Promise<{ records: Employee[]; isOverLimit: boolean }> => {
    return Api.invoke({
      path: '/employee/search',
      param: queryToParam({ ...query, limitNumber: limitNumber + 2 }),
    }).then((result: { records: Record<string, any>[] }) => {
      const convertedRecords = (result.records || [])
        .map((record) => adapter.fromRemote(record))
        .filter((record: { id: string }) => record.id !== removeEmpId);
      return {
        records: convertedRecords.slice(0, limitNumber),
        isOverLimit: convertedRecords.length > limitNumber,
      };
    });
  },

  /**
   * Exectue to get an employee
   */

  /* Not required for Employee
  fetch: (id: string): Promise<Employee> => {
    return Api.invoke({
      path: '/employee/get',
      param: { id },
    }).then(adapter.fromRemote);
  },
  */

  /**
   * Exectue to update an employee
   */
  update: (entity: Employee): Promise<void> => {
    return Api.invoke({
      path: '/employee/update',
      param: adapter.toRemote(entity),
    });
  },

  /**
   * Exectue to create a new employee
   */
  create: (entity: Employee): Promise<void> => {
    return Api.invoke({
      path: '/employee/create',
      param: adapter.toRemote(entity),
    });
  },

  /**
   * Exectue to delete an employee
   */
  delete: (id: string): Promise<void> => {
    return Api.invoke({
      path: '/employee/delete',
      param: { id },
    });
  },
};
