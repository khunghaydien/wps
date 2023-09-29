import { compose } from '../../../../commons/utils/FnUtil';

import { CODE } from '../AttDailyRequestType';
import * as AttPattern from '../AttPattern';
import {
  SUBSTITUTE_LEAVE_TYPE,
  SubstituteLeaveType,
} from '../SubstituteLeaveType';
import {
  BaseAttDailyRequest,
  IBaseAttDailyRequestFactory,
} from './BaseAttDailyRequest';

export const MAX_LENGTH_REMARK = 255 as const;

export type HolidayWorkRequest = BaseAttDailyRequest & {
  type: typeof CODE.HolidayWork;

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
  substituteLeaveType: SubstituteLeaveType;

  /**
   * 選択可能な振替休暇種別一覧
   */
  substituteLeaveTypes: SubstituteLeaveType[];

  /**
   * 振替休暇日
   */
  substituteDate: string | null;

  /**
   * 勤務パターン
   */
  patternCode: string | null;

  /**
   * 選択可能な勤務パターン一覧
   */
  patterns: AttPattern.AttPattern[];

  /**
   * 勤務パターンを使用するか否か
   */
  enabledPatternApply: boolean;
};

export type IHolidayWorkRequestFactory =
  IBaseAttDailyRequestFactory<HolidayWorkRequest>;

/**
 * AttDailyRequest から HolidayWorkRequest を作ります。
 */
const formatAttDailyRequest = (
  request: BaseAttDailyRequest
): HolidayWorkRequest => ({
  substituteLeaveTypes: null,
  patternCode: null,
  patterns: null,
  enabledPatternApply: false,
  ...request,
  type: CODE.HolidayWork,
});

/**
 * デフォルトの substituteLeaveType
 */
export const setSubstituteLeaveType = (target: HolidayWorkRequest) => ({
  ...target,
  substituteLeaveType: target.substituteLeaveType || SUBSTITUTE_LEAVE_TYPE.None,
});

const setSubstituteLeaveTypes = (target: HolidayWorkRequest) => ({
  ...target,
  substituteLeaveTypes: [target.substituteLeaveType],
});

const setEnabledPatternApply =
  (base: BaseAttDailyRequest) => (target: HolidayWorkRequest) => ({
    ...target,
    enabledPatternApply: !!base.patternCode,
  });

const setAttPattern =
  (base: BaseAttDailyRequest) => (target: HolidayWorkRequest) => ({
    ...target,
    attPattern: base.patternCode,
  });

const setPatterns =
  (base: BaseAttDailyRequest) => (target: HolidayWorkRequest) => ({
    ...target,
    patterns: base.patternCode
      ? [
          {
            name: base.patternName,
            code: base.patternCode,
            startTime: base.startTime,
            endTime: base.endTime,
            restTimes: base.patternRestTimes,
            workSystem: base.workSystem,
            flexStartTime: base.flexStartTime,
            flexEndTime: base.flexEndTime,
            withoutCoreTime: base.withoutCoreTime,
          },
        ]
      : null,
  });

export const update = (
  target: HolidayWorkRequest,
  key: string,
  value: HolidayWorkRequest[keyof HolidayWorkRequest]
): HolidayWorkRequest => ({
  ...target,
  [key]: value,
});

export const convertFromBase = (
  request: BaseAttDailyRequest
): HolidayWorkRequest =>
  compose(
    setPatterns(request),
    setAttPattern(request),
    setEnabledPatternApply(request),
    setSubstituteLeaveTypes,
    setSubstituteLeaveType,
    formatAttDailyRequest
  )(request);

/**
 * 選択中の勤務パターンを取得する
 * @param request
 * @returns
 */
export const getSelectedPattern = (
  request: Pick<HolidayWorkRequest, 'patterns' | 'patternCode'>
) => request?.patterns?.find(({ code }) => request.patternCode === code);

/**
 * 勤務パターンが使用できるかどうか
 * @param request
 * @returns
 */
export const isUsePattern = (
  request: Pick<
    HolidayWorkRequest,
    'enabledPatternApply' | 'substituteLeaveType'
  >
): boolean =>
  request?.enabledPatternApply &&
  request?.substituteLeaveType !== SUBSTITUTE_LEAVE_TYPE.Substitute;

/**
 * 開始終了時間を使うかどうか
 * @param request
 * @returns
 */
export const isUseStartTimeAndEndTime = (
  request: Pick<
    HolidayWorkRequest,
    'enabledPatternApply' | 'substituteLeaveType' | 'patternCode' | 'patterns'
  >
): boolean =>
  !isUsePattern(request) ||
  request?.patternCode === null ||
  request?.patternCode === AttPattern.DIRECT_INPUT ||
  AttPattern.isFlexWithoutCoreTime(getSelectedPattern(request));
