/**
 * Leave - 休暇申請
 * HolidayWork - 休日出勤申請
 * OvertimeWork - 残業申請
 * EarlyStartWork - 早朝勤務申請
 * LateArrival - 遅刻申請
 * EarlyLeave - 早退申請
 * Direct - 直行・直帰申請
 * Pattern - 勤務時間変更
 * Absence - 欠勤申請
 */
export type CodeMap = {
  None: 'None';
  Leave: 'Leave';
  HolidayWork: 'HolidayWork';
  OvertimeWork: 'OvertimeWork';
  EarlyStartWork: 'EarlyStartWork';
  LateArrival: 'LateArrival';
  EarlyLeave: 'EarlyLeave';
  Direct: 'Direct';
  Pattern: 'Pattern';
  Absence: 'Absence';
};
export type Code = CodeMap[keyof CodeMap];

export const CODE: CodeMap = {
  None: 'None',
  Leave: 'Leave',
  HolidayWork: 'HolidayWork',
  OvertimeWork: 'OvertimeWork',
  EarlyStartWork: 'EarlyStartWork',
  LateArrival: 'LateArrival',
  EarlyLeave: 'EarlyLeave',
  Direct: 'Direct',
  Pattern: 'Pattern',
  Absence: 'Absence',
};

export type AttDailyRequestType = Readonly<{
  // 申請タイプコード
  code: Code;
  // 申請タイプ名
  name: string;
}>;

export type AttDailyRequestTypeMap = {
  [key in Code]?: AttDailyRequestType;
};

export const DisplayOrder: Code[] = [
  'Leave',
  'HolidayWork',
  'OvertimeWork',
  'EarlyStartWork',
  'LateArrival',
  'EarlyLeave',
  'Direct',
  'Pattern',
  'Absence',
];

export const ReapplyableTypes: Code[] = ['HolidayWork', 'Leave'];
