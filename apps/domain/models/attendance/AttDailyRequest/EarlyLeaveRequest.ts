import isNil from 'lodash/isNil';

import { compose } from '../../../../commons/utils/FnUtil';

import { AttDailyRecord } from '../AttDailyRecord';
import { CODE, CodeMap } from '../AttDailyRequestType';
import * as Base from './BaseAttDailyRequest';

/**
 * Early Leave Request
 * 早退申請
 */
export type EarlyLeaveRequest = Base.BaseAttDailyRequest & {
  type: CodeMap['EarlyLeave'];

  /**
   * Target Date
   * 開始日
   */
  startDate: string;

  /**
   * Start Time
   * elapsed minutes of day.
   *
   * 開始時間
   * その日の0:00を0とした分で表す時刻。
   */
  startTime: number | null;

  /**
   * End Time
   * elapsed minutes of day.
   *
   * 終了時間
   * その日の0:00を0とした分で表す時刻。
   */
  endTime: number | null;

  /**
   * Reason (max: 255 characters)
   * 理由 (最大: 255文字)
   */
  reason: string;
};

/**
 * Set default start date
 *  開始日のデフォルト値の設定します。
 */
const defaultStartDate =
  (targetDate: string | null) => (request: EarlyLeaveRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * Create EarlyLeaveRequest from AttDailyRequest.
 * BaseAttDailyRequest から EarlyLeaveRequest を作成します。
 */
const formatAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): EarlyLeaveRequest => ({
  ...request,
  type: CODE.EarlyLeave,
});

/**
 * Set defaultValue By AttDailyRecord
 *  デフォルト値の設定します。
 */
const defaultValue =
  (record: AttDailyRecord | null) => (request: EarlyLeaveRequest) => {
    if (request.id || !record) {
      return request;
    }
    return {
      ...request,
      startTime: record.endTime,
      endTime: record.earlyLeaveEndTime,
    };
  };

/**
 * Update EarlyLeaveRequest.
 * EarlyLeaveRequestを更新します
 */
export const update = (
  request: EarlyLeaveRequest,
  key: string,
  value: EarlyLeaveRequest[keyof EarlyLeaveRequest]
): EarlyLeaveRequest => ({
  ...request,
  [key]: value,
});

/**
 * Update EarlyLeaveRequest by AttDailyRecord
 * EarlyLeaveRequest を AttDailyRecord で更新します。
 */
export const updateByAttDailyRecord = (
  request: EarlyLeaveRequest,
  record: AttDailyRecord | null = null
): EarlyLeaveRequest => {
  if (!record) {
    return request;
  }
  return {
    ...request,
    startTime: isNil(record.endTime) ? request.startTime : record.endTime,
    endTime: isNil(record.earlyLeaveEndTime)
      ? request.endTime
      : record.earlyLeaveEndTime,
  };
};

/**
 * Create EarlyLeaveRequest from AttDailyRequest.
 * AttDailyRequestからEarlyLeaveRequestを作成します。
 */
export const create = (
  request: Base.BaseAttDailyRequest,
  record: AttDailyRecord | null = null,
  targetDate: string | null = null
): EarlyLeaveRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultValue(record),
    formatAttDailyRequest
  )(request);
