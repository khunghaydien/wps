import Api from '../../../commons/api';

export type Assignment = {
  activityId: string;
  assigneeBaseId: string;
  assigneeName: string;
  assigneePhotoUrl: string;
  assignmentId: string;
  description: string;
  endDate: string;
  eventId: string;
  numOfWorkDays: string;
  projectId: string;
  role: string;
  startDate: string;
  totalWorkHours: string;
  workTimePerDay: string;
};

export const initialStateAssignment = {
  activityId: '',
  assigneeBaseId: '',
  assigneeName: '',
  assigneePhotoUrl: '',
  assignmentId: '',
  description: '',
  endDate: '',
  eventId: '',
  numOfWorkDays: '0',
  projectId: '',
  role: '',
  startDate: '',
  totalWorkHours: '0',
  workTimePerDay: '0',
};

export const getAssignment = (assignmentId: string): Promise<Assignment> => {
  return Api.invoke({
    path: '/psa/activity-assignment/get',
    param: {
      assignmentId,
    },
  }).then((response: Assignment) => response);
};

export const saveAssignment = (
  assignment: Assignment
): Promise<Record<string, any>> => {
  return Api.invoke({
    path: '/psa/activity-assignment/save',
    param: {
      ...assignment,
    },
  })
    .then((response: { response: string }) => response)
    .catch((err) => {
      throw err;
    });
};
