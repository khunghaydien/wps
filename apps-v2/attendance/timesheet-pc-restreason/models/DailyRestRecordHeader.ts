import { EmployeeInfoList } from './EmployeeInfoList';

export type DailyRestRecordHeader = {
  yearMonthly: {
    yearMonthly: string | null | undefined;
    startDate: string | null | undefined;
    endDate: string | null | undefined;
  };
  employee: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
  employeeInfoList: EmployeeInfoList[];
};
