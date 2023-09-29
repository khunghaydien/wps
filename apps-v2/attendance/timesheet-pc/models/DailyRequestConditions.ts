// FIXME: 本来ならばドメインの型を使用するべきだが古い実装のために仕方なく使用している
import {
  isPermissionSatisfied,
  Permission,
} from '../../../domain/models/access-control/Permission';
import { DayType } from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest,
  getEffectualLeaveRequests,
  STATUS,
  Status,
} from '@attendance/domain/models/AttDailyRequest';
import {
  CODE as REQUEST_TYPE_CODE,
  Code as AttRequestTypeCode,
  DailyRequestNameMap,
} from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import { LeaveType } from '@attendance/domain/models/LeaveType';

import isRequiredInputDaily from '@attendance/domain/services/DailyRecordService/isRequiredInput';
import { getRequestTypeName } from '@attendance/domain/services/DailyRequestService';

/**
 * 日次の勤怠申請の情報と、そこから導出される各種の状態を表現する
 */
export type DailyRequestConditionsType = {
  /**
   * 日付(YYYY-MM-DD形式の文字列)
   */
  recordDate: string;

  /**
   * 申請可能な勤怠申請種別の一覧
   */
  availableRequestTypes: DailyRequestNameMap;

  /**
   * 新規のみの勤怠申請の一覧
   */
  latestRequests: Array<AttDailyRequest>;

  /**
   * 申請の件数
   */
  availableRequestCount: number;

  /**
   * 注目（＝勤務表に掲出）すべき申請のステータス
   */
  remarkableRequestStatus: Status | null | undefined;

  /**
   * 有効な休暇申請
   */
  effectualLeaveRequests: Array<any> | null | undefined;

  /**
   * 全日の休暇の種別（有給 or 無給）
   */
  effectualAllDayLeaveType: LeaveType | null;

  /**
   * 承認済みの欠勤かどうか
   */
  isApprovedAbsence: boolean;

  /**
   * 勤務時間の操作が可能であるか否かのフラグ
   */
  isAvailableToOperateAttTime: boolean;

  /**
   * 新規申請が可能であるか否かのフラグ
   */
  isAvailableToEntryNewRequest: boolean;

  /**
   * 申請済みの申請を修正可能であるか否かのフラグ
   */
  isAvailableToModifySubmittedRequest: boolean;

  /**
   * 休職休業中の就業を可能であるか否かのフラグ
   */
  isAllowWorkDuringLeaveOfAbsence: boolean;

  /**
   * 勤務表がロックされているか否かのフラグ
   */
  isLocked: boolean;
};

type ExcerptOfAttRecordForCreate = {
  recordDate: string;
  dayType: DayType;
  hasActualWorkingTimes: boolean;
  requestIds: Array<string>;
  requestTypeCodes: AttRequestTypeCode[];
  isLeaveOfAbsence: boolean;
  isLocked: boolean;
  isFlexWithoutCore: boolean;
};

type OtherConditionsForCreate = {
  isSummaryLocked: boolean;
  isByDelegate: boolean;
  userPermission: Permission;
};

/**
 * 注目すべき申請（＝勤務表に掲出）のステータスを一点に決定して返却する
 * - NOTE:破壊的な変更であるため、コンストラクタ以外での呼び出しを禁止する
 * 優先順位は下記の通り
 * 1. 承認取消 ※無効かつ要確認かつ他者の操作によるもので特に意識されにくいもの
 * 2. 却下     ※無効かつ要確認かつ他者の操作によるもの
 * 3. 申請取消 ※無効かつ要確認なもの
 * 4. 承認待ち
 * 5. 承認済み
 * 6. なし
 * @see https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/12655088#id-勤怠日次申請-ステータスアイコンとバッジの仕様
 * @private
 */
const detectRemarkableRequestStatus = ({
  latestRequests = [],
  isLocked,
}: {
  latestRequests: AttDailyRequest[];
  isLocked: boolean;
}): Status | null => {
  if (latestRequests.length === 0) {
    return null;
  }

  const includedStatus = latestRequests.reduce((hash, request) => {
    hash[request.status] = true;
    return hash;
  }, {});

  let remarkableRequestStatus = null;
  if (isLocked) {
    // 月次確定がされていた場合はなんであろうとステータスは承認済
    remarkableRequestStatus = STATUS.APPROVED;
  } else if (includedStatus[STATUS.CANCELED]) {
    remarkableRequestStatus = STATUS.CANCELED;
  } else if (includedStatus[STATUS.REJECTED]) {
    remarkableRequestStatus = STATUS.REJECTED;
  } else if (includedStatus[STATUS.RECALLED]) {
    remarkableRequestStatus = STATUS.RECALLED;
  } else if (includedStatus[STATUS.APPROVAL_IN]) {
    remarkableRequestStatus = STATUS.APPROVAL_IN;
  } else if (includedStatus[STATUS.APPROVED]) {
    remarkableRequestStatus = STATUS.APPROVED;
  }

  return remarkableRequestStatus;
};

/**
 * 勤務時間の操作が可能か否か、真偽を返却する
 * - NOTE:破壊的な変更であるため、コンストラクタ以外での呼び出しを禁止する
 */
const detectAvailabilityToOperateAttTime = ({
  recordDate,
  dayType,
  submittedRequests,
  hasActualWorkingTimes,
  isLeaveOfAbsence,
}: {
  recordDate: string;
  dayType: DayType;
  submittedRequests: AttDailyRequest[];
  hasActualWorkingTimes: boolean;
  isLeaveOfAbsence: boolean;
}): boolean => {
  // 勤務時刻をクリアするため、実労働時間を持つ場合は日タイプに関わらず操作可能とする
  if (hasActualWorkingTimes) {
    return true;
  }

  return isRequiredInputDaily({
    recordDate,
    dayType,
    isLeaveOfAbsence,
    requests: submittedRequests,
  });
};

const hasPermissionForSubmitNewRequest = ({
  isByDelegate,
  userPermission,
}: {
  isByDelegate: boolean;
  userPermission: Permission;
}) =>
  isPermissionSatisfied({
    isByDelegate,
    userPermission,
    allowIfByEmployee: true,
    requireIfByDelegate: ['submitAttDailyRequestByDelegate'],
  });

const detectAvailabilityToEntryNewRequest = ({
  isLocked,
  isByDelegate,
  userPermission,
}: {
  isLocked: boolean;
  isByDelegate: boolean;
  userPermission: Permission;
}): boolean =>
  !isLocked &&
  hasPermissionForSubmitNewRequest({ isByDelegate, userPermission });

/**
 * TODO: 後述のClass構文が廃止され次第、exportする
 */
const createFromParams = (
  {
    recordDate,
    dayType,
    hasActualWorkingTimes,
    requestIds,
    requestTypeCodes,
    isLeaveOfAbsence,
    isLocked: isDailyRecordLocked,
    isFlexWithoutCore,
  }: ExcerptOfAttRecordForCreate,
  requestMap: {
    [key: string]: AttDailyRequest;
  },
  requestTypeMap: DailyRequestNameMap,
  { isSummaryLocked, isByDelegate, userPermission }: OtherConditionsForCreate
): DailyRequestConditionsType => {
  // 再申請元申請のIDをキーにして再申請のみのマップを作ります。
  // これにより再申請元申請は自身のキーから再申請を探せるようになります。
  const requestMapByOriginalRequestId = Object.keys(requestMap).reduce(
    (hash, key) => {
      const obj = requestMap[key];
      if (
        String(obj.originalRequestId) !== '' &&
        requestMap[String(obj.originalRequestId)] !== undefined
      ) {
        hash[String(obj.originalRequestId)] = obj;
      }
      return hash;
    },
    {}
  );

  const isLocked = isSummaryLocked || isDailyRecordLocked;

  const submittedRequests = (requestIds || []).map((id) => requestMap[id]);

  const latestRequests = isSummaryLocked
    ? // 勤務確定済み：承認内容変更申請を無視する
      submittedRequests.filter((request) => !request.isForReapply)
    : // 勤務確定未済：承認内容変更申請があれば置き換える
      submittedRequests
        .map((req) => requestMapByOriginalRequestId[req.id || ''] || req)
        .filter((val, idx, arr) => arr.indexOf(val) === idx); // 重複を排除

  const availableRequestTypes = (requestTypeCodes || []).reduce(
    (hash, requestTypeCode) => {
      if (
        isFlexWithoutCore &&
        requestTypeCode === REQUEST_TYPE_CODE.EarlyLeave
      ) {
        const requestTypeName = getRequestTypeName(requestTypeCode, {
          nameMap: requestTypeMap,
          dailyRecord: {
            isFlexWithoutCore,
          },
        });
        hash[REQUEST_TYPE_CODE.EarlyLeave] = {
          ...requestTypeMap[REQUEST_TYPE_CODE.EarlyLeave],
          name: requestTypeName,
        };
      } else {
        hash[requestTypeCode] = requestTypeMap[requestTypeCode];
      }
      return hash;
    },
    {}
  );

  const effectualLeaveRequests = getEffectualLeaveRequests(submittedRequests);

  return {
    recordDate,
    latestRequests,
    availableRequestCount: latestRequests.length,
    availableRequestTypes,
    remarkableRequestStatus: detectRemarkableRequestStatus({
      latestRequests,
      isLocked,
    }),
    isAvailableToOperateAttTime: detectAvailabilityToOperateAttTime({
      recordDate,
      dayType,
      submittedRequests,
      hasActualWorkingTimes,
      isLeaveOfAbsence,
    }),
    isAvailableToEntryNewRequest: detectAvailabilityToEntryNewRequest({
      isLocked,
      isByDelegate,
      userPermission,
    }),
    isAvailableToModifySubmittedRequest: !isLocked,
    effectualLeaveRequests,
    effectualAllDayLeaveType:
      (
        effectualLeaveRequests.filter(
          (request) => request.leaveRange === LEAVE_RANGE.Day
        )[0] || {}
      ).leaveType || null,
    isAllowWorkDuringLeaveOfAbsence:
      isLeaveOfAbsence &&
      latestRequests.some(
        (request) =>
          request.requestTypeCode === REQUEST_TYPE_CODE.Pattern &&
          request.status === STATUS.APPROVED
      ),
    isApprovedAbsence: submittedRequests.some(
      (request) =>
        request.requestTypeCode === REQUEST_TYPE_CODE.Absence &&
        request.status === STATUS.APPROVED
    ),
    isLocked,
  };
};

/**
 * FIXME: いずれ廃止したい：componentのPropTypeに記述されたinstanceOf(...)が主な障害
 */
export default class DailyRequestConditions {
  recordDate: string;
  availableRequestTypes: Record<string, any>;
  latestRequests: Array<AttDailyRequest>;
  availableRequestCount: number;
  remarkableRequestStatus: Status | null | undefined;
  effectualLeaveRequests: Array<any> | null | undefined;
  effectualAllDayLeaveType: LeaveType | null;
  isApprovedAbsence: boolean;
  isAvailableToOperateAttTime: boolean;
  isAvailableToEntryNewRequest: boolean;
  isAvailableToModifySubmittedRequest: boolean;
  isAllowWorkDuringLeaveOfAbsence: boolean;
  isLocked: boolean;

  constructor(param: DailyRequestConditionsType) {
    Object.assign(this, param);
  }

  static createFromParams(
    param: ExcerptOfAttRecordForCreate,
    requestMap: {
      [key: string]: AttDailyRequest;
    },
    requestTypeMap: DailyRequestNameMap,
    otherConditions: OtherConditionsForCreate
  ): DailyRequestConditionsType {
    return new DailyRequestConditions(
      createFromParams(param, requestMap, requestTypeMap, otherConditions)
    );
  }
}

/**
 * 申請の備考を抽出して返却する
 */
export const collectRemarksFromRequests = (
  conditions: DailyRequestConditions
): Array<{
  requestTypeName?: string;
  remarks: string;
}> | null => {
  // TODO: 備考を抽出する条件を確認する（種別は？状態は？）
  const remarksList = (conditions.latestRequests || []).reduce(
    (result, request) => {
      if (request.remarks) {
        result.push({
          requestTypeName: request.requestTypeName,
          remarks: request.remarks,
        });
      }
      return result;
    },
    []
  );

  return remarksList.length ? remarksList : null;
};
