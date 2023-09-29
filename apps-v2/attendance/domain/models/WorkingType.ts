import { compose } from '../../../commons/utils/FnUtil';
import { parseIntOrNull } from '../../../commons/utils/NumberUtil';

import {
  LayoutCategory,
  LayoutType,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import * as RestTime from './RestTime';
import { SubstituteLeaveType } from './SubstituteLeaveType';
import * as TimeRange from './TimeRange';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

const createRestTimesFactory = $createRestTimesFactory();

export type WorkSystemTypeMap = Readonly<{
  /* eslint-disable camelcase */
  JP_Discretion: 'JP:Discretion';
  JP_Fix: 'JP:Fix';
  JP_Flex: 'JP:Flex';
  JP_Modified: 'JP:Modified';
  JP_Manager: 'JP:Manager';
  /* eslint-enable camelcase */
}>;

export type WorkSystemType = WorkSystemTypeMap[keyof WorkSystemTypeMap];

export const WORK_SYSTEM_TYPE: WorkSystemTypeMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  JP_Discretion: 'JP:Discretion',
  JP_Fix: 'JP:Fix',
  JP_Flex: 'JP:Flex',
  JP_Modified: 'JP:Modified',
  JP_Manager: 'JP:Manager',
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type WorkingTypeFromRemote = {
  /**
   * 適用開始日
   */
  startDate: string;

  /**
   * 適用終了日
   */
  endDate: string;

  /**
   * 所定始業時刻
   */
  startTime: number;

  /**
   * 所定終業時刻
   */
  endTime: number;

  /**
   * 休日出勤申請の設定
   */
  holidayWorkConfig: {
    substituteLeaveTypeList?: SubstituteLeaveType[];
  };

  /**
   * 労働時間制
   */
  workSystem: WorkSystemType;

  /**
   * フレックス開始時刻
   */
  flexStartTime: number | null | undefined;

  /**
   * フレックス終了時刻
   */
  flexEndTime: number | null | undefined;

  /**
   * 境界時刻（この時刻以降の勤務は申請なしでも認める）
   */
  requireEarlyStartWorkApplyBefore: number | null | undefined;

  /**
   * 境界時刻（この時刻以前の勤務は申請なしでも認める）
   */
  requireOvertimeWorkApplyAfter: number | null | undefined;

  /**
   * 申請者本人による承認者変更を認めるかどうか
   */
  allowToChangeApproverSelf: boolean;

  /**
   * 直行直帰申請のデフォルト出勤時間
   */
  directApplyStartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト退勤時間
   */
  directApplyEndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間1
   */
  directApplyRest1StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間1
   */
  directApplyRest1EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間2
   */
  directApplyRest2StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間2
   */
  directApplyRest2EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間3
   */
  directApplyRest3StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間3
   */
  directApplyRest3EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間4
   */
  directApplyRest4StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間4
   */
  directApplyRest4EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間5
   */
  directApplyRest5StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間5
   */
  directApplyRest5EndTime: number | null | undefined;

  /**
   * 所定休日の労働時間をフレックス対象労働時間に含めるかどうか
   */
  includesHolidayWorkInPlainTime: boolean | null | undefined;

  /**
   *  通勤回数管理を使用するかどうか
   */
  useManageCommuteCount: boolean | null | undefined;

  /**
   *  手当管理を使用するかどうか
   */
  useAllowanceManagement: boolean | null | undefined;

  /**
   *  休憩理由管理を使用するかどうか
   */
  useRestReason: boolean | null | undefined;

  /**
   *  客観ログ乖離理由を勤怠拡張項目の選択リストから設定する
   */
  useExtendedItemAsDeviationReason: boolean | null | undefined;

  /**
   *  客観ログ乖離理由の入力欄を表示する
   */
  useDeviationReasonText: boolean | null | undefined;

  /**
   *  勤務パターンの適用を許可する
   */
  useHolidayWorkPatternApply: boolean | null | undefined;

  /**
   *  客観ログを使用するかどうか
   */
  useObjectivelyEventLog: boolean | null | undefined;

  /**
   * 日次勤務確定申請を使用するかどうか
   */
  useFixDailyRequest: boolean | null | undefined;

  /**
   *  休憩1開始時刻
   */
  rest1StartTime: number | null | undefined;

  /**
   *  休憩1終了時刻
   */
  rest1EndTime: number | null | undefined;

  /**
   *  休憩2開始時刻
   */
  rest2StartTime: number | null | undefined;

  /**
   *  休憩2終了時刻
   */
  rest2EndTime: number | null | undefined;

  /**
   *  休憩3開始時刻
   */
  rest3StartTime: number | null | undefined;

  /**
   *  休憩3終了時刻
   */
  rest3EndTime: number | null | undefined;

  /**
   *  休憩4開始時刻
   */
  rest4StartTime: number | null | undefined;

  /**
   *  休憩4終了時刻
   */
  rest4EndTime: number | null | undefined;

  /**
   *  休憩5開始時刻
   */
  rest5StartTime: number | null | undefined;

  /**
   *  休憩5終了時刻
   */
  rest5EndTime: number | null | undefined;

  /**
   *  コアタイムなし
   */
  withoutCoreTime: boolean | null | undefined;

  /**
   * 36協定延長申請(月度)を使用するか否か
   */
  useLegalAgreementMonthlyRequest: boolean | null | undefined;

  /**
   * 申請理由を必須とする(36協定延長申請(月度)用)
   */
  requireReasonForLegalAgreementMonthly: boolean | null | undefined;

  /**
   * 低減対策を必須とする(36協定延長申請(月度)用)
   */
  requireMeasuresForLegalAgreementMonthly: boolean | null | undefined;

  /**
   * 36協定延長申請(年度)を使用するか否か
   */
  useLegalAgreementYearlyRequest: boolean | null | undefined;

  /**
   * 申請理由を必須とする(36協定延長申請(年度)用)
   */
  requireReasonForLegalAgreementYearly: boolean | null | undefined;

  /**
   * 低減対策を必須とする(36協定延長申請(年度)用)
   */
  requireMeasuresForLegalAgreementYearly: boolean | null | undefined;

  /**
   * 勤怠明細表示項目レイアウト一覧
   */
  attRecordDisplayFieldLayouts:
    | {
        [layoutCategory in LayoutCategory]: Array<{
          code: string;
          type: LayoutType;
        }>;
      }
    | Record<string, never>;

  /**
   * 遅刻理由を管理するか否か
   */
  useLateArrivalReason: boolean | null | undefined;

  /**
   * 早退理由を管理するか否か
   */
  useEarlyLeaveReason: boolean | null | undefined;
};

export type WorkingType = {
  /**
   * 適用開始日
   */
  startDate: string;

  /**
   * 適用終了日
   */
  endDate: string;

  /**
   * 勤務体系name
   */
  name: string;

  /**
   * 勤務体系code
   */
  code: string;

  /**
   * 所定始業時刻
   */
  startTime: number;

  /**
   * 所定終業時刻
   */
  endTime: number;

  /**
   * 休日出勤申請の設定
   */
  holidayWorkConfig: {
    substituteLeaveTypeList?: SubstituteLeaveType[];
  };

  /**
   * 労働時間制
   */
  workSystem: WorkSystemType;

  /**
   * フレックス開始時刻
   */
  flexStartTime: number | null | undefined;

  /**
   * フレックス終了時刻
   */
  flexEndTime: number | null | undefined;

  /**
   * 境界時刻（この時刻以降の勤務は申請なしでも認める）
   */
  requireEarlyStartWorkApplyBefore: number | null | undefined;

  /**
   * 境界時刻（この時刻以前の勤務は申請なしでも認める）
   */
  requireOvertimeWorkApplyAfter: number | null | undefined;

  /**
   * 申請者本人による承認者変更を認めるかどうか
   */
  allowToChangeApproverSelf: boolean;

  /**
   * 直行直帰申請のデフォルト出勤時間
   */
  directApplyStartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト退勤時間
   */
  directApplyEndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間1
   */
  directApplyRest1StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間1
   */
  directApplyRest1EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間2
   */
  directApplyRest2StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間2
   */
  directApplyRest2EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間3
   */
  directApplyRest3StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間3
   */
  directApplyRest3EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間4
   */
  directApplyRest4StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間4
   */
  directApplyRest4EndTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩開始時間5
   */
  directApplyRest5StartTime: number | null | undefined;

  /**
   * 直行直帰申請のデフォルト休憩終了時間5
   */
  directApplyRest5EndTime: number | null | undefined;

  /**
   * 所定休日の労働時間をフレックス対象労働時間に含めるかどうか
   */
  includesHolidayWorkInPlainTime: boolean | null | undefined;

  /**
   *  通勤回数管理を使用するかどうか
   */
  useManageCommuteCount: boolean | null | undefined;

  /**
   *  手当管理を使用するかどうか
   */
  useAllowanceManagement: boolean | null | undefined;

  /**
   *  休憩理由管理を使用するか否か
   */
  useRestReason: boolean | null | undefined;

  /**
   *  客観ログ乖離理由を勤怠拡張項目の選択リストから設定する
   */
  useExtendedItemAsDeviationReason: boolean | null | undefined;

  /**
   *  客観ログ乖離理由の入力欄を表示する
   */
  useDeviationReasonText: boolean | null | undefined;

  /**
   *  勤務パターンの適用を許可する
   */
  useHolidayWorkPatternApply: boolean | null | undefined;

  /**
   *  客観ログを使用するかどうか
   */
  useObjectivelyEventLog: boolean | null | undefined;

  /**
   * 日次勤務確定申請を使用するかどうか
   */
  useFixDailyRequest: boolean | null | undefined;

  /**
   * 休憩時刻アレイ
   */
  restTimes: RestTime.RestTimes;

  /**
   *  コアタイムなし
   */
  withoutCoreTime: boolean | null | undefined;

  /**
   * 36協定延長申請(月度)を使用するか否か
   */
  useLegalAgreementMonthlyRequest: boolean | null | undefined;

  /**
   * 申請理由を必須とする(36協定延長申請(月度)用)
   */
  requireReasonForLegalAgreementMonthly: boolean | null | undefined;

  /**
   * 低減対策を必須とする(36協定延長申請(月度)用)
   */
  requireMeasuresForLegalAgreementMonthly: boolean | null | undefined;

  /**
   * 36協定延長申請(年度)を使用するか否か
   */
  useLegalAgreementYearlyRequest: boolean | null | undefined;

  /**
   * 申請理由を必須とする(36協定延長申請(年度)用)
   */
  requireReasonForLegalAgreementYearly: boolean | null | undefined;

  /**
   * 低減対策を必須とする(36協定延長申請(年度)用)
   */
  requireMeasuresForLegalAgreementYearly: boolean | null | undefined;

  /**
   * 勤怠明細表示項目レイアウト一覧
   */
  attRecordDisplayFieldLayouts:
    | {
        [layoutCategory in LayoutCategory]: Array<{
          code: string;
          type: LayoutType;
        }>;
      }
    | Record<string, never>;

  /**
   * 低遅刻理由を管理するか否か
   */
  useLateArrivalReason: boolean | null | undefined;

  /**
   * 早退理由を管理するか否か
   */
  useEarlyLeaveReason: boolean | null | undefined;
};

export const defaultValue: WorkingType = {
  name: null,
  code: null,
  startDate: null,
  endDate: null,
  startTime: 0,
  endTime: 0,
  holidayWorkConfig: {},
  workSystem: WORK_SYSTEM_TYPE.JP_Fix,
  flexStartTime: null,
  flexEndTime: null,
  requireEarlyStartWorkApplyBefore: null,
  requireOvertimeWorkApplyAfter: null,
  allowToChangeApproverSelf: false,
  directApplyStartTime: null,
  directApplyEndTime: null,
  directApplyRest1StartTime: null,
  directApplyRest1EndTime: null,
  directApplyRest2StartTime: null,
  directApplyRest2EndTime: null,
  directApplyRest3StartTime: null,
  directApplyRest3EndTime: null,
  directApplyRest4StartTime: null,
  directApplyRest4EndTime: null,
  directApplyRest5StartTime: null,
  directApplyRest5EndTime: null,
  includesHolidayWorkInPlainTime: false,
  useManageCommuteCount: false,
  useAllowanceManagement: false,
  useRestReason: false,
  useExtendedItemAsDeviationReason: false,
  useDeviationReasonText: false,
  useHolidayWorkPatternApply: false,
  useObjectivelyEventLog: false,
  useFixDailyRequest: false,
  restTimes: [],
  withoutCoreTime: false,
  useLegalAgreementMonthlyRequest: false,
  requireReasonForLegalAgreementMonthly: false,
  requireMeasuresForLegalAgreementMonthly: false,
  useLegalAgreementYearlyRequest: false,
  requireReasonForLegalAgreementYearly: false,
  requireMeasuresForLegalAgreementYearly: false,
  attRecordDisplayFieldLayouts: {},
  useLateArrivalReason: false,
  useEarlyLeaveReason: false,
};

/**
 * デフォルトの開始終了時刻を返します。
 */
export const getWorkTimeRange = <T extends WorkingType>(
  workingType: T
): TimeRange.TimeRange => ({
  startTime: parseIntOrNull(workingType.startTime),
  endTime: parseIntOrNull(workingType.endTime),
});

export const createFromRemote = (
  fromRemote: WorkingTypeFromRemote
): WorkingType => ({
  name: null,
  code: null,
  startDate: fromRemote.startDate,
  endDate: fromRemote.endDate,
  startTime: fromRemote.startTime,
  endTime: fromRemote.endTime,
  holidayWorkConfig: fromRemote.holidayWorkConfig,
  workSystem: fromRemote.workSystem,
  flexStartTime: fromRemote.flexStartTime,
  flexEndTime: fromRemote.flexEndTime,
  requireEarlyStartWorkApplyBefore: fromRemote.requireEarlyStartWorkApplyBefore,
  requireOvertimeWorkApplyAfter: fromRemote.requireOvertimeWorkApplyAfter,
  allowToChangeApproverSelf: fromRemote.allowToChangeApproverSelf,
  directApplyStartTime: fromRemote.directApplyStartTime,
  directApplyEndTime: fromRemote.directApplyEndTime,
  directApplyRest1StartTime: fromRemote.directApplyRest1StartTime,
  directApplyRest1EndTime: fromRemote.directApplyRest1EndTime,
  directApplyRest2StartTime: fromRemote.directApplyRest2StartTime,
  directApplyRest2EndTime: fromRemote.directApplyRest2EndTime,
  directApplyRest3StartTime: fromRemote.directApplyRest3StartTime,
  directApplyRest3EndTime: fromRemote.directApplyRest3EndTime,
  directApplyRest4StartTime: fromRemote.directApplyRest4StartTime,
  directApplyRest4EndTime: fromRemote.directApplyRest4EndTime,
  directApplyRest5StartTime: fromRemote.directApplyRest5StartTime,
  directApplyRest5EndTime: fromRemote.directApplyRest5EndTime,
  includesHolidayWorkInPlainTime: fromRemote.includesHolidayWorkInPlainTime,
  useManageCommuteCount: fromRemote.useManageCommuteCount,
  useAllowanceManagement: fromRemote.useAllowanceManagement,
  useRestReason: fromRemote.useRestReason,
  useExtendedItemAsDeviationReason: fromRemote.useExtendedItemAsDeviationReason,
  useDeviationReasonText: fromRemote.useDeviationReasonText,
  useHolidayWorkPatternApply: fromRemote.useHolidayWorkPatternApply,
  useObjectivelyEventLog: fromRemote.useObjectivelyEventLog,
  useFixDailyRequest: fromRemote.useFixDailyRequest,
  restTimes: createRestTimesFromRemote(fromRemote),
  withoutCoreTime: fromRemote.withoutCoreTime,
  useLegalAgreementMonthlyRequest: fromRemote.useLegalAgreementMonthlyRequest,
  requireReasonForLegalAgreementMonthly:
    fromRemote.requireReasonForLegalAgreementMonthly,
  requireMeasuresForLegalAgreementMonthly:
    fromRemote.requireMeasuresForLegalAgreementMonthly,
  useLegalAgreementYearlyRequest: fromRemote.useLegalAgreementYearlyRequest,
  requireReasonForLegalAgreementYearly:
    fromRemote.requireReasonForLegalAgreementYearly,
  requireMeasuresForLegalAgreementYearly:
    fromRemote.requireMeasuresForLegalAgreementYearly,
  attRecordDisplayFieldLayouts: fromRemote.attRecordDisplayFieldLayouts,
  useLateArrivalReason: fromRemote.useLateArrivalReason,
  useEarlyLeaveReason: fromRemote.useEarlyLeaveReason,
});

const createRestTimesFromRemote = (
  fromRemote: WorkingTypeFromRemote
): RestTime.RestTimes =>
  compose(RestTime.convertRestTimes, mapRestTime)(fromRemote);

const mapRestTime = (
  fromRemote: WorkingTypeFromRemote
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: fromRemote.rest1StartTime,
    endTime: fromRemote.rest1EndTime,
  },
  {
    startTime: fromRemote.rest2StartTime,
    endTime: fromRemote.rest2EndTime,
  },
  {
    startTime: fromRemote.rest3StartTime,
    endTime: fromRemote.rest3EndTime,
  },
  {
    startTime: fromRemote.rest4StartTime,
    endTime: fromRemote.rest4EndTime,
  },
  {
    startTime: fromRemote.rest5StartTime,
    endTime: fromRemote.rest5EndTime,
  },
];

const mapDirectApplyRestTime = (
  workingType: WorkingType
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: workingType.directApplyRest1StartTime,
    endTime: workingType.directApplyRest1EndTime,
  },
  {
    startTime: workingType.directApplyRest2StartTime,
    endTime: workingType.directApplyRest2EndTime,
  },
  {
    startTime: workingType.directApplyRest3StartTime,
    endTime: workingType.directApplyRest3EndTime,
  },
  {
    startTime: workingType.directApplyRest4StartTime,
    endTime: workingType.directApplyRest4EndTime,
  },
  {
    startTime: workingType.directApplyRest5StartTime,
    endTime: workingType.directApplyRest5EndTime,
  },
];

/**
 * 直行直帰申請のデフォルトの休憩開始終了時間を配列にして返します
 */
export const createDirectApplyRestTimes = (
  workingType: WorkingType
): RestTime.RestTimes => {
  const RestTimesFactory = createRestTimesFactory();
  return compose(
    RestTimesFactory.filter,
    RestTime.convertRestTimes,
    mapDirectApplyRestTime
  )(workingType);
};

/**
 * 直行直帰申請のデフォルトの開始終了時刻を返します。
 */
export const getDirectApplyTimeRange = <T extends WorkingType>(
  workingType: T
): TimeRange.TimeRange => ({
  startTime: parseIntOrNull(workingType.directApplyStartTime),
  endTime: parseIntOrNull(workingType.directApplyEndTime),
});
