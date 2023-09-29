import { Record } from './Record';
import { Status } from './Status';
import { SummaryBlock } from './SummaryBlock';

export type Summary = {
  summaryName: string;
  status: Status;
  hasCalculatedAbsence: boolean;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  records: Record[];
  summaries: SummaryBlock[];
};
