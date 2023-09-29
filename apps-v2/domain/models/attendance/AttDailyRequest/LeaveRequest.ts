import { compose } from '../../../../commons/utils/FnUtil';

import { CODE, CodeMap } from '../AttDailyRequestType';
import {
  AttLeave,
  getDefaultLeaveCode as getDefaultAttLeave,
} from '../AttLeave';
import { LEAVE_RANGE, LeaveRange } from '../LeaveRange';
import { LeaveType } from '../LeaveType';
import * as Base from './BaseAttDailyRequest';

/**
 * 休暇申請
 */
export type LeaveRequest = Base.BaseAttDailyRequest & {
  type: CodeMap['Leave'];

  /**
   * 開始日
   */
  startDate: string;

  /**
   * 終了日
   */
  endDate: string;

  /**
   * 開始時間
   */
  startTime: number | null;

  /**
   * 終了時間
   */
  endTime: number | null;

  /**
   * 休暇コード
   */
  leaveCode: string | null;

  /**
   * 休暇名
   */
  leaveName: string | null;

  /**
   * 休暇タイプ
   */
  leaveType: LeaveType | null;

  /**
   * 休暇範囲
   */
  leaveRange: LeaveRange | null;

  /**
   * 理由を求めるか否かのフラグ
   */
  requireReason: boolean;
};

/**
 *  開始日と終了日のデフォルト値の設定します。
 */
const defaultStartDateAndEndDate =
  (targetDate: string | null) => (request: LeaveRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return request.leaveRange === LEAVE_RANGE.Day
      ? { ...request, startDate: targetDate, endDate: targetDate }
      : { ...request, startDate: targetDate };
  };

/**
 * 休暇種類を使用して申請を更新します。
 */
export const updateByAttLeave = (
  request: LeaveRequest,
  attLeave: AttLeave | null = null
): LeaveRequest => {
  if (!attLeave) {
    return request;
  }
  return {
    ...request,
    leaveName: attLeave.name,
    leaveCode: attLeave.code,
    leaveRange:
      (request.leaveCode === attLeave.code &&
        attLeave.ranges.find((range) => range === request.leaveRange)) ||
      attLeave.ranges[0],
    leaveType: attLeave.type,
    requireReason: attLeave.requireReason,
  };
};

/**
 * 休暇種類が未設定の場合のデフォルトの休暇種類の設定
 */
const defaultAttLeave =
  (attLeaveList: AttLeave[] | null = null) =>
  (request: LeaveRequest): LeaveRequest => {
    if (!attLeaveList) {
      return request;
    }

    const selectedAttLeave = getDefaultAttLeave(
      attLeaveList,
      request.leaveCode
    );

    return updateByAttLeave(request, selectedAttLeave);
  };

/**
 * AttDailyRequestからLeaveRequestを作る
 */
const fromAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): LeaveRequest => ({
  ...request,
  type: CODE.Leave,
});

/**
 * LeaveRequestを更新します。
 */
export const update = (
  request: LeaveRequest,
  key: string,
  value: LeaveRequest[keyof LeaveRequest]
): LeaveRequest => ({
  ...request,
  [key]: value,
});

/**
 * AttDailyRequestからLeaveRequestを作成します。
 * requestがない場合にはLeaveRequestのデフォルト値を返します。
 */
export const create = (
  request: Base.BaseAttDailyRequest,
  attLeaveList: AttLeave[] | null = null,
  targetDate: string | null = null
): LeaveRequest => {
  return compose(
    defaultStartDateAndEndDate(targetDate),
    defaultAttLeave(attLeaveList),
    fromAttDailyRequest
  )(request);
};
