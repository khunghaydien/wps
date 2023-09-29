import { State } from '..';
import { EmployeeViewModel } from '@attendance/timesheet-pc-importer/viewModels/EmployeeViewModel';

export default (state: State): EmployeeViewModel => {
  const delegatedEmployee = state.common.proxyEmployeeInfo;
  return {
    delegated: true,
    id: delegatedEmployee?.id,
    name: delegatedEmployee?.employeeName,
    code: delegatedEmployee?.employeeCode,
    department: {
      name: delegatedEmployee?.departmentName,
    },
  };
};
