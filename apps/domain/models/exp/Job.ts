import Api from '../../../commons/api';

export const DEFAULT_LIMIT_NUMBER = 100;

export type Job = {
  id: string;
  code: string;
  hasChildren?: boolean;
  hierarchyParentNameList: string[];
  name: string;
  parentId?: string;
};

export type JobList = Array<Job>;

/**
 * Get job list
 *
 * @param {?string} empId
 * @param {?string} parentId
 * @param {?string} targetDate
 * @param {number} [limitNumber]
 * @returns {Promise<JobList>}
 */
export const getJobList = (
  empId?: string,
  parentId?: string,
  targetDate?: string,
  limitNumber: number = DEFAULT_LIMIT_NUMBER
): Promise<JobList> => {
  return Api.invoke({
    path: '/exp/job/get',
    param: {
      empId,
      parentId,
      targetDate,
      maxCount: limitNumber,
    },
  }).then((response: { jobList: JobList }) => {
    return response.jobList;
  });
};

/**
 * Currently only used in mobile
 *
 * @param {string} companyId
 * @param {?string} empId
 * @param {?string} [parentId]
 * @param {string} targetDate
 * @param {?string} query
 * @param {number} [recordCount]
 * @returns {Promise<JobList>}
 */
export const searchJob = (
  companyId: string,
  empId: string,
  parentId: string,
  targetDate: string,
  query: string,
  recordCount: number = DEFAULT_LIMIT_NUMBER,
  usedIn?: string
): Promise<JobList> => {
  return Api.invoke({
    path: '/job/search',
    param: {
      companyId,
      empId,
      targetDate,
      query,
      recordCount: recordCount + 1,
      usedIn,
    },
  }).then((response: { records: JobList }) => {
    return response.records;
  });
};

/**
 *  Search job by code or name, currently only used in pc
 *
 * @param {?string} empId
 * @param {?string} [name]
 * @param {string} targetDate for report it's accounting date
 * @param {?string} query keyword contained in either code or name
 * @param {?string} usedIn 'REPORT' | 'REQUEST'
 * @returns {Promise<JobList>}
 */
export const searchJobByKeyword = (
  empId: string,
  name: string,
  targetDate: string,
  query?: string,
  usedIn?: string,
  companyId?: string,
  limitNumber: number = DEFAULT_LIMIT_NUMBER
): Promise<JobList> => {
  return Api.invoke({
    path: '/job/search',
    param: {
      empId,
      targetDate,
      query,
      usedIn,
      companyId,
      recordCount: limitNumber + 1,
    },
  }).then((response: { records: JobList }) => {
    return response.records;
  });
};

export const getRecentlyUsed = (
  targetDate: string,
  employeeBaseId: string
): Promise<JobList> => {
  return Api.invoke({
    path: '/job/recently-used/list',
    param: {
      targetDate,
      employeeBaseId,
    },
  }).then((response: { records: JobList }) => {
    return response.records;
  });
};
