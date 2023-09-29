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
export const CODE = {
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
} as const;

export type Code = Value<typeof CODE>;

export const NAME_CODE = {
  ...CODE,
  EarlyLeaveMinWorkHours: 'EarlyLeaveMinWorkHours',
} as const;

export type NameCode = Value<typeof NAME_CODE>;

export type DailyRequestName = Readonly<{
  // 申請タイプコード
  code: NameCode;
  // 申請タイプ名
  name: string;
}>;

export type DailyRequestNameMap = {
  [key in NameCode]?: DailyRequestName;
};

export const DisplayOrder: Code[] = [
  CODE.Leave,
  CODE.HolidayWork,
  CODE.OvertimeWork,
  CODE.EarlyStartWork,
  CODE.LateArrival,
  CODE.EarlyLeave,
  CODE.Direct,
  CODE.Pattern,
  CODE.Absence,
];

export const ReapplyableTypes: Code[] = [CODE.HolidayWork, CODE.Leave];
