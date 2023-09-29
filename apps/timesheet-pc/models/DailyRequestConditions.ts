import {
  isPermissionSatisfied,
  Permission,
} from '../../domain/models/access-control/Permission';
import STATUS, { Status } from '../../domain/models/approval/request/Status';
import { shouldInputByParam as shouldInputAttDailyRecordByParam } from '../../domain/models/attendance/AttDailyRecord';
import {
  AttDailyRequest,
  getEffectualLeaveRequests,
} from '../../domain/models/attendance/AttDailyRequest';
import {
  AttDailyRequestTypeMap,
  CODE as REQUEST_TYPE_CODE,
  Code as AttRequestTypeCode,
} from '../../domain/models/attendance/AttDailyRequestType';
import { LEAVE_RANGE } from '../../domain/models/attendance/LeaveRange';
import { LeaveType } from '../../domain/models/attendance/LeaveType';

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
  availableRequestTypes: AttDailyRequestTypeMap;

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
   * 産後パパ育休であるか否かのフラグ
   */
  isPaternityLeaveAtBirth: boolean;

  /**
   * 勤務表がロックされているか否かのフラグ
   */
  isLocked: boolean;
};

type ExcerptOfAttRecordForCreate = {
  recordDate: string;
  dayType: string;
  hasActualWorkingTimes: boolean;
  requestIds: Array<string>;
  requestTypeCodes: AttRequestTypeCode[];
  isLeaveOfAbsence: boolean;
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
    remarkableRequestStatus = STATUS.Approved;
  } else if (includedStatus[STATUS.Canceled]) {
    remarkableRequestStatus = STATUS.Canceled;
  } else if (includedStatus[STATUS.Rejected]) {
    remarkableRequestStatus = STATUS.Rejected;
  } else if (includedStatus[STATUS.Recalled]) {
    remarkableRequestStatus = STATUS.Recalled;
  } else if (includedStatus[STATUS.ApprovalIn]) {
    remarkableRequestStatus = STATUS.ApprovalIn;
  } else if (includedStatus[STATUS.Approved]) {
    remarkableRequestStatus = STATUS.Approved;
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
  dayType: string;
  submittedRequests: AttDailyRequest[];
  hasActualWorkingTimes: boolean;
  isLeaveOfAbsence: boolean;
}): boolean => {
  // 勤務時刻をクリアするため、実労働時間を持つ場合は日タイプに関わらず操作可能とする
  if (hasActualWorkingTimes) {
    return true;
  }

  return shouldInputAttDailyRecordByParam({
    recordDate,
    dayType,
    isLeaveOfAbsence,
    requests: submittedRequests as AttDailyRequest[],
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
  }: ExcerptOfAttRecordForCreate,
  requestMap: {
    [key: string]: AttDailyRequest;
  },
  requestTypeMap: AttDailyRequestTypeMap,
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

  const isLocked = isSummaryLocked;

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
      hash[requestTypeCode] = requestTypeMap[requestTypeCode];
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
    isPaternityLeaveAtBirth:
      isLeaveOfAbsence &&
      latestRequests.some(
        (request) =>
          request.requestTypeCode === REQUEST_TYPE_CODE.Direct &&
          request.status === STATUS.Approved
      ),
    isApprovedAbsence: submittedRequests.some(
      (request) =>
        request.requestTypeCode === REQUEST_TYPE_CODE.Absence &&
        request.status === STATUS.Approved
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
  isPaternityLeaveAtBirth: boolean;
  isLocked: boolean;

  constructor(param: DailyRequestConditionsType) {
    Object.assign(this, param);
  }

  static createFromParams(
    param: ExcerptOfAttRecordForCreate,
    requestMap: {
      [key: string]: AttDailyRequest;
    },
    requestTypeMap: AttDailyRequestTypeMap,
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
