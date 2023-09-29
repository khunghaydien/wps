import { compose } from '../../../../commons/utils/FnUtil';

import { CODE } from '../AttDailyRequestType';
import {
  AttPattern,
  getDefaultPatternCode as getDefaultAttPattern,
} from '../AttPattern';
import { RestTimes } from '../RestTime';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type PatternRequest = BaseAttDailyRequest & {
  type: typeof CODE.Pattern;

  /**
   * 開始日
   */
  startDate: string;

  /**
   * 終了日
   */
  endDate: string;

  /**
   * 勤務パターン名
   */
  patternName: string | null;

  /**
   * 勤務パターンコード
   */
  patternCode: string | null;

  /**
   * 勤務パターンの出勤時間（読込専用）
   */
  startTime: number | null;

  /**
   * 勤務パターンの退勤時間（読込専用）
   */
  endTime: number | null;

  /**
   * 勤務パターンの休暇時間
   */
  patternRestTimes: RestTimes;

  /**
   * 労働時間制
   */
  workSystem: string;

  /**
   * フレックス開始時刻
   */
  flexStartTime: number | null;

  /**
   * フレックス終了時刻
   */
  flexEndTime: number | null;

  /**
   * コアタイムなし
   */
  withoutCoreTime: boolean;

  /**
   * 勤務変更の日タイプ
   */
  requestDayType: string | null;

  /**
   * 申請可能な勤務変更の日タイプ
   */
  requestableDayType: string | null;

  /**
   * 申請可能な直接入力
   */
  canDirectInputTimeRequest: boolean;
};

/**
 * AttDailyRequest から PatternRequest を作成します。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): PatternRequest => ({
  ...request,
  type: CODE.Pattern,
});

/**
 *  開始日と終了日のデフォルト値の設定します。
 */
const defaultStartDateAndEndDate =
  (targetDate: string | null) => (request: PatternRequest) => {
    if (!targetDate || request.startDate) {
      return request;
    }
    return { ...request, startDate: targetDate, endDate: targetDate };
  };

/**
 *  申請可能な勤務変更の日タイプ値の設定します。
 */
const defaultRequestableDayType =
  (requestableDayType: string | null) => (request: PatternRequest) => {
    return {
      ...request,
      requestableDayType: requestableDayType,
    };
  };

/**
 *  申請可能な直接入力値の設定します。
 */
const defaultCanDirectInputTimeRequest =
  (canDirectInputTimeRequest: boolean | null) => (request: PatternRequest) => {
    return {
      ...request,
      canDirectInputTimeRequest: canDirectInputTimeRequest,
    };
  };

/**
 * 勤務パターンを使用して申請を更新します。
 */
export const updateByAttPattern = (
  request: PatternRequest,
  attPattern: AttPattern | null
): PatternRequest => {
  if (!attPattern) {
    return request;
  }

  return {
    ...request,
    patternCode: attPattern.code,
    patternName: attPattern.name,
    startTime: attPattern.startTime,
    endTime: attPattern.endTime,
    patternRestTimes: attPattern.restTimes,
    workSystem: attPattern.workSystem,
    flexStartTime: attPattern.flexStartTime,
    flexEndTime: attPattern.flexEndTime,
    withoutCoreTime: attPattern.withoutCoreTime,
  };
};

/**
 * デフォルトの勤務パターンコードを設定します。
 */
const defaultPatternCode =
  (attPatterns: AttPattern[] | null) =>
  (request: PatternRequest): PatternRequest => {
    if (!attPatterns) {
      return request;
    }

    const selectedPattern = getDefaultAttPattern(
      attPatterns,
      request.patternCode
    );

    return updateByAttPattern(request, selectedPattern);
  };

/**
 * PatternRequestを更新します。
 */
export const update = (
  request: PatternRequest,
  key: string,
  value: PatternRequest[keyof PatternRequest]
): PatternRequest => ({
  ...request,
  [key]: value,
});

export const create = (
  request: BaseAttDailyRequest,
  attPatterns: AttPattern[] | null = null,
  targetDate: string | null = null,
  requestableDayType: string | null = null,
  canDirectInputTimeRequest: boolean | null = null
): PatternRequest =>
  compose(
    defaultStartDateAndEndDate(targetDate),
    defaultPatternCode(attPatterns),
    defaultRequestableDayType(requestableDayType),
    defaultCanDirectInputTimeRequest(canDirectInputTimeRequest),
    formatAttDailyRequest
  )(request);
