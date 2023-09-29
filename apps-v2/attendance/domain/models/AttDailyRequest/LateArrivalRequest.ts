import isNil from 'lodash/isNil';

import { compose } from '../../../../commons/utils/FnUtil';

import { AttDailyRecord } from '../AttDailyRecord';
import { CODE } from '../AttDailyRequestType';
import {
  getDefaultLateArrivalReason,
  LateArrivalReason,
} from '../LateArrivalReason';
import * as Base from './BaseAttDailyRequest';

export const MAX_LENGTH_REASON = 255 as const;

/**
 * Late Arrival Request
 * 遅刻申請
 */
export type LateArrivalRequest = Base.BaseAttDailyRequest & {
  type: typeof CODE.LateArrival;

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

  /**
   * Personal Reason
   * 自己都合
   */
  personalReason: boolean;

  /**
   * 自責管理
   * useLateArrivalReason が true の場合は使用できない。必ず false になる。
   */
  useManagePersonalReason: boolean;

  /**
   * 遅刻理由を管理するか否か
   */
  useLateArrivalReason: boolean;

  /**
   * 遅刻理由ID
   * useLateArrivalReason が false の場合 null である必要がある。空文字（""）はエラーになる。
   */
  reasonId: string;

  /**
   * 備考
   * useLateArrivalReason が true の場合に使用する。
   */
  remarks: string;
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
      useManagePersonalReason: record.useManageLateArrivalPersonalReason,
    };
  };

const defaultLateArrivalReason =
  (
    lateArrivalReasonList: LateArrivalReason[] | null,
    useLateArrivalReason: boolean
  ) =>
  (request: LateArrivalRequest) => {
    if (
      request.id ||
      !lateArrivalReasonList ||
      !useLateArrivalReason ||
      !lateArrivalReasonList?.length
    ) {
      return request;
    }
    if (useLateArrivalReason) {
      const selectedLateArrivalReason = getDefaultLateArrivalReason(
        lateArrivalReasonList,
        request.reasonId
      );
      return {
        ...request,
        reasonId: selectedLateArrivalReason.id,
      };
    }
  };

const defaultUseLateArrivalReason =
  (useLateArrivalReason: boolean | null) => (request: LateArrivalRequest) => {
    const $useLateArrivalReason =
      useLateArrivalReason !== null
        ? useLateArrivalReason
        : !!request?.reasonId;
    return {
      ...request,
      useLateArrivalReason: $useLateArrivalReason,
      reasonId: $useLateArrivalReason ? request?.reasonId : null,
      remarks: $useLateArrivalReason ? request?.remarks : null,
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
  targetDate: string | null = null,
  lateArrivalReasonList: LateArrivalReason[] | null = null,
  useLateArrivalReason: boolean | null = null
): LateArrivalRequest =>
  compose(
    defaultStartDate(targetDate),
    defaultValue(record),
    defaultLateArrivalReason(lateArrivalReasonList, useLateArrivalReason),
    defaultUseLateArrivalReason(useLateArrivalReason),
    formatAttDailyRequest
  )(request);
