import { compose } from '../../../../commons/utils/FnUtil';

import { CODE } from '../AttDailyRequestType';
import * as Base from './BaseAttDailyRequest';

/**
 * 欠勤申請
 */
export type AbsenceRequest = Base.BaseAttDailyRequest & {
  type: typeof CODE.Absence;

  /**
   * 開始日
   */
  startDate: string;

  /**
   * 終了日
   */
  endDate: string;

  /**
   * 理由
   * (最大: 255文字)
   */
  reason: string;
};

/**
 *  開始日と終了日のデフォルト値の設定します。
 */
const defaultStartDateAndEndDate =
  (targetDate: string | null) => (request: AbsenceRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate, endDate: targetDate };
  };

/**
 * AttDailyRequest から AbcenceRequest を作成します。
 */
const formatAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): AbsenceRequest => ({
  ...request,
  type: CODE.Absence,
});

/**
 * AbsenceRequestを更新します
 */
export const update = (
  request: AbsenceRequest,
  key: string,
  value: AbsenceRequest[keyof AbsenceRequest]
): AbsenceRequest => ({
  ...request,
  [key]: value,
});

/**
 * AttDailyRequestからAbsenceRequestを作成します。
 */
export const create = (
  request: Base.BaseAttDailyRequest,
  targetDate: string | null = null
): AbsenceRequest =>
  compose(
    defaultStartDateAndEndDate(targetDate),
    formatAttDailyRequest
  )(request);
