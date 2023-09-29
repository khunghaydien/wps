import { State } from '..';
import { EmployeeViewModel } from '@apps/attendance/timesheet-pc-importer/viewModels/EmployeeViewModel';

export default (state: State): EmployeeViewModel => {
  const loginEmployee = state.common.userSetting;
  return {
    delegated: false,
    id: loginEmployee?.employeeId,
    name: loginEmployee?.employeeName,
    code: loginEmployee?.employeeCode,
    department: {
      name: loginEmployee?.departmentName,
    },
  };
};
