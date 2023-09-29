import * as requestStatus from '../../../../commons/constants/requestStatus';

import userBlankIcon from '../../../../commons/images/photo_Blank.png';

import mockResponseRecords from './att__summary__get--records';
import mockResponseSummaries from './att__summary__get--summaries';

export default {
  result: {
    isSuccess: true,
  },
  id: 'AnonymousMonthlyAttendanceRequest0',
  status: requestStatus.PENDING,
  employeeName: 'テスト 社員',
  employeePhotoUrl: userBlankIcon,
  comment: '月次確定申請のテスト',
  records: mockResponseRecords,
  summaries: mockResponseSummaries,
  historyList: [],
};
