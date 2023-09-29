import { compose } from '../../../../commons/utils/FnUtil';

import { CODE, CodeMap } from '../AttDailyRequestType';
import {
  AttPattern,
  getDefaultPatternCode as getDefaultAttPattern,
} from '../AttPattern';
import { RestTimes } from '../RestTime';
import { BaseAttDailyRequest } from './BaseAttDailyRequest';

export type PatternRequest = BaseAttDailyRequest & {
  type: CodeMap['Pattern'];

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
  targetDate: string | null = null
): PatternRequest =>
  compose(
    defaultStartDateAndEndDate(targetDate),
    defaultPatternCode(attPatterns),
    formatAttDailyRequest
  )(request);
