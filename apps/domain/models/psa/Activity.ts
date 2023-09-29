import Api from '../../../commons/api';

import { Role } from './Role';

export type ActivityStatus = {
  readonly Cancelled: 'Cancelled';
  readonly Completed: 'Completed';
  readonly InProgress: 'InProgress';
  readonly Planning: 'Planning';
};

export const ActivityStatus = {
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  InProgress: 'InProgress',
  NotStarted: 'NotStarted',
  Planning: 'Planning',
};

export type Activity = {
  activityId?: string;
  closeDate?: string;
  code: string;
  description?: string;
  jobCode: string;
  jobId: string;
  leadBaseId?: string;
  leadName?: string;
  leadPhotoUrl?: string;
  plannedEndDate: string;
  plannedStartDate: string;
  projectEndDate: string;
  projectId: string;
  projectName: string;
  projectStartDate: string;
  projectStatus?: ActivityStatus[keyof ActivityStatus] | string;
  roles?: Array<Role>;
  status?: ActivityStatus[keyof ActivityStatus] | string;
  title: string;
};

export type ActivityListItemRole = {
  assignmentId: string;
  employeeBaseId?: string;
  employeeName: string;
  employeePhotoUrl: string;
  endDate: string;
  isDirectAssign?: boolean;
  requesterName?: string;
  requestNo: string;
  roleId: string;
  roleTitle: string;
  startDate: string;
  status: string;
};

export type ActivityListItem = {
  activityId: string;
  leadBaseId?: string;
  leadName?: string;
  leadPhotoUrl?: string;
  plannedEndDate: string;
  plannedStartDate: string;
  roles?: Array<ActivityListItemRole>;
  status?: ActivityStatus[keyof ActivityStatus] | string;
  title: string;
};

export type ActivityList = Array<ActivityListItem>;

export const ACTIVITY_STATUS = {
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  InProgress: 'InProgress',
  NotStarted: 'NotStarted',
};

export const initialStateActivity = {
  activityId: '',
  closeDate: '',
  code: '',
  description: '',
  jobCode: '',
  jobId: '',
  leadBaseId: '',
  leadName: '',
  leadPhotoUrl: '',
  plannedEndDate: '',
  plannedStartDate: '',
  projectEndDate: '',
  projectId: '',
  projectName: '',
  projectStartDate: '',
  projectStatus: '',
  roles: [],
  status: '',
  title: '',
};

export const getActivityList = (projectId: string): Promise<ActivityList> => {
  return Api.invoke({
    path: '/psa/activity/list',
    param: {
      projectId,
    },
  }).then((response: { activities: ActivityList }) => response.activities);
};

// CRUD Activity API
export const saveActivity = (
  activity: Activity
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/activity/save',
    param: {
      ...activity,
    },
  })
    .then((response: { response: string }) => response)
    .catch((err) => {
      throw err;
    });
};

export const getActivity = (activityId: string): Promise<Activity> => {
  return Api.invoke({
    path: '/psa/activity/get',
    param: {
      activityId,
    },
  }).then((response: Activity) => response);
};

export const deleteActivity = (activityId: string): Promise<any> => {
  return Api.invoke({
    path: '/psa/activity/delete',
    param: {
      id: activityId,
    },
  }).then((response: any) => response);
};
