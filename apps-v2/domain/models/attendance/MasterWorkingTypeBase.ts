import { WorkSystemType } from './WorkingType';

export type MasterWorkingHoursTypeBase = {
  code: string;
  companyId: string;
  payrollPeriod: 'Month';
  startMonthOfYear: number;
  startDayOfMonth: number;
  startDayOfWeek: number;
  yearMark: string;
  monthMark: string;
  workSystem: WorkSystemType;
  withoutCoreTime: boolean;
};
