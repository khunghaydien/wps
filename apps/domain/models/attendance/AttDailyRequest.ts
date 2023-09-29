import Api from '../../../commons/api';

import { AttDailyDetailBaseFromApi } from '../approval/AttDailyDetail/Base';
import { None } from '../approval/AttDailyDetail/None';
import STATUS, { ORDER_OF_STATUS, Status } from '../approval/request/Status';
import { AttDailyRecord } from './AttDailyRecord';
import * as Absence from './AttDailyRequest/AbsenceRequest';
import * as Base from './AttDailyRequest/BaseAttDailyRequest';
import * as Direct from './AttDailyRequest/DirectRequest';
import * as EarlyLeave from './AttDailyRequest/EarlyLeaveRequest';
import * as EarlyStartWork from './AttDailyRequest/EarlyStartWorkRequest';
import * as HolidayWork from './AttDailyRequest/HolidayWorkRequest';
import * as LateArrival from './AttDailyRequest/LateArrivalRequest';
import * as Leave from './AttDailyRequest/LeaveRequest';
import * as OvertimeWork from './AttDailyRequest/OvertimeWorkRequest';
import * as Pattern from './AttDailyRequest/PatternRequest';
import {
  AttDailyRequestType,
  CODE as REQUEST_TYPE_CODE,
  Code as AttDailyRequestTypeCode,
} from './AttDailyRequestType';
import { LEAVE_RANGE } from './LeaveRange';
import { SUBSTITUTE_LEAVE_TYPE } from './SubstituteLeaveType';
import { getAttDailyRecordByDate, Timesheet } from './Timesheet';

export type { BaseAttDailyRequest } from './AttDailyRequest/BaseAttDailyRequest';

/**
 * 編集系操作
 * - Create: 新規作成
 * - Modify: 修正
 * - Reapply: 承認内容変更
 */
export type EditAction = 'Create' | 'Modify' | 'Reapply' | 'None';
export const EDIT_ACTION: { [key in EditAction]: EditAction } = {
  Create: 'Create',
  Modify: 'Modify',
  Reapply: 'Reapply',
  None: 'None',
};

/**
 * 取消系操作
 * - CancelRequest: 申請取消
 * - CancelApproval: 承認取消
 * - Remove: 申請取下
 */
export type DisableAction =
  | 'CancelRequest'
  | 'CancelApproval'
  | 'Remove'
  | 'None';
export const DISABLE_ACTION: { [key in DisableAction]: DisableAction } = {
  CancelRequest: 'CancelRequest',
  CancelApproval: 'CancelApproval',
  Remove: 'Remove',
  None: 'None',
};

export type AttDailyRequest =
  | Leave.LeaveRequest
  | HolidayWork.HolidayWorkRequest
  | EarlyStartWork.EarlyStartWorkRequest
  | OvertimeWork.OvertimeWorkRequest
  | EarlyLeave.EarlyLeaveRequest
  | LateArrival.LateArrivalRequest
  | Direct.DirectRequest
  | Absence.AbsenceRequest
  | Pattern.PatternRequest;

export const createFromRemote = (
  attRequestTypeMap: { [key in AttDailyRequestTypeCode]?: AttDailyRequestType },
  fromRemote: Base.AttDailyRequestFromRemote
): AttDailyRequest => {
  const request = Base.createFromRemote(attRequestTypeMap, fromRemote);
  switch (request.requestTypeCode) {
    case REQUEST_TYPE_CODE.Leave:
      return Leave.create(request);
    case REQUEST_TYPE_CODE.HolidayWork:
      return HolidayWork.create(request);
    case REQUEST_TYPE_CODE.EarlyStartWork:
      return EarlyStartWork.create(request);
    case REQUEST_TYPE_CODE.OvertimeWork:
      return OvertimeWork.create(request);
    case REQUEST_TYPE_CODE.LateArrival:
      return LateArrival.create(request);
    case REQUEST_TYPE_CODE.EarlyLeave:
      return EarlyLeave.create(request);
    case REQUEST_TYPE_CODE.Absence:
      return Absence.create(request);
    case REQUEST_TYPE_CODE.Direct:
      return Direct.create(request);
    case REQUEST_TYPE_CODE.Pattern:
      return Pattern.create(request);
    default:
      throw new Error('Undefined AttDailyRequestType');
  }
};

export const createFromDefaultValue = (
  attRequestTypeMap: {
    [key in AttDailyRequestTypeCode]?: AttDailyRequestType;
  },
  requestTypeCode: AttDailyRequestTypeCode,
  value: Base.BaseAttDailyRequest = Base.defaultValue
): AttDailyRequest => {
  const defaultValue = {
    ...value,
    requestTypeCode,
    requestTypeName: attRequestTypeMap[requestTypeCode].name,
  };
  switch (requestTypeCode) {
    case REQUEST_TYPE_CODE.Leave:
      return Leave.create(defaultValue);
    case REQUEST_TYPE_CODE.HolidayWork:
      return HolidayWork.create(defaultValue);
    case REQUEST_TYPE_CODE.EarlyStartWork:
      return EarlyStartWork.create(defaultValue);
    case REQUEST_TYPE_CODE.OvertimeWork:
      return OvertimeWork.create(defaultValue);
    case REQUEST_TYPE_CODE.LateArrival:
      return LateArrival.create(defaultValue);
    case REQUEST_TYPE_CODE.EarlyLeave:
      return EarlyLeave.create(defaultValue);
    case REQUEST_TYPE_CODE.Absence:
      return Absence.create(defaultValue);
    case REQUEST_TYPE_CODE.Direct:
      return Direct.create(defaultValue);
    case REQUEST_TYPE_CODE.Pattern:
      return Pattern.create(defaultValue);
    default:
      throw new Error('Undefined AttDailyRequestType');
  }
};

/**
 * Obtain available request types of Timesheet object
 * 勤務表から利用可能な申請タイプを取得します
 *
 * @return an array of request type/ 申請タイプの配列
 */
export const getAvailableRequestTypesAt = <U extends Timesheet>(
  requestTypeCodes: AttDailyRequestTypeCode[],
  timesheet: U
):
  | { [key in AttDailyRequestTypeCode]?: AttDailyRequestType }
  | { code: string } => {
  if (timesheet.isLocked) {
    return {};
  }
  return (requestTypeCodes || []).reduce((hash, requestTypeCode) => {
    hash[requestTypeCode] = timesheet.requestTypes[requestTypeCode];
    return hash;
  }, {});
};

/**
 * Obtain latest requests by using Timesheet
 * 勤務表から既存の申請を返します
 *
 * @return AttDailyRequest[]
 */
export const getLatestRequestsAt = <
  T extends AttDailyRecord,
  U extends Timesheet
>(
  dailyRecord: T,
  timesheet: U
): AttDailyRequest[] => {
  // 再申請元申請のIDをキーにして再申請のみのマップを作ります。
  // これにより再申請元申請は自身のキーから再申請を探せるようになります。
  const requestMapByOriginalRequestId = Object.keys(
    timesheet.requestsById
  ).reduce((hash, key) => {
    const obj = timesheet.requestsById[key];
    if (
      obj.originalRequestId &&
      timesheet.requestsById[obj.originalRequestId] !== undefined
    ) {
      hash[obj.originalRequestId] = obj;
    }
    return hash;
  }, {});

  const submittedRequests = dailyRecord.requestIds.map(
    (id) => timesheet.requestsById[id]
  );

  const latestRequests: AttDailyRequest[] = timesheet.isLocked
    ? // 勤務確定済み：承認内容変更申請を無視する
      submittedRequests.filter((request) => !request.isForReapply)
    : // 勤務確定未済：承認内容変更申請があれば置き換える
      submittedRequests
        .map((req) => requestMapByOriginalRequestId[req.id || ''] || req)
        .filter((val, idx, arr) => arr.indexOf(val) === idx); // 重複を排除

  return latestRequests;
};

/**
 * Obtain performable Edit action
 * 操作可能な編集系操作を返します。
 */
export const getPerformableEditAction = <T extends Readonly<AttDailyRequest>>(
  request: T
): EditAction => {
  switch (request.status) {
    case STATUS.NotRequested:
      return EDIT_ACTION.Create;
    case STATUS.ApprovalIn:
      return EDIT_ACTION.None;

    case STATUS.Approved:
      switch (request.requestTypeCode) {
        case REQUEST_TYPE_CODE.Leave:
          if (request.leaveRange === LEAVE_RANGE.Day) {
            return EDIT_ACTION.Reapply;
          } else {
            return EDIT_ACTION.None;
          }
        case REQUEST_TYPE_CODE.HolidayWork:
          if (
            request.substituteLeaveType !==
            SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked
          ) {
            return EDIT_ACTION.Reapply;
          } else {
            return EDIT_ACTION.None;
          }
        default:
          return EDIT_ACTION.None;
      }

    case STATUS.Rejected:
    case STATUS.Recalled:
    case STATUS.Canceled:
      return EDIT_ACTION.Modify;

    default:
      return EDIT_ACTION.None;
  }
};

/**
 * Obtain performable Disable action
 * 操作可能な取消系操作を返します。
 */
export const getPerformableDisableAction = <
  T extends Readonly<AttDailyRequest>
>(
  request: T
): DisableAction => {
  switch (request.status) {
    case STATUS.NotRequested:
      return DISABLE_ACTION.None;
    case STATUS.ApprovalIn:
      return DISABLE_ACTION.CancelRequest;

    case STATUS.Approved:
      return DISABLE_ACTION.CancelApproval;

    case STATUS.Rejected:
    case STATUS.Recalled:
    case STATUS.Canceled:
      return DISABLE_ACTION.Remove;

    default:
      return DISABLE_ACTION.None;
  }
};

/**
 * 有効な(=画面上のグラフに反映される)申請かどうかを返す。
 */
export const isEffectual = <A extends Readonly<AttDailyRequest>>(
  request: A,
  requestTypeCode: AttDailyRequestTypeCode
): boolean =>
  request.requestTypeCode === requestTypeCode &&
  (request.status === STATUS.Approved || request.status === STATUS.Reapplying);

/**
 * 有効な(=画面上のグラフに反映される)休暇申請の配列を返す
 * @param string targetDate
 * @param TimeSheet timeSheet
 */
export const getEffectualLeaveRequests = (
  requests: AttDailyRequest[]
): Leave.LeaveRequest[] =>
  requests
    .filter((request) => isEffectual(request, REQUEST_TYPE_CODE.Leave))
    .map((request) => Leave.create(request));

/**
 * 有効な欠勤申請があるかどうかを返す
 * @param string targetDate
 * @param TimeSheet timeSheet
 */
export const hasEffectualAbsenceRequest = (
  requests: AttDailyRequest[]
): boolean =>
  requests.some((request) => isEffectual(request, REQUEST_TYPE_CODE.Absence));

/**
 * 変更申請かどうかを返します。
 *
 * editAction === EDIT_ACTION.Reapply : 新規変更申請
 * editAction === EDIT_ACTION.Modify  : 変更申請の変更
 *
 * @param {*} request
 */
export const isForReapply = (request: AttDailyRequest): boolean => {
  const editAction = getPerformableEditAction(request);
  return (
    (editAction === EDIT_ACTION.Modify && request.isForReapply) ||
    editAction === EDIT_ACTION.Reapply
  );
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
export const getRemarkableRequestStatus = <T extends Readonly<Timesheet>>(
  targetDate: string,
  timesheet: T
): {
  count: number;
  status: Status;
} | null => {
  const record = getAttDailyRecordByDate(targetDate, timesheet);
  if (record === null) {
    return null;
  }

  const latestRequests = getLatestRequestsAt(record, timesheet);
  if (latestRequests.length === 0) {
    return null;
  }

  const count = latestRequests.length;

  const { isLocked } = timesheet;
  if (isLocked) {
    return {
      count,
      status: STATUS.Approved,
    };
  }

  const includedStatus = latestRequests.reduce((hash, request) => {
    hash[request.status] = true;
    return hash;
  }, {});

  const status = ORDER_OF_STATUS.find((key) => includedStatus[key]);
  if (status) {
    return {
      count,
      status,
    };
  }

  return null;
};

export const getAttRequest = (
  requestId: string
): Promise<AttDailyDetailBaseFromApi<None>> => {
  return Api.invoke({
    path: '/att/request/daily/get',
    param: { requestId },
  }).then((response: AttDailyDetailBaseFromApi<None>) => response);
};
