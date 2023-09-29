import Api from '../../../commons/api';

export type Group = {
  id: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  code: string;
  companyId: string;
  // eslint-disable-next-line camelcase
  description_L0: string;
  // eslint-disable-next-line camelcase
  description_L1: string;
  // eslint-disable-next-line camelcase
  description_L2: string;
  reportTypeIdList: string[];
  active: boolean;
};

export type GroupList = Array<Group>;

export const createEmployeeGroup = (group: Group): Promise<void> => {
  return Api.invoke({
    path: '/exp/expense-employee-group/create',
    param: group,
  })
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

export const getEmployeeGroup = (
  id: string | null | undefined,
  includeReportType: boolean
): Promise<void> => {
  return Api.invoke({
    path: '/exp/expense-employee-group/search',
    param: {
      id,
      includeReportType,
    },
  })
    .then((res: GroupList) => res)
    .catch((err) => {
      throw err;
    });
};

export const updateEmployeeGroup = (group: Group): Promise<void> => {
  return Api.invoke({
    path: '/exp/expense-employee-group/update',
    param: group,
  })
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

export const deleteEmployeeGroup = (id: string): Promise<void> => {
  return Api.invoke({
    path: '/exp/expense-employee-group/delete',
    param: { id },
  }).then((response: any) => response);
};
