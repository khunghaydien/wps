import Api from '../../../commons/api';

import { ExtendedItem } from '@apps/domain/models/psa/ExtendedItem';

export type strategy = {
  bookedEffort: string;
  scheduledTimePerDay: string;
  schedulingStrategy: string;
};

export type Assignment = {
  activityTitle: string;
  assignBy?: string;
  assignmentId: string;
  bookedTimePerDay: Array<number>;
  employeeId: string;
  employeeName: string;
  employeePhotoUrl: string;
  endDate: string;
  projectTitle: string;
  startDate: string;
  strategy: strategy;
};

export type RoleComment = {
  action: string;
  comments?: string;
  createdDate: string;
  employeeId: string;
  employeeName: string;
  status: string;
};

export type RoleMemo = {
  id: string;
  memoForAll: string;
  memoForManagers: string;
  memoForRM: string;
  visibleForManagers: boolean;
  visibleForRM: boolean;
};

export type RoleCommentHistory = Array<RoleComment>;

export type Role = {
  activityId: string;
  assignment: Assignment;
  assignmentDueDate: string;
  assignments: Array<Assignment>;
  billRate: string;
  clientName: string;
  commentsHistory: RoleCommentHistory;
  companyId?: string;
  confirmBy: string;
  confirmDate: string;
  costRate: string;
  endDate: string;
  extendedItems: Array<ExtendedItem>;
  groupId: string;
  groupName: string;
  isActivityLead: boolean;
  isDirectAssign: boolean;
  jobCode: string;
  jobGrade: any;
  jobGradeId: string;
  jobGrades: Array<any>;
  maxWorkingTime: string;
  memo: RoleMemo;
  projectCode: string;
  projectDept: string;
  projectJobCode: string;
  remarks: string;
  requestBy: string;
  requestByCode: string;
  requestCode: string;
  requestDateTime: string;
  requesterDeptCode: string;
  requesterDeptName: string;
  requiredTime: number;
  requiredTimePercentage: number;
  rmId: string;
  rmName: string;
  roleId: string;
  roleTitle: string;
  saveBy: string;
  skills: Array<any>;
  softBookBy: string;
  softBookDate: string;
  startDate: string;
  status: string;
  useDefaultRate: boolean;
  workingDays: string;
};

const initialStrategy = {
  bookedEffort: '',
  scheduledTimePerDay: '',
  schedulingStrategy: '',
};

const initialAssignment = {
  activityTitle: '',
  assignmentId: '',
  bookedTimePerDay: [],
  employeeId: '',
  employeeName: '',
  employeePhotoUrl: '',
  endDate: '',
  projectTitle: '',
  startDate: '',
  strategy: initialStrategy,
};
export const initialStateRole = {
  activityId: '',
  assignment: initialAssignment,
  assignmentDueDate: '',
  assignments: [],
  billRate: '0',
  clientName: '',
  commentsHistory: [],
  companyId: '',
  confirmBy: '',
  confirmDate: '',
  costRate: '0',
  endDate: '',
  extendedItems: null,
  groupId: '',
  groupName: '',
  isActivityLead: false,
  isDirectAssign: false,
  jobCode: '',
  jobGrade: null,
  jobGradeId: '',
  jobGrades: [],
  maxWorkingTime: '0',
  memo: {
    id: '',
    memoForAll: '',
    memoForManagers: '',
    memoForRM: '',
    visibleForManagers: false,
    visibleForRM: false,
  },
  projectCode: '',
  projectDept: '',
  projectJobCode: '',
  remarks: '',
  requestBy: '',
  requestByCode: '',
  requestCode: '',
  requestDateTime: '',
  requesterDeptCode: '',
  requesterDeptName: '',
  requiredTime: 0,
  requiredTimePercentage: 0,
  rmId: '',
  rmName: '',
  roleId: '',
  roleTitle: '',
  saveBy: '',
  skills: [],
  softBookBy: '',
  softBookDate: '',
  startDate: '',
  status: '',
  useDefaultRate: false,
  workingDays: '0',
};
export const initialScheduleResult = {
  availableTime: [],
  bookedTime: [],
  capacity: [],
  customHours: [],
  endDate: '',
  remainingHours: [],
  startDate: '',
};
export type RoleScheduleParam = {
  companyId: string;
  employeeBaseId: string;
  endDate: string;
  requiredTime: number;
  roleId: string;
  startDate: string;
  strategy: string;
  timePerDay: number;
};

export type ScheduleStrategy = {
  schedulingStrategy: string;
  bookedEffort: number;
  scheduledTimePerDay: number;
};
export type RoleAssignParam = {
  assignBy: string;
  comments?: string;
  employeeBaseId: string;
  endDate: string;
  roleId: string;
  startDate: string;
  strategy: ScheduleStrategy;
  workTimePerDay: Array<number>;
};

export type RoleRescheduleParam = {
  comments?: string;
  endDate: string;
  roleId: string;
  startDate: string;
  workTimePerDay: Array<number>;
};

export type RoleScheduleResult = {
  availableTime: Array<number>;
  bookedTime: Array<number>;
  capacity: Array<number>;
  customHours: Array<number>;
  endDate: string;
  remainingHours: Array<number>;
  startDate: string;
};

export const REJECT_BY = {
  PM: 'PM',
  RM: 'RM',
};

export const ROLE_ACTIONS = {
  // PM
  SUBMIT: 'Submit',
  CONFIRM: 'Confirm',
  REJECT: 'Reject',
  CANCEL: 'Cancel',
  RECALL: 'Recall',
  RESCHEDULE: 'Reschedule',
  NOMINATE: 'Nominate',
  // RM
  NOT_FOUND: 'Notfound',
  SOFTBOOK: 'Softbook',
  HARDBOOK: 'Hardbook',
};

export const MEMO_TYPE = {
  ALL: 'MEMO_FOR_ALL',
  MANAGERS: 'MEMO_FOR_MANAGERS',
  RM: 'MEMO_FOR_RM',
};

export const CONFIRM_BY = {
  PM: 'PM',
  RM: 'RM',
};

export type WorkingDays = {
  workingDays: number;
};

export const getRole = (roleId: string): Promise<Role> => {
  return Api.invoke({
    path: '/psa/role/get',
    param: {
      roleId,
    },
  }).then((response: Role) => response);
};

export const saveRole = (role: Role): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/save',
    param: {
      ...role,
    },
  })
    .then((response: { response: string }) => response)
    .catch((err) => {
      throw err;
    });
};

export const deleteRole = (roleId: string): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/delete',
    param: {
      id: roleId,
    },
  })
    .then((response: { response: Record<string, any> }) => response)
    .catch((err) => {
      throw err;
    });
};

export const cancelRole = (
  roleId: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/cancel',
    param: {
      roleId,
      comments,
    },
  })
    .then((response: { response: Record<string, any> }) => response)
    .catch((err) => {
      throw err;
    });
};

export const recallRole = (
  roleId: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/recall',
    param: {
      roleId,
      comments,
    },
  })
    .then((response: { response: Record<string, any> }) => response)
    .catch((err) => {
      throw err;
    });
};

export const rejectRole = (
  roleId: string,
  rejectBy: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/reject',
    param: {
      roleId,
      rejectBy,
      comments,
    },
  }).then((response: Record<string, any>) => response);
};

export const submitRole = (
  roleId: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/submit',
    param: {
      roleId,
      comments,
    },
  }).then((response: Record<string, any>) => response);
};

export const submitMemo = (
  id: string,
  memo: string,
  memoType: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/memo/save',
    param: {
      id,
      memo,
      memoType,
    },
  }).then((response: Record<string, any>) => response);
};

export const softBookRole = (
  roleId: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/softbook',
    param: {
      roleId,
      comments,
    },
  }).then((response: Record<string, any>) => response);
};

export const releaseResource = (
  assignmentId: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/release',
    param: {
      assignmentId,
    },
  }).then((response: Record<string, any>) => response);
};

export const cloneRole = (
  roleIds: Array<string>,
  targetActivityId: string,
  numberOfClones: number
) => {
  return Api.invoke({
    path: '/psa/role/clone',
    param: {
      targetActivityId,
      roleIds,
      numberOfClones,
    },
  }).then((response: any) => response);
};

export const confirmRole = (
  assignmentId: string,
  comments: string,
  confirmBy: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/confirm',
    param: {
      assignmentId,
      comments,
      confirmBy,
    },
  }).then((response: Record<string, any>) => response);
};

// Mark as completed. Early completion
export const completeRole = (
  roleId: string,
  completionDate: string,
  comments: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/complete',
    param: {
      roleId,
      completionDate,
      comments,
    },
  }).then((response: Record<string, any>) => response);
};

// Reschedule end date
export const rescheduleRoleEndDate = (
  roleId: string,
  endDate: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/reschedule',
    param: {
      roleId,
      endDate,
    },
  }).then((response: Record<string, any>) => response);
};

export const rescheduleRole = (
  roleRescheduleParam: RoleRescheduleParam
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/reschedule',
    param: roleRescheduleParam,
  }).then((response: Record<string, any>) => response);
};

export const getWorkingDays = (
  projectId: string,
  startDate: string,
  endDate: string
): Promise<WorkingDays> => {
  return Api.invoke({
    path: '/psa/working-days/get',
    param: {
      projectId,
      startDate,
      endDate,
    },
  }).then((response: WorkingDays) => response);
};

export const scheduleRole = (
  roleScheduleParam: RoleScheduleParam
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/schedule',
    param: roleScheduleParam,
  }).then((response: RoleScheduleResult) => response);
};

export const assignRole = (
  roleAssignParam: RoleAssignParam
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/assign',
    param: roleAssignParam,
  }).then((response: Record<string, any>) => response);
};

export const scheduleRoleCheck = (
  roleId: string,
  employeeBaseId: string
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/role/schedule/check',
    param: { roleId, employeeBaseId },
  }).then((response: Record<string, any>) => response);
};
