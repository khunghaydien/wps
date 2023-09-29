import { compose } from '../../../../commons/utils/FnUtil';

import { CODE, CodeMap } from '../AttDailyRequestType';
import {
  SUBSTITUTE_LEAVE_TYPE,
  SubstituteLeaveType,
} from '../SubstituteLeaveType';
import { getWorkTimeRange, WorkingType } from '../WorkingType';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type HolidayWorkRequest = BaseAttDailyRequest & {
  type: CodeMap['HolidayWork'];

  /**
   * 開始日
   */
  startDate: string;

  /**
   * 開始時間
   */
  startTime: number | null;

  /**
   * 終了時間
   */
  endTime: number | null;

  /**
   * 振替休暇種別
   */
  substituteLeaveType: SubstituteLeaveType | null;

  /**
   * 振替休暇日
   */
  substituteDate: string | null;
};

/**
 * AttDailyRequest から HolidayWorkRequest を作ります。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): HolidayWorkRequest => ({
  ...request,
  type: CODE.HolidayWork,
});

/**
 *  開始日のデフォルト値の設定します。
 */
const defaultStartDate =
  (targetDate: string | null) => (request: HolidayWorkRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * デフォルトの出勤時間退勤時間
 */
const defaultWorkingTime =
  (workingType: WorkingType | null = null) =>
  (request: HolidayWorkRequest): HolidayWorkRequest => {
    if (request.id || !workingType) {
      return request;
    }
    return {
      ...request,
      ...getWorkTimeRange(workingType),
    };
  };

/**
 * デフォルトの substituteLeaveType
 */
export const substituteLeaveType = (target: HolidayWorkRequest) => ({
  ...target,
  substituteLeaveType: target.substituteLeaveType || SUBSTITUTE_LEAVE_TYPE.None,
});

export const update = (
  target: HolidayWorkRequest,
  key: string,
  value: HolidayWorkRequest[keyof HolidayWorkRequest]
): HolidayWorkRequest => ({
  ...target,
  [key]: value,
});

export const create = (
  request: BaseAttDailyRequest,
  workingType: WorkingType | null = null,
  targetDate: string | null = null
): HolidayWorkRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultWorkingTime(workingType),
    substituteLeaveType,
    formatAttDailyRequest
  )(request);
