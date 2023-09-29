import { LeaveRange } from './LeaveRange';
import { LEAVE_TYPE, LeaveType } from './LeaveType';

/**
 * 休暇マスタ
 */
export type AttLeave = {
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
   * 日数管理休暇であるか否かのフラグ
   */
  isDaysLeftManaged: boolean;

  /**
   * 理由を求めるか否か
   */
  requireReason: boolean;
};

/**
 * 日数管理休暇であるかを判別する
 */
export const isDaysLeftManaged = (attLeave: AttLeave): boolean => {
  return attLeave.daysLeft !== null && attLeave.daysLeft !== undefined;
};

export const defaultValue: AttLeave = {
  name: '',
  code: '',
  type: LEAVE_TYPE.Annual,
  ranges: [],
  daysLeft: null,
  hoursLeft: null,
  timeLeaveDaysLeft: null,
  timeLeaveHoursLeft: null,
  isDaysLeftManaged: false,
  requireReason: false,
};

export const create = (param: {
  leaveName: string | null;
  leaveCode: string | null;
  leaveType: LeaveType | null;
  leaveRange: LeaveRange | null;
  requireReason: boolean;
}): AttLeave => ({
  ...defaultValue,
  name: param.leaveName || '',
  code: param.leaveCode || '',
  type: param.leaveType || LEAVE_TYPE.Annual,
  ranges: param.leaveRange ? [param.leaveRange] : [],
  requireReason: param.requireReason,
});

export const createFromParam = (param: AttLeave): AttLeave => ({
  ...defaultValue,
  ...param,
  isDaysLeftManaged: isDaysLeftManaged(param),
});

/**
 * Find AttLeave by LeaveCode or get head from Array.
 *
 * FIXME: This code is needed view files,
 *        not domain,
 *        but we don't have a way to write code for view's common method.
 *
 * @param {*} attLeaveList
 * @param {*} leaveCode
 */
export const getDefaultLeaveCode = (
  attLeaveList: AttLeave[],
  leaveCode: string | null
): AttLeave | null => {
  return (
    attLeaveList.find((leave) => leave.code === leaveCode) ||
    attLeaveList[0] ||
    null
  );
};
