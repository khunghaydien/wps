import { compose } from '../../../../commons/utils/FnUtil';

import { CODE, CodeMap } from '../AttDailyRequestType';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type OvertimeWorkRequest = BaseAttDailyRequest & {
  type: CodeMap['OvertimeWork'];

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
  (targetDate: string | null) => (request: OvertimeWorkRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * 勤務体系から基本設定を作成します。
 */
const defaultValue =
  (startTime: number | null = null) =>
  (request: OvertimeWorkRequest): OvertimeWorkRequest => {
    if (request.id) {
      return request;
    }
    return {
      ...request,
      startTime,
    };
  };

/**
 * AttDailyRequest から OvertimeWorkRequest を作ります。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): OvertimeWorkRequest => ({
  ...request,
  type: CODE.OvertimeWork,
});

export const update = (
  target: OvertimeWorkRequest,
  key: string,
  value: OvertimeWorkRequest[keyof OvertimeWorkRequest]
): OvertimeWorkRequest => ({
  ...target,
  [key]: value,
});

export const create = (
  request: BaseAttDailyRequest,
  startTime: number | null = null,
  targetDate: string | null = null
): OvertimeWorkRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultValue(startTime),
    formatAttDailyRequest
  )(request);
