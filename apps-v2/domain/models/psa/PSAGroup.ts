import Api from '@apps/commons/api';

export type PSAGroup = {
  code: string;
  companyId: string;
  id: string;
  name: string;
  allowSelfReschedule: boolean;
};

export type PSAGroupSearchQuery = {
  companyId: string | null;
  types: Array<string> | null;
};
export const initialPSAGroupList = [];

export type PSAGroupList = Array<PSAGroup>;

export const getPSAGroupList = (companyId: string): Promise<PSAGroup> => {
  return Api.invoke({
    path: '/psa/group/list',
    param: { companyId, types: ['PsaGroup'] },
  }).then((response: PSAGroupList) => response);
};

export const getEmployeeGroupList = (
  companyId: string,
  groupType = '',
  employeeId?: string
): Promise<any> => {
  return Api.invoke({
    path: '/psa/group/list/user',
    param: { companyId, groupType, employeeId },
  }).then((response: any) => response.groups);
};

export const getEmployeeGroupListFromPlanner = (
  companyId: string,
  groupType = '',
  employeeId?: string
): Promise<any> => {
  return Api.invoke({
    path: '/psa/planner/group/list/user',
    param: { companyId, groupType, employeeId },
  }).then((response: any) => response.groups);
};
