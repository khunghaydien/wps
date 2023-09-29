import moment from 'moment';

import Api from '../../../commons/api';

import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

export type RequestListItem = {
  assignmentDueDate?: string;
  clientName?: string;
  endDate?: string;
  isDirectAssign?: boolean;
  projectCode: string;
  projectJobCode?: string;
  projectManager?: string;
  projectTitle: string;
  receivedDate: string;
  requestCode: string;
  resourceGroup?: string;
  resourceManager?: string;
  roleId: string;
  roleTitle: string;
  startDate?: string;
  status: string;
};

export type PageData = Array<RequestListItem>;

export type RequestList = {
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  pageNum: number;
  pageData: PageData;
};

export type RequestListFilterState = {
  projectTitle: string;
  roleTitle: string;
  projectManager: string;
  statusList: Array<string>;
  jobGradeIds: Array<string>;
  assignmentDueDate: [string, string];
  receivedDate: [string, string];
  roleStartDate: [string, string];
};

export type RoleRequestListFilterState = {
  assignmentDueDate: [string, string];
  clientName: string;
  deptId: string;
  jobGradeIds: any;
  pmCode: string;
  pmName: string;
  projectCode: string;
  projectJobId: string;
  projectTitle: string;
  receivedDate: [string, string];
  requestCode: string;
  requesterCode: string;
  requesterName: string;
  resourceGroup: string;
  rmName: string;
  roleStartDate: [string, string];
  roleTitle: string;
  statusList: Array<string>;
};

export type ResourceSelectionFilterState = {
  name: string;
  code?: string;
  position: string;
  departmentName: string;
  skills: any;
  jobGradeIds: any;
  requiredTime: number | string;
  resourceGroups: any;
  resourceManager: any;
  rmId: string;
  startDate?: string;
  endDate?: string;
  isDateFilterNotApplied?: boolean;
};

export type ResourceSelectionFilterParam = {
  companyId: string;
  name?: string;
  position?: string;
  departmentName?: string;
  targetDate?: string;
  skills?: Array<string>;
  jobGradeIds?: Array<string>;
  requiredTime?: number;
  startDate: string;
  endDate: string;
  rmId?: string;
  groupIds?: Array<string>;
  excludeEmployeeIds?: Array<string>;
  callBy: string;
  capacityStartDate?: string;
  capacityEndDate?: string;
};

export const initialRequestList = {
  totalRecords: 0,
  totalPages: 0,
  pageSize: 0,
  pageNum: 0,
  pageData: [],
};

export const initialStateRequest = {
  assignmentDueDate: '',
  clientName: '',
  endDate: '',
  firstName: '',
  lastName: '',
  projectCode: '',
  projectJobCode: '',
  projectTitle: '',
  receivedDate: '',
  requestCode: '',
  roleId: '',
  roleTitle: '',
  startDate: '',
  status: '',
};

export const initialResourceSelectionFilterState: ResourceSelectionFilterState =
  {
    startDate: moment().format('YYYY-MM-01'),
    endDate: moment().add(12, 'months').endOf('month').format('YYYY-MM-DD'),
    code: '',
    departmentName: '',
    isDateFilterNotApplied: true,
    jobGradeIds: null,
    name: '',
    position: '',
    requiredTime: 0,
    resourceGroups: null,
    resourceManager: null,
    rmId: '',
    skills: [],
  };

export const makeInitialRequestListFilterState = (
  rmName: string
): RoleRequestListFilterState => ({
  assignmentDueDate: ['', ''],
  clientName: '',
  deptId: '',
  jobGradeIds: [],
  pmName: '',
  pmCode: '',
  projectCode: '',
  projectJobId: '',
  projectTitle: '',
  receivedDate: ['', ''],
  requesterName: '',
  requestCode: '',
  requesterCode: '',
  resourceGroup: '',
  rmName,
  roleStartDate: ['', ''],
  roleTitle: '',
  statusList: [RoleStatus.Requested, RoleStatus.Scheduling],
});

export const initialRequestListFilterState: RoleRequestListFilterState = {
  assignmentDueDate: ['', ''],
  clientName: '',
  deptId: '',
  jobGradeIds: [],
  pmName: '',
  pmCode: '',
  projectCode: '',
  projectJobId: '',
  projectTitle: '',
  receivedDate: ['', ''],
  requestCode: '',
  requesterName: '',
  requesterCode: '',
  resourceGroup: '',
  rmName: '',
  roleStartDate: ['', ''],
  roleTitle: '',
  statusList: [RoleStatus.Requested, RoleStatus.Scheduling],
};

export const getRequestList = (
  companyId: string,
  pageSize: number,
  pageNum: number,
  filterQuery: RoleRequestListFilterState | Record<string, any> = {}
): Promise<RequestList> => {
  // remove empty values
  const sanitisedFilterQuery = Object.entries(filterQuery).reduce(
    (accumulator, [key, value]) => {
      if (Array.isArray(value)) {
        return value.length ? { ...accumulator, [key]: value } : accumulator;
      } else if (key === 'projectCode') {
        // remove projectCode from request parameter. Needed for filter display only
        return accumulator;
      } else if (key === 'requestCode' && value) {
        // if requestCode is lesser than 10 digits, add zeroes to the front of it until it reaches 10 digits.
        return { ...accumulator, [key]: String(value).padStart(10, '0') };
      } else {
        return value ? { ...accumulator, [key]: value } : accumulator;
      }
    },
    {}
  );

  return Api.invoke({
    path: '/psa/role/list',
    param: {
      companyId,
      pageSize,
      pageNum,
      ...sanitisedFilterQuery,
    },
  }).then((response: { roles: RequestList }) => response);
};
