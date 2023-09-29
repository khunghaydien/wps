import { Record } from '@apps/timesheet-pc-summary/models/Record';

import { generateMockRecords } from '../helpers/summary';

const records = generateMockRecords();

// Make mock records including overtime work
records[3] = {
  ...records[3],
  startTime: 8 * 60,
  startStampTime: 8 * 60,
  endTime: 19 * 60,
  endStampTime: 19 * 60,
  realWorkTime: 10 * 60,
  overTime: 2 * 60,
  remarks: '残業申請のテスト',
};

records[4] = {
  ...records[4],
  startTime: 11 * 60,
  startStampTime: 11 * 60,
  endTime: 23 * 60,
  endStampTime: 23 * 60,
  realWorkTime: 11 * 60,
  overTime: 3 * 60,
  nightTime: 60,
  remarks: '深夜残業申請のテスト',
};

// Make mock records including timestamp modifications
records[10] = {
  ...records[10],
  startTime: 9 * 60,
  startStampTime: null,
  remarks: '事後出勤申請のテスト',
};
records[11] = {
  ...records[11],
  endTime: 18 * 60,
  endStampTime: null,
  remarks: '事後退勤申請のテスト',
};
records[17] = {
  ...records[17],
  startTime: 9 * 60,
  startStampTime: 10 * 60,
  remarks: '事後出勤申請 (修正) のテスト',
};
records[18] = {
  ...records[18],
  endTime: 18 * 60,
  endStampTime: 17 * 60,
  remarks: '事後退勤申請 (修正) のテスト',
};
records[19] = {
  ...records[19],
  commuteCountForward: 1,
  commuteCountBackward: 0,
  remarks: '通勤回数管理機能の回数を保存できるか確認するテスト',
};

// Make mock records including special events
records[24] = {
  ...records[24],
  event: 'テストイベント',
  remarks: 'イベントのテスト',
};

export default records as Record[];
