import { FetchSuccessAction } from '../../index';
import mockResponseRecords from './att__summary__get--records';
import mockResponseSummaries from './att__summary__get--summaries';

export default {
  targetEmployeeId: 'a2a9D000000gZCBQA2',
  name: '2017-09',
  status: 'Approved',
  hasCalculatedAbsence: false,
  ownerInfos: [
    {
      startDate: '2017-09-01',
      endDate: '2017-09-30',
      employee: {
        code: '000001',
        name: '田中 太郎',
      },
      workingType: {
        name: '固定労働制',
      },
      department: {
        name: 'テスト部署',
      },
    },
  ],
  startDate: '2017-09-01',
  endDate: '2017-09-30',
  records: mockResponseRecords,
  summaries: mockResponseSummaries,
  dividedSummaries: [],
} as FetchSuccessAction['payload'];
