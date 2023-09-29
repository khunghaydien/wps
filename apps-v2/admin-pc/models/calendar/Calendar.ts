export const TYPE = {
  Attendance: 'Attendance',
  Expense: 'Expense',
};

type Type = keyof typeof TYPE;

export type Calendar = {
  id: string;
  code: string;
  name: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  companyId: string;
  type: Type;
  isDefault: boolean;
  remarks: string;
};

export const createDefaultAttendanceCalendar = (
  companyId: string
): Calendar => ({
  id: '',
  code: '',
  name: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L0: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L1: '',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name_L2: '',
  companyId,
  type: 'Attendance',
  isDefault: false, // 全社カレンダーはシステムから１件のみ作成される仕様
  remarks: '',
});

export const isCompanyCalendar = (cal: Calendar) =>
  cal.isDefault && cal.type === TYPE.Attendance;

/**
 * 勤怠カレンダー
 *
 * @example
 *
 * const calendarList: Calendar[] = ...
 * const attendanceCalendar: Calendar[] = calendarList.filter(isAttendanceCalendar);
 */
export const isAttendanceCalendar = (cal: Calendar) =>
  cal.type === TYPE.Attendance;

/**
 * 表示順
 *
 * @example
 *
 * const calendarList: Calendar[] = ...
 * const orderedCalendarList: Calendar[] = calendarList.sort(byDisplayOrder);
 */
export const byDisplayOrder = (a: Calendar, b: Calendar): number => {
  const defaultOrder = (_) => 0;

  const orderByIsDefault = (next: () => number) => (): number => {
    if (a.isDefault && !b.isDefault) {
      return -1;
    } else if (!a.isDefault && b.isDefault) {
      return 1;
    } else {
      return next();
    }
  };

  const orderByCode = (next: () => number) => (): number => {
    if (a.code < b.code) {
      return -1;
    } else if (a.code > b.code) {
      return 1;
    } else {
      return next();
    }
  };

  // @ts-ignore
  const orderBy = orderByIsDefault(orderByCode(defaultOrder));
  return orderBy();
};

/**
 * 社員に設定することが出来る勤怠カレンダーを表示順で返します。
 * @param calendars 勤怠カレンダー
 * @return 社員に設定することが出来る勤怠カレンダー
 */
export const filterBySelectable = (calendars: Calendar[]): Calendar[] => {
  return calendars
    .filter((cal) => isAttendanceCalendar(cal))
    .sort(byDisplayOrder);
};
