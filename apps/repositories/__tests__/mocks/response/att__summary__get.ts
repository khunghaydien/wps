import { Summary } from '@apps/timesheet-pc-summary/models/Summary';

import mockResponseRecords from './att__summary__get--records';
import mockResponseSummaries from './att__summary__get--summaries';

export default {
  result: {
    isSuccess: true,
  },
  summaryName: '2017-09',
  status: 'Approved',
  hasCalculatedAbsence: false,
  departmentName: 'テスト部署',
  workingTypeName: '固定労働制',
  employeeCode: '000001',
  employeeName: '田中 太郎',
  startDate: '2017-09-01',
  endDate: '2017-09-30',
  records: mockResponseRecords,
  summaries: mockResponseSummaries,
} as Summary;
