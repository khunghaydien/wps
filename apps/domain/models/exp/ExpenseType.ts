import isNil from 'lodash/isNil';

import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

import { ExtendedItemExpectedList, initialEmptyEIs } from './ExtendedItem';
import { FOREIGN_CURRENCY_USAGE } from './foreign-currency/Currency';
import { RECEIPT_TYPE } from './Record';

const DEFAULT_LIMIT_NUMBER = 100;

export type FixedAllowanceOption = {
  id: string;
  allowanceAmount: number;
  label: string;
};

// 経費一覧
/* eslint-disable camelcase */
export type AmountOption = {
  id?: string;
  allowanceAmount: number;
  allowanceAmount_error?: boolean;
  label?: string;
  label_L0: string;
  label_L0_error?: boolean;
  label_L1: string;
  label_L2?: string;
};

export type ExpenseType = ExtendedItemExpectedList & {
  id: string;
  code: string;
  description: string;
  displayJctNumberInput?: boolean;
  fileAttachment: string;
  fixedAllowanceOptionList?: Array<AmountOption>;
  fixedAllowanceSingleAmount?: number;
  fixedForeignCurrencyId?: string;
  foreignCurrencyUsage?: string;
  hasChildren: boolean;
  hierarchyParentNameList?: Array<string>;
  isFavorite?: boolean;
  isGroup: boolean;
  jctRegistrationNumberUsage?: string;
  merchant?: string;
  name: string;
  order?: number;
  parentGroup: { name: string };
  parentGroupCode: string;
  parentGroupId?: string;
  recordType: string;
  taxTypeIdList?: Array<string>;
  useForeignCurrency: boolean;
  validDateFrom?: string;
  validDateTo?: string;
};

export type ExpenseTypeList = Array<ExpenseType>;

export type ExpenseTypeListResult = {
  hasMore: boolean;
  records: ExpenseTypeList;
};

/*
 * Filter for credit card record exp type
 */
export const creditCardFilter = (expType: ExpenseType) => {
  return expType.isGroup || !expType.useForeignCurrency;
};

/*
 * Filter for ocr record exp type
 */
export const ocrFilter = (expType: ExpenseType) => {
  const { isGroup, fileAttachment, foreignCurrencyUsage } = expType;
  const useReceipt = [RECEIPT_TYPE.Required, RECEIPT_TYPE.Optional].includes(
    fileAttachment
  );
  const isNotForeign = foreignCurrencyUsage === FOREIGN_CURRENCY_USAGE.NotUsed;
  return isGroup || (useReceipt && isNotForeign);
};

/**
 * Expense type cateogory list
 *
 * @param {?string} empId
 * @param {?string} parentGroupId
 * @param {?string} targetDate
 * @param {?string} recordType
 * @param {string} [usedIn]
 * @param {?string} expReportTypeId
 * @param {?boolean} filterByEmployeeGroup
 * @returns {Promise<ExpenseTypeList>}
 */
export const getExpenseTypeList = (
  empId?: string,
  parentGroupId?: string,
  targetDate?: string,
  recordType?: string,
  usedIn?: string | undefined,
  expReportTypeId?: string,
  filterByEmployeeGroup?: boolean,
  excludedRecordTypes?: string[]
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/list',
    param: {
      empId,
      parentGroupId,
      targetDate,
      recordType,
      usedIn,
      expReportTypeId,
      filterByEmployeeGroup,
      excludedRecordTypes,
    },
  }).then(
    (response: { expenseTypes: ExpenseTypeList }) => response.expenseTypes
  );
};

/**
 * Search Expense Types by keyword
 *
 * @param {?string} companyId
 * @param {?string} query
 * @param {?string} targetDate
 * @param {string} [usedIn]
 * @param {?string} expReportTypeId
 * @param {boolean} [withParentHierarchy]
 * @param {string} [recordType]
 * @param {?boolean} filterByEmployeeGroup
 * @param {string} [employeeBaseId]
 * @returns {Promise<ExpenseTypeListResult>}
 */
export const searchExpenseType = (
  companyId: string,
  query: string,
  targetDate: string,
  usedIn: string | undefined,
  expReportTypeId: string,
  withParentHierarchy: boolean | undefined,
  recordType: string | undefined,
  filterByEmployeeGroup: boolean,
  employeeBaseId: string | undefined,
  limitNumber: number | undefined,
  excludedRecordTypes?: string[]
): Promise<ExpenseTypeListResult> => {
  const limitNum = isNil(limitNumber) ? DEFAULT_LIMIT_NUMBER : limitNumber;
  // in case search is done with id, it should return all extended items.
  return Api.invoke({
    path: '/exp/expense-type/search',
    param: {
      companyId,
      query,
      targetDate,
      withExtendedItems: false,
      usedIn,
      expReportTypeId,
      withParentHierarchy,
      recordType,
      filterByEmployeeGroup,
      employeeBaseId,
      limitNumber: limitNum + 1,
      excludedRecordTypes,
    },
  }).then((response: ExpenseTypeListResult) => {
    return {
      records: response.records,
      hasMore: response.records.length > limitNum,
    };
  });
};

/**
 * Get favorite expense type list
 *
 * @param {string} employeeBaseId
 * @param {string} targetDate
 * @param {?string} usedIn
 * @param {string} companyId
 * @param {?string} recordType
 * @param {string} reportTypeId
 * @returns {Promise<ExpenseTypeList>}
 */
export const getFavoriteExpenseTypes = (
  employeeBaseId: string,
  targetDate: string,
  usedIn: string,
  companyId: string,
  recordType: string,
  reportTypeId: string,
  excludedRecordTypes?: string[]
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/favorite/list',
    param: {
      employeeBaseId,
      targetDate,
      usedIn,
      companyId,
      recordType,
      reportTypeId,
      excludedRecordTypes,
    },
  }).then((response: { records: ExpenseTypeList }) => response.records);
};

export const favoriteExpenseType = (
  employeeBaseId: string,
  targetId: string,
  masterType: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/favorite',
    param: {
      employeeBaseId,
      targetId,
      masterType,
    },
  });
};

export const unfavoriteExpenseType = (
  employeeBaseId: string,
  targetId: string,
  masterType: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/unfavorite',
    param: {
      employeeBaseId,
      targetId,
      masterType,
    },
  });
};

/**
 * Search expense types by parent expense type
 * e.g. Search the expense types linked to hotel fee exp type
 *
 * @param {string} targetDate
 * @param {string} parentId
 * @param {string} usedIn
 * @returns {Promise<ExpenseTypeList>}
 */
export const searchExpTypesByParentRecord = (
  targetDate: string,
  parentId: string,
  usedIn: string
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/list-child',
    param: {
      targetDate,
      parentId,
      usedIn,
      withExtendedItems: true,
    },
  }).then(
    (response: { childExpTypeList: ExpenseTypeList }) =>
      response.childExpTypeList
  );
};

/**
 * Search expense types by record type
 * Currently only used in mobile
 *
 * @param {string} companyId
 * @param {?string} targetDate
 * @param {?string} recordType
 * @param {string} [usedIn]
 * @param {?boolean} filterByEmployeeGroup
 * @param {boolean} [withExtendedItems=true]
 * @returns {Promise<ExpenseTypeList>}
 */
export const searchExpenseTypeWithRecord = (
  companyId: string,
  targetDate: string,
  recordType: string,
  usedIn: string | undefined,
  filterByEmployeeGroup?: boolean,
  withExtendedItems = true,
  limitNumber?: number,
  expReportTypeId?: string
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/search',
    param: {
      companyId,
      targetDate,
      recordType,
      withExtendedItems,
      usedIn,
      filterByEmployeeGroup,
      limitNumber,
      expReportTypeId,
    },
  }).then((response: { records: ExpenseTypeList }) => response.records);
};

export const searchExpenseTypeByReportType = (
  empId?: string,
  companyId?: string,
  targetDate?: string,
  expReportTypeId?: string,
  usedIn?: string,
  excludeDetails?: boolean,
  startDate?: string,
  endDate?: string
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/search',
    param: {
      empId,
      companyId,
      targetDate,
      expReportTypeId,
      usedIn,
      excludeDetails,
      startDate,
      endDate,
    },
  }).then((response: { records: ExpenseTypeList }) => response.records);
};

export type ExpTypeSearchQuery = {
  code?: string;
  companyId?: string;
  expGroupCode?: string;
  expGroupName?: string;
  fixedForeignCurrencyId?: string;
  foreignCurrencyUsage?: string;
  name?: string;
  recordType?: string;
  targetDate?: string;
};

/**
 * Get recent list
 *
 * @param {string} employeeBaseId
 * @param {string} companyId
 * @param {string} [targetDate]
 * @param {string} [recordType]
 * @param {string} [reportTypeId]
 * @param {string} [usedIn]
 * @param {boolean} [withParentHierarchy]
 * @returns {Promise<ExpenseTypeList>}
 */
export const getRecentlyUsed = (
  employeeBaseId: string,
  companyId: string,
  targetDate: string | undefined,
  recordType: string | undefined,
  reportTypeId: string | undefined,
  usedIn: string | undefined,
  withParentHierarchy: boolean | undefined,
  excludedRecordTypes?: string[]
): Promise<ExpenseTypeList> => {
  return Api.invoke({
    path: '/exp/expense-type/recently-used/list',
    param: {
      employeeBaseId,
      companyId,
      targetDate,
      recordType,
      reportTypeId,
      usedIn,
      withParentHierarchy,
      excludedRecordTypes,
    },
  }).then((response: { records: ExpenseTypeList }) => response.records);
};

/**
 * Search expense type by id
 *
 * @param {string} id
 * @param {string} [usedIn]
 * @returns {Promise<ExpenseType>}
 */
export const getExpenseTypeById = (
  id: string,
  usedIn?: string
): Promise<ExpenseType> => {
  return Api.invoke({
    path: '/exp/expense-type/search',
    param: {
      id,
      withExtendedItems: true,
      usedIn,
    },
  }).then((result: { records: ExpenseType[] }) => {
    return (result.records || []).map((record) => ({
      ...record,
      validDateTo: DateUtil.addDays(record.validDateTo || '', -1),
    }));
  });
};

// following code is used only in Admin screen
export type Order = 'ASC' | 'DESC';

export type SearchQuery = {
  code?: string;
  companyId: string;
  foreignCurrencyUsage?: string;
  limitNumber?: number;
  name?: string;
  parentExpenseTypeGroupName?: string;
  receiptSetting?: string;
  recordType?: string;
  sortCondition?: {
    field: string;
    order: Order;
  };
};

export const defaultValue = {
  id: '',
  code: '',
  name: '',
  description: '',
  parentGroupId: '',
  isGroup: false,
  hasChildren: false,
  recordType: '',
  fileAttachment: '',
  useForeignCurrency: false,
  parentGroupCode: '',
  parentGroup: { name: '' },
  ...initialEmptyEIs,
  fixedAllowanceSingleAmount: 0,
  taxTypeIdList: [],
};

export const Repository = {
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
      path: '/exp/expense-type/id-list',
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
  getRecords: (ids: string[]): Promise<ExpenseType[]> => {
    return Api.invoke({
      path: '/exp/expense-type/list/get',
      param: { ids },
    }).then((result: { records: ExpenseType[] }) => {
      return (result.records || []).map((record) => ({
        ...record,
        validDateTo: DateUtil.addDays(record.validDateTo || '', -1),
      }));
    });
  },
};
