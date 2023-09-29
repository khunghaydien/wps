import isNil from 'lodash/isNil';

import { compose } from '../../../../commons/utils/FnUtil';

import { AttDailyRecord } from '../AttDailyRecord';
import { CODE, CodeMap } from '../AttDailyRequestType';
import * as Base from './BaseAttDailyRequest';

/**
 * Late Arrival Request
 * 遅刻申請
 */
export type LateArrivalRequest = Base.BaseAttDailyRequest & {
  type: CodeMap['LateArrival'];

  /**
   * Target Date
   * 開始日
   */
  startDate: string;

  /**
   * Start Time
   * 開始時間
   */
  startTime: number | null;

  /**
   * End Time
   * 終了時間
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
  (targetDate: string | null) => (request: LateArrivalRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate };
  };

/**
 * Create LateArrivalRequest from AttDailyRequest.
 * BaseAttDailyRequest から LateArrivalRequest を作成します。
 */
const formatAttDailyRequest = (
  request: Base.BaseAttDailyRequest
): LateArrivalRequest => ({
  ...request,
  type: CODE.LateArrival,
});

/**
 * Set defaultValue By AttDailyRecord
 *  デフォルト値の設定します。
 */
const defaultValue =
  (record: AttDailyRecord | null) => (request: LateArrivalRequest) => {
    if (request.id || !record) {
      return request;
    }
    return {
      ...request,
      startTime: record.lateArrivalStartTime,
      endTime: record.startTime,
    };
  };

/**
 * Update LateArrivalRequest.
 * LateArrivalRequestを更新します
 */
export const update = (
  request: LateArrivalRequest,
  key: string,
  value: LateArrivalRequest[keyof LateArrivalRequest]
): LateArrivalRequest => ({
  ...request,
  [key]: value,
});

/**
 * Update LateArrivalRequest by AttDailyRecord
 * LateArrivalRequest を AttDailyRecord で更新します。
 */
export const updateByAttDailyRecord = (
  request: LateArrivalRequest,
  record: AttDailyRecord | null = null
): LateArrivalRequest => {
  if (!record) {
    return request;
  }
  return {
    ...request,
    startTime: isNil(record.lateArrivalStartTime)
      ? request.startTime
      : record.lateArrivalStartTime,
    endTime: isNil(record.startTime) ? request.endTime : record.startTime,
  };
};

/**
 * Create LateArrivalRequest from AttDailyRequest.
 * AttDailyRequestからLateArrivalRequestを作成します。
 */
export const create = (
  request: Base.BaseAttDailyRequest,
  record: AttDailyRecord | null = null,
  targetDate: string | null = null
): LateArrivalRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultValue(record),
    formatAttDailyRequest
  )(request);
