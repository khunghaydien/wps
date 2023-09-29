import { compose } from '../../../../commons/utils/FnUtil';

import { CODE } from '../AttDailyRequestType';
import * as RestTime from '../RestTime';
import {
  createDirectApplyRestTimes,
  getDirectApplyTimeRange,
  WorkingType,
} from '../WorkingType';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type DirectRequest = BaseAttDailyRequest & {
  type: typeof CODE.Direct;

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
   * 休憩時間
   */
  directApplyRestTimes: RestTime.RestTimes;
};

/**
 * AttDailyRequest から DirectRequest を作成します。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): DirectRequest => ({
  ...request,
  type: CODE.Direct,
});

/**
 *  開始日と終了日のデフォルト値の設定します。
 */
const defaultStartDateAndEndDate =
  (targetDate: string | null) => (request: DirectRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate, endDate: targetDate };
  };

/**
 * 勤務体系から基本設定を作成します。
 */
const defaultValue =
  (workingType: WorkingType | null = null) =>
  (request: DirectRequest): DirectRequest => {
    if (request.id || !workingType) {
      return request;
    }
    return {
      ...request,
      ...getDirectApplyTimeRange(workingType),
      directApplyRestTimes: createDirectApplyRestTimes(workingType),
    };
  };

export const update = (
  target: DirectRequest,
  key: string,
  value: DirectRequest[keyof DirectRequest]
): DirectRequest => ({
  ...target,
  [key]: value,
});

export const create = (
  request: BaseAttDailyRequest,
  workingType: WorkingType | null = null,
  targetDate: string | null = null
): DirectRequest =>
  compose(
    defaultStartDateAndEndDate(targetDate),
    defaultValue(workingType),
    formatAttDailyRequest
  )(request);
