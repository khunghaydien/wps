import Api from '../../../commons/api';

import { Department } from '../organization/Department';

export type Manager = {
  name: string;
};

export type Parent = {
  name: string;
};

export type DepartmentList = Array<Department>;

export const DEPARTMENT_LIST = 'departmentList';

// eslint-disable-next-line import/prefer-default-export
export const getDepartmentList = (
  companyId?: string,
  targetDate?: string,
  limitNumber?: number,
  detailSelector?: string[],
  name?: string,
  idList?: string[]
): Promise<DepartmentList> => {
  return Api.invoke({
    path: '/department/search',
    param: {
      companyId,
      targetDate,
      limitNumber,
      detailSelector,
      name,
      idList,
    },
  }).then((result: { records: DepartmentList }) => {
    return result.records;
  });
};
