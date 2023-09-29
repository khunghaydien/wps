import Api from '../../../commons/api';

import { Employee } from '../organization/Employee';
import { MasterEmployeeHistory } from '../organization/MasterEmployeeHistory';

export type EmployeeList = Array<Employee>;
const enum DetailSelector {}
type DetailSelectorList = DetailSelector[];

export const getEmployeeList = (
  companyId?: string,
  targetDate?: string,
  limitNumber?: number,
  name?: string,
  detailSelectorList?: DetailSelectorList,
  primary?: boolean,
  idList?: string[]
): Promise<EmployeeList> => {
  return Api.invoke({
    path: '/employee/search',
    param: {
      companyId,
      targetDate,
      limitNumber,
      name,
      detailSelectorList,
      primary,
      idList,
    },
  }).then((result: { records: EmployeeList }) => {
    return result.records;
  });
};

export type EmployeeHistoryList = Array<MasterEmployeeHistory>;
export type EmpHistory = {
  empGroupId: string;
  validFrom: string;
  validTo: string;
  companyId?: string;
  subRoleKey?: string;
  id?: string;
};
export type EmpHistoryList = Array<EmpHistory>;

export const getEmployeeHistoryList = (
  empId: string
): Promise<EmployeeHistoryList> => {
  return Api.invoke({
    path: '/employee/history/search',
    param: {
      baseId: empId,
    },
  }).then((result: { records: EmployeeHistoryList }) => {
    return result.records;
  });
};
