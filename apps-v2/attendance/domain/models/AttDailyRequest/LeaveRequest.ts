import { compose } from '../../../../commons/utils/FnUtil';

import createMapByCode from '@attendance/libraries/utils/Array/createMapByCode';

import { CODE } from '../AttDailyRequestType';
import * as Leave from '../Leave';
import { LeaveRange } from '../LeaveRange';
import { LEAVE_TYPE } from '../LeaveType';
import * as Base from './BaseAttDailyRequest';

/**
 * 休暇申請
 */
export type LeaveRequest = Base.BaseAttDailyRequest & {
  type: typeof CODE.Leave;

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
   * 休暇範囲
   */
  leaveRange: LeaveRange | null;

  /**
   * 休暇内訳コード
   */
  leaveDetailCode: string | null;

  /**
   * 選択可能な休暇一覧
   */
  leaves: Map<Leave.Leave['code'], Leave.Leave>;
};

export type ILeaveRequestFactory =
  Base.IBaseAttDailyRequestFactory<LeaveRequest>;

/**
 * 選択している Leave を取得する
 */
export const getLeave = (request: LeaveRequest): Leave.Leave =>
  request?.leaves?.get(request.leaveCode);

/**
 * 有効な LeaveRange を取得する
 */
export const getAvailableLeaveRanges = (request: LeaveRequest): LeaveRange[] =>
  Leave.getAvailableLeaveRanges(getLeave(request), request?.leaveDetailCode);

/**
 * AttDailyRequestからLeaveRequestを作る
 */
const fromAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): LeaveRequest => ({
  ...request,
  type: CODE.Leave,
  leaves: null,
});

const setLeaveDetailCode = (request: LeaveRequest) => ({
  ...request,
  leaveDetailCode:
    request.leaveCode && request.leaveDetailCode
      ? request.leaveDetailCode
      : null,
});

const setLeaves = (request: LeaveRequest) => {
  const leaves: Map<Leave.Leave['code'], Leave.Leave> = createMapByCode([
    {
      code: request.leaveCode,
      name: request.leaveName,
      type: request.leaveType || LEAVE_TYPE.Annual,
      ranges: request.leaveRange ? [request.leaveRange] : [],
      details:
        request.leaveCode && request.leaveDetailCode
          ? createMapByCode([
              {
                code: request.leaveDetailCode,
                name: request.leaveDetailName,
                ranges: request.leaveRange ? [request.leaveRange] : [],
              },
            ])
          : new Map(),
      daysLeft: null,
      hoursLeft: null,
      timeLeaveDaysLeft: null,
      timeLeaveHoursLeft: null,
      requireReason: request.requireReason,
    },
  ]);
  return {
    ...request,
    leaves,
  };
};

/**
 * AttDailyRequestからLeaveRequestを作成します。
 * requestがない場合にはLeaveRequestのデフォルト値を返します。
 */
export const convertFromBase = (
  request: Base.BaseAttDailyRequest
): LeaveRequest =>
  compose(setLeaves, setLeaveDetailCode, fromAttDailyRequest)(request);
