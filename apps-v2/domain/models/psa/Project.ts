import Api from '../../../commons/api';

import { ExtendedItem } from '@apps/domain/models/psa/ExtendedItem';

import { formatEmptyDate } from './../../../resource-pc/utils/index';

export type ProjectStatus = {
  readonly Planning: 'Planning';
  readonly InProgress: 'InProgress';
  readonly Completed: 'Completed';
  readonly Cancelled: 'Cancelled';
};

export type ProgressFrequency = {
  readonly Weekly: 'Weekly';
  readonly Monthly: 'Monthly';
};

export type WeekDay = {
  readonly Monday: 'Monday';
  readonly Tuesday: 'Tuesday';
  readonly Wednesday: 'Wednesday';
  readonly Thursday: 'Thursday';
  readonly Friday: 'Friday';
  readonly Saturday: 'Saturday';
  readonly Sunday: 'Sunday';
};

export type BaseInfo = {
  companyId: string;
  projectId?: string;
  code: string;
  name: string;
  currentDetailId?: string;
  startDate: string;
  endDate: string;
  jobCode: string;
  jobId?: string;
  status?: ProjectStatus[keyof ProjectStatus] | string;
  opportunityId?: string;
  opportunityName?: string;
  clientCode: string;
  clientId: string;
  clientName: string;
  description?: string;
  extendedItemValueId: string;
  extendedItems: Array<ExtendedItem>;
};

export type Financials = {
  contractAmount?: number;
  contractType?: string;
  extendedItemValueId: string;
  extendedItems: Array<ExtendedItem>;
  targetMargin?: number;
};

export type NotificationSetting = {
  extendedItemValueId: string;
  extendedItems: Array<ExtendedItem>;
  firstCheckDate: string;
  progressCheckFrequency?: string;
  pushNotificationDate?: string;
  pushNotificationDay?: string;
};

export type Operation = {
  deptCode: string;
  deptId: string;
  deptName: string;
  extendedItemValueId: string;
  extendedItems: Array<ExtendedItem>;
  groupId: string;
  groupName: string;
  pmBaseId: string;
  pmCode: string;
  pmName: string;
};

export type PlanningOptions = {
  calendarId: string;
  extendedItemValueId: string;
  extendedItems: Array<ExtendedItem>;
  planningCycle: string;
  workingDayFRI: boolean;
  workingDayMON: boolean;
  workingDaySAT: boolean;
  workingDaySUN: boolean;
  workingDayTHU: boolean;
  workingDayTUE: boolean;
  workingDayWED: boolean;
  workTimePerDay: number;
};

export type ProjectResponse = {
  baseInfo: BaseInfo;
  financials: Financials;
  notificationSetting: NotificationSetting;
  operation: Operation;
  planningOptions: PlanningOptions;
};

export type Project = {
  calendarId?: string;
  clientCode: string;
  clientId: string;
  clientName: string;
  code: string;
  companyId: string;
  currentDetailId?: string;
  deptCode: string;
  deptId: string;
  deptName: string;
  description?: string;
  endDate: string;
  extendedItems: Array<ExtendedItem>;
  extendedItemValueId: string;
  groupId?: string;
  groupName?: string;
  jobCode: string;
  name: string;
  opportunityId?: string;
  opportunityName?: string;
  pmBaseId?: string;
  pmCode?: string;
  pmName?: string;
  projectId?: string;
  revisionComment?: string;
  rmCode?: string;
  rmName?: string;
  startDate: string;
  status?: ProjectStatus[keyof ProjectStatus] | string;
  uniqKey?: string;
  workingDayFRI: boolean;
  workingDayMON: boolean;
  workingDaySAT: boolean;
  workingDaySUN: boolean;
  workingDayTHU: boolean;
  workingDayTUE: boolean;
  workingDayWED: boolean;
  workTimePerDay: number;
};

export type ProjectListItem = {
  clientId?: null;
  clientName?: null;
  companyId: string;
  currentDetailId: string;
  deptName?: string;
  endDate?: null;
  name: string;
  pmBaseId?: null;
  pmName?: string;
  projectId: string;
  projectJobCode: string;
  startDate?: string;
  status: string;
  workTimePerDay?: number;
};

export type ProjectListFilterState = {
  clientName?: string;
  deptName?: string;
  jobId?: string;
  projectCode?: string;
  projectEndDate?: Array<string>;
  projectManager?: string;
  projectManagerCode?: string;
  projectStartDate?: Array<string>;
  projectTitle?: string;
  requester?: string;
  requesterCode?: string;
  statusList?: Array<string>;
};

export type ProjectList = Array<ProjectListItem>;

export const initialProjectListFilterState = (loggedInUser: string) => {
  const today = new Date().toISOString().slice(0, 10);

  return {
    projectTitle: '',
    projectCode: '',
    projectManagerCode: '',
    clientName: '',
    jobId: '',
    deptName: '',
    requester: '',
    requesterCode: '',
    projectManager: loggedInUser,
    projectStartDate: ['', ''],
    projectEndDate: [today, ''],
    statusList: ['Planning', 'InProgress'],
  };
};

export const PROJECT_STATUS: ProjectStatus = {
  Planning: 'Planning',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

export const PROGRESS_FREQUENCY: ProgressFrequency = {
  Weekly: 'Weekly',
  Monthly: 'Monthly',
};

export const WEEK_DAY: WeekDay = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
};

export const PROJECT_CATEGORY = {
  baseInfo: 'baseInfo',
  financials: 'financials',
  notificationSetting: 'notificationSetting',
  operation: 'operation',
  planningOptions: 'planningOptions',
};

export type PageInfo = {
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  pageNum: number;
  pageData: ProjectList;
};

export const initialStateProjectList = {
  totalRecords: 0,
  totalPages: 0,
  pageSize: 0,
  pageNum: 0,
  pageData: [],
};

export const initialStateProject = {
  calendarId: '',
  clientCode: '',
  clientId: '',
  clientName: '',
  code: '',
  companyId: '',
  currentDetailId: '',
  deptCode: '',
  deptId: '',
  deptName: '',
  description: '',
  endDate: '',
  extendedItems: null,
  extendedItemValueId: '',
  jobCode: '',
  name: '',
  pmBaseId: '',
  projectId: '',
  revisionComment: '',
  startDate: '',
  status: '',
  uniqKey: '',
  workingDayFRI: true,
  workingDayMON: true,
  workingDaySAT: false,
  workingDaySUN: false,
  workingDayTHU: true,
  workingDayTUE: true,
  workingDayWED: true,
  workTimePerDay: 0,
};

export const getProjectList = (
  companyId: string,
  pageSize: number,
  pageNum: number,
  filterQuery: ProjectListFilterState = {}
): Promise<PageInfo> => {
  // remove empty values
  const sanitisedFilterQuery = Object.entries(filterQuery).reduce(
    (accumulator, [key, value]) => {
      if (Array.isArray(value) && key === 'statusList') {
        return value.length ? { ...accumulator, [key]: value } : accumulator;
      } else if (key === 'projectCode') {
        // remove projectCode from request parameter. Needed for filter display only
        return accumulator;
      } else if (key === 'projectStartDate') {
        // separate projectStartDate array
        return {
          ...accumulator,
          startDateStartPeriod: formatEmptyDate(value[0]),
          startDateEndPeriod: formatEmptyDate(value[1]),
        };
      } else if (key === 'projectEndDate') {
        // separate projectEndDate array
        return {
          ...accumulator,
          endDateStartPeriod: formatEmptyDate(value[0]),
          endDateEndPeriod: formatEmptyDate(value[1]),
        };
      } else {
        return value ? { ...accumulator, [key]: value } : accumulator;
      }
    },
    {}
  );

  return Api.invoke({
    path: '/psa/project/list',
    param: {
      companyId,
      pageSize,
      pageNum,
      ...sanitisedFilterQuery,
    },
  }).then((response: PageInfo) => response);
};

// CRUD Project API
export const saveProject = (project: Project): Promise<Record<string, any>> => {
  const projectParam = { ...project };

  if (projectParam.deptId === '') {
    projectParam.deptId = null;
  }

  if (projectParam.clientId === '') {
    projectParam.clientId = null;
  }

  return Api.invoke({
    path: '/psa/project/save',
    param: projectParam,
  })
    .then((response: { response: string }) => response)
    .catch((err) => {
      throw err;
    });
};

export const getProject = (projectId: string): Promise<Project> => {
  return Api.invoke({
    path: '/psa/project/get',
    param: {
      projectId,
    },
  }).then((response: ProjectResponse) => {
    const combinedExtendedItemList = [];
    let extendedItemValueId = '';
    const companyId = response.baseInfo.companyId;
    Object.keys(response).forEach((key) => {
      response[key].extendedItems.forEach((eItem) => {
        combinedExtendedItemList.push({
          ...eItem,
          categoryType: eItem.categoryType.value,
        });
      });
      if (response[key].extendedItemValueId && extendedItemValueId === '') {
        extendedItemValueId = response[key].extendedItemValueId;
      }
      delete response[key].companyId;
      delete response[key].extendedItems;
      delete response[key].extendedItemValueId;
    });
    const restructureResponse = {
      ...response.baseInfo,
      ...response.financials,
      ...response.notificationSetting,
      ...response.operation,
      ...response.planningOptions,
      companyId,
      extendedItemValueId,
      extendedItems: combinedExtendedItemList,
    };
    return { project: restructureResponse };
  });
};

export const deleteProject = (projectId: string): Promise<any> => {
  return Api.invoke({
    path: '/psa/project/delete',
    param: {
      id: projectId,
    },
  }).then((response: any) => response);
};

export const searchEmployeeList = (
  companyId: string,
  name: string
): Promise<any> => {
  return Api.invoke({
    path: '/psa/group/list/min',
    param: {
      companyId,
      name,
    },
  }).then((response: any) => response);
};

export const searchClientList = (name: string): Promise<any> => {
  return Api.invoke({
    path: '/account/list/min',
    param: {
      name,
    },
  }).then((response: any) => response);
};
