import Api from '../../../commons/api';

export const DEFAULT_LIMIT_NUMBER = 100;

export type CostCenter = {
  id: string;
  baseId: string;
  code: string;
  hasChildren: boolean;
  hierarchyParentNameList: string[];
  historyId?: string;
  name: string;
  parent: {
    code: string;
    name: string;
  };
};

export type LatestCostCenter = {
  id: string;
  baseCode: string;
  baseId: string;
  comment: string;
  linkageCode: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  parentId: string;
  validDateFrom: string;
  validDateTo: string;
};

export const defaultCostCenter = {
  costCenterCode: null,
  costCenterHistoryId: null,
  costCenterName: null,
};

export type DefaultCostCenter = {
  costCenterCode?: string;
  costCenterHistoryId?: string;
  costCenterName?: string;
};

export type CostCenterList = Array<CostCenter>;

/**
 * Get Cost Center list
 *
 * @param {?string} companyId
 * @param {?string} [parentId]
 * @param {?string} targetDate
 * @param {number} [limitNumber]
 * @returns {Promise<CostCenterList>}
 */
export const getCostCenterList = (
  companyId?: string,
  parentId?: string,
  targetDate?: string,
  empId?: string,
  limitNumber: number = DEFAULT_LIMIT_NUMBER
): Promise<CostCenterList> => {
  return Api.invoke({
    path: '/exp/cost-center/get',
    param: {
      companyId,
      parentId,
      targetDate,
      maxCount: limitNumber,
      empId,
    },
  }).then((response: { costCenterList: CostCenterList }) => {
    return response.costCenterList;
  });
};

/**
 * Search Cost Center
 *
 * @param {?string} companyId
 * @param {?string} [parentId]
 * @param {?string} targetDate
 * @param {?string} query
 * @param {?string} usedIn
 * @param {?Array<string>} detailSelector
 * @param {number} [limitNumber]
 * @returns {Promise<CostCenterList>}
 */
export const searchCostCenter = (
  companyId?: string,
  parentId?: string,
  targetDate?: string,
  query?: string,
  usedIn?: string,
  detailSelector?: string[],
  limitNumber: number = DEFAULT_LIMIT_NUMBER
): Promise<CostCenterList> => {
  return Api.invoke({
    path: '/cost-center/search',
    param: {
      companyId,
      targetDate,
      query,
      usedIn,
      detailSelector,
      maxCount: limitNumber + 1,
    },
  }).then((response: { records: CostCenterList }) => {
    return response.records;
  });
};

// Correct API path
export const getRecentlyUsed = (
  employeeBaseId: string,
  targetDate: string
): Promise<CostCenterList> => {
  return Api.invoke({
    path: '/cost-center/recently-used/list',
    param: { employeeBaseId, targetDate },
  }).then((response: { records: CostCenterList }) => {
    return response.records;
  });
};

// Get Default Cost Center API
export const getDefaultCostCenter = (
  employeeId: string,
  targetDate: string
): Promise<DefaultCostCenter> => {
  return Api.invoke({
    path: '/cost-center/default/get',
    param: { employeeId, targetDate },
  })
    .then((response: DefaultCostCenter) => {
      return response;
    })
    .catch((err) => {
      throw err;
    });
};

export const getLatestCostCenter = (
  historyId: string,
  targetDate: string
): Promise<LatestCostCenter> => {
  return Api.invoke({
    path: '/cost-center/history/latest',
    param: { historyId, targetDate },
  })
    .then((response: LatestCostCenter) => response)
    .catch((err) => {
      throw err;
    });
};
