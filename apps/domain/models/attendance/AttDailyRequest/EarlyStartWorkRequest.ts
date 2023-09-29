import { compose } from '../../../../commons/utils/FnUtil';

import { CODE, CodeMap } from '../AttDailyRequestType';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type EarlyStartWorkRequest = BaseAttDailyRequest & {
  type: CodeMap['EarlyStartWork'];

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
};

/**
 *  開始日のデフォルト値の設定します。
 */
const defaultStartDate =
  (targetDate: string | null) => (request: EarlyStartWorkRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * 勤務体系から基本設定を作成します。
 */
const defaultValue =
  (endTime: number | null = null) =>
  (request: EarlyStartWorkRequest): EarlyStartWorkRequest => {
    if (request.id) {
      return request;
    }
    return {
      ...request,
      endTime,
    };
  };

/**
 * AttDailyRequest から EarlyStartWorkRequest を作成します。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): EarlyStartWorkRequest => ({
  ...request,
  type: CODE.EarlyStartWork,
});

export const update = (
  target: EarlyStartWorkRequest,
  key: string,
  value: EarlyStartWorkRequest[keyof EarlyStartWorkRequest]
): EarlyStartWorkRequest => ({
  ...target,
  [key]: value,
});

export const create = (
  request: BaseAttDailyRequest,
  endTime: number | null = null,
  targetDate: string | null = null
): EarlyStartWorkRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultValue(endTime),
    formatAttDailyRequest
  )(request);
