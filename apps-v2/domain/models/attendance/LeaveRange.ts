/**
 * 休暇範囲
 * - Day: 全日休
 * - AM: 午前半日休
 * - PM: 午後半日休
 * - Half: 時間指定半日休
 * - Time: 時間単位休
 */
export type LeaveRange = 'Day' | 'AM' | 'PM' | 'Half' | 'Time';

// eslint-disable-next-line import/prefer-default-export
export const LEAVE_RANGE: { [key in LeaveRange]: LeaveRange } = {
  Day: 'Day',
  AM: 'AM',
  PM: 'PM',
  Half: 'Half',
  Time: 'Time',
};

/**
 * 休暇範囲の並び順
 */
export const ORDER_OF_RANGE_TYPES = [
  LEAVE_RANGE.Day,
  LEAVE_RANGE.AM,
  LEAVE_RANGE.PM,
  LEAVE_RANGE.Half,
  LEAVE_RANGE.Time,
];
