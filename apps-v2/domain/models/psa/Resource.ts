import Api from '../../../commons/api';

import { ResourceSelectionFilterParam } from './Request';

export type Resource = {
  availableTime: string;
  bookedTime: string;
  departmentName: string;
  name: string;
  position: string;
  totalCapacity: string;
};

export type ResourceListItem = {
  availability?: any;
  availableTime: string;
  bookedTime: string;
  capacity?: any;
  code: string;
  departmentCode: string;
  departmentName: string;
  hasAssignment: boolean;
  historyId: string;
  id: string;
  jobGradeCode: string;
  jobGradeName: string;
  name: string;
  photoUrl: string;
  position: string;
  totalCapacity: string;
};

export type ViewAllResourceListItem = {
  availability: Array<number>;
  capacity: Array<number>;
  departmentName: string;
  historyId: string;
  id: string;
  name: string;
  photoUrl: string;
  position: string;
};

export type AssignmentDetail = {
  activityTitle: string;
  bookedTimePerDay: Array<number>;
  clientName?: string;
  endDate: string;
  offset: number;
  projectCode: string;
  projectJobCode: string;
  projectTitle: string;
  roleId: string;
  roleTitle: string;
  startDate: string;
  status: string;
};

export type NonProjectDetail = {
  bookedTimePerDay: Array<number>;
};

export type AssignmentDetailListResponse = {
  assignments: Array<AssignmentDetail>;
  nonProject: NonProjectDetail;
};

export type AssignmentDetailList = {
  assignments: Array<AssignmentDetail>;
  employeeBaseId: string;
};

export type PageData = Array<ViewAllResourceListItem>;

export type ViewAllResourceList = {
  pageData: PageData;
  pageNum: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};
export const initialViewAllResourceList = {
  pageData: [],
  pageNum: 0,
  pageSize: 0,
  totalPages: 0,
  totalRecords: 0,
};
export const initialAssignmentDetailList = {
  assignments: [],
  employeeBaseId: '',
};
export const ViewTypes = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
};

export const initResourceAvailability = {
  availableHours: [],
  endDate: '',
  limit: 12,
  page: 0,
  startDate: '',
  viewType: ViewTypes.DAY,
};

export const initialStateResource = {
  availableTime: '',
  bookedTime: '',
  departmentName: '',
  name: '',
  position: '',
  totalCapacity: '',
};

export type ResourceList = Array<ResourceListItem>;

export const CALL_BY = {
  PM: 'PM',
  RM: 'RM',
};

export type ResourceSearchQuery = {
  callBy: string;
  companyId: string;
  departmentName?: string;
  empBaseId?: string;
  endDate: string;
  groupIds?: Array<string>;
  name?: string;
  position?: string;
  rmId: string;
  startDate: string;
  targetDate?: string;
  capacityStartDate?: string;
  capacityEndDate?: string;
};

export type ResourceIdListSearchQuery = {
  callBy: string;
  companyId: string;
  departmentName?: string;
  groupIds?: any;
  jobGradeIds?: any;
  name?: string;
  position?: string;
  rmId?: string;
  skills?: any;
};

export type ResourceListSearchQuery = {
  ids: Array<string>;
  startDate: string;
  endDate: string;
};

export type AssignmentDetailSearchQuery = {
  id: string;
  startDate: string;
  endDate: string;
};

export const initAssignmentDetail = {
  bookedTimePerDay: [],
};

export type ResourceIdList = {
  totalRecords: number;
  ids: Array<string>;
};
export const initialResourceIdList = {
  totalRecords: 0,
  ids: [],
};
export const getResourceList = (
  searchQuery: ResourceSearchQuery | ResourceSelectionFilterParam
): Promise<ResourceList> => {
  return Api.invoke({
    path: '/psa/resource/search',
    param: searchQuery,
  }).then((response: { resources: ResourceList }) => response.resources);
};

export const getResourceIdList = (
  searchQuery: ResourceIdListSearchQuery
): Promise<ResourceIdList> => {
  return Api.invoke({
    path: '/psa/resource/id-list',
    param: searchQuery,
  }).then((response: ResourceIdList) => response);
};

export const getResourceListByIds = (
  searchQuery: ResourceListSearchQuery
): Promise<ViewAllResourceList> => {
  return Api.invoke({
    path: '/psa/resource/list',
    param: searchQuery,
  }).then((response: ViewAllResourceList) => response);
};

export const getAssignmentDetailList = (
  searchQuery: AssignmentDetailSearchQuery
): Promise<AssignmentDetailListResponse> => {
  return Api.invoke({
    path: '/psa/resource/list-detail',
    param: searchQuery,
  }).then((response: AssignmentDetailList) => ({
    ...response,
    employeeBaseId: searchQuery.id,
  }));
};
