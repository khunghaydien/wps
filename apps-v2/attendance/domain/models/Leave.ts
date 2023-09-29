import isNumber from 'lodash/fp/isNumber';

import { LeaveRange } from './LeaveRange';
import { LEAVE_TYPE, LeaveType } from './LeaveType';

export const COMPENSATORY_LEAVE_CODE = 'tex_Compensatory' as const;

/**
 * 休暇マスタ
 */
export type Leave = {
  /**
   * 休暇名
   */
  name: string;

  /**
   * 休暇コード
   */
  code: string;

  /**
   * 休暇タイプ
   */
  type: LeaveType;

  /**
   * 休暇範囲リスト
   */
  ranges: Array<LeaveRange>;

  /**
   * 休暇内訳
   */
  details: Map<Detail['code'], Detail>;

  /**
   * 利用可能日数(残日数)
   */
  daysLeft: number | null;

  /**
   * 利用可能時間(残時間)
   */
  hoursLeft: number | null;

  /**
   * 時間単位休の年間利用可能日数(残日数)
   * ※年次有給休暇のマスタならばnumber、それ以外はnull
   */
  timeLeaveDaysLeft: number | null;

  /**
   * 時間単位休の年間利用可能時間(残時間)
   * ※年次有給休暇のマスタならばnumber、それ以外はnull
   */
  timeLeaveHoursLeft: number | null;

  /**
   * 理由を求めるか否か
   */
  requireReason: boolean;
};

export type Detail = {
  name: string;
  code: string;
  ranges: Array<LeaveRange>;
};

/**
 * 日数管理休暇であるかを判別する
 */
export const isDaysLeftManaged = (attLeave: Pick<Leave, 'daysLeft'>): boolean =>
  isNumber(attLeave?.daysLeft);

/**
 * 年間取得制限があるかを判別する
 */
export const isTimeLeftManaged = (
  attLeave: Pick<Leave, 'timeLeaveDaysLeft' | 'timeLeaveHoursLeft'>
): boolean =>
  isNumber(attLeave?.timeLeaveDaysLeft) &&
  isNumber(attLeave?.timeLeaveHoursLeft);

/**
 * 有効な LeaveRange を取得する
 */
export const getAvailableLeaveRanges = (
  leave: Leave,
  leaveDetailCode?: Detail['code']
): LeaveRange[] => {
  if (!leave) {
    return;
  }
  if (!leaveDetailCode) {
    return leave?.ranges;
  }
  const leaveDetail = leave?.details?.get(leaveDetailCode);
  return leaveDetail?.ranges;
};

export const defaultValue: Leave = {
  name: '',
  code: '',
  type: LEAVE_TYPE.Annual,
  ranges: [],
  details: null,
  daysLeft: null,
  hoursLeft: null,
  timeLeaveDaysLeft: null,
  timeLeaveHoursLeft: null,
  requireReason: false,
};

export type ILeaveRepository = {
  fetchList: (param: {
    targetDate: string;
    employeeId?: string;
    ignoredId?: string;
  }) => Promise<Map<Leave['code'], Leave>>;
};
