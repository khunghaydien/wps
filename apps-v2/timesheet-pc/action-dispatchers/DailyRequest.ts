import { bindActionCreators } from 'redux';

import head from 'lodash/head';
import isNil from 'lodash/isNil';

import { initDailyStampTime } from '../../commons/action-dispatchers/StampWidget';
import {
  catchApiError,
  CatchApiErrorAction,
  catchBusinessError,
  CatchUnexpectedErrorAction,
  confirm,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../commons/actions/app';
import msg from '../../commons/languages';

import AttDailyLeaveRepository from '../../repositories/attendance/AttDailyLeaveRepository';
import AttDailyPatternRepository from '../../repositories/attendance/AttDailyPatternRepository';
import AttDailyRequestRepository from '../../repositories/attendance/AttDailyRequestRepository';

import {
  isAvailableTimeTrack,
  Permission,
} from '../../domain/models/access-control/Permission';
import { AttDailyRecord } from '../../domain/models/attendance/AttDailyRecord';
import {
  AttDailyRequest,
  createFromDefaultValue,
  createFromRemote,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
  isForReapply,
} from '../../domain/models/attendance/AttDailyRequest';
import * as AbsenceRequest from '../../domain/models/attendance/AttDailyRequest/AbsenceRequest';
import * as DirectRequest from '../../domain/models/attendance/AttDailyRequest/DirectRequest';
import * as EarlyLeaveRequest from '../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';
import * as EarlyStartWorkRequest from '../../domain/models/attendance/AttDailyRequest/EarlyStartWorkRequest';
import * as HolidayWorkRequest from '../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import * as LateArrivalRequest from '../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';
import * as LeaveRequest from '../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import * as OvertimeWorkRequest from '../../domain/models/attendance/AttDailyRequest/OvertimeWorkRequest';
import * as PatternRequest from '../../domain/models/attendance/AttDailyRequest/PatternRequest';
import {
  AttDailyRequestTypeMap,
  CODE,
  Code,
} from '../../domain/models/attendance/AttDailyRequestType';
import { doesAttLeaveExist } from '../../domain/models/attendance/LeaveType';
import * as SubstituteLeaveType from '../../domain/models/attendance/SubstituteLeaveType';
import { TimesheetFromRemote } from '../../domain/models/attendance/Timesheet';
import { WorkingType } from '../../domain/models/attendance/WorkingType';
import { UserSetting } from '../../domain/models/UserSetting';
import DailyRequestConditions from '../models/DailyRequestConditions';

import { actions as editingActions } from '../modules/ui/dailyRequest/editing';
import { actions as absenceRequestActions } from '../modules/ui/dailyRequest/requests/absenceRequest';
import { actions as directRequestActions } from '../modules/ui/dailyRequest/requests/directRequest';
import { actions as earlyLeaveRequestActions } from '../modules/ui/dailyRequest/requests/earlyLeaveRequest';
import { actions as earlyStartWorkRequestActions } from '../modules/ui/dailyRequest/requests/earlyStartWorkRequest';
import { actions as holidayWorkRequestActions } from '../modules/ui/dailyRequest/requests/holidayWorkRequest';
import { actions as lateArrivalRequestActions } from '../modules/ui/dailyRequest/requests/lateArrivalRequest';
import { actions as leaveRequestActions } from '../modules/ui/dailyRequest/requests/leaveRequest';
import { actions as overtimeWorkRequestActions } from '../modules/ui/dailyRequest/requests/overtimeWorkRequest';
import { actions as patternRequestActions } from '../modules/ui/dailyRequest/requests/patternRequest';
import { actions as targetDateActions } from '../modules/ui/dailyRequest/targetDate';

import { AppDispatch } from './AppThunk';
import { load as loadAvailableDailyRequests } from './AvailableDailyRequest';
import { loadDailyTimeTrackRecords } from './DailyTimeTrack';
import {
  fetchTimesheet,
  fetchTimesheetAndAvailableDailyRequest,
} from './Timesheet';
import { loadTimeTrackAlerts } from './TimeTrackAlert';

/**
 * 各種勤怠申請毎にモジュールを結びつけます。
 * @param request 各種日時申請
 */
const initializeRequest =
  (target: AttDailyRequest) => (dispatch: AppDispatch) => {
    switch (target.type) {
      case CODE.Absence:
        dispatch(absenceRequestActions.initialize(target));
        break;
      case CODE.Direct:
        dispatch(directRequestActions.initialize(target));
        break;
      case CODE.EarlyStartWork:
        dispatch(earlyStartWorkRequestActions.initialize(target));
        break;
      case CODE.HolidayWork:
        dispatch(holidayWorkRequestActions.initialize(target));
        break;
      case CODE.LateArrival:
        dispatch(lateArrivalRequestActions.initialize(target));
        break;
      case CODE.EarlyLeave:
        dispatch(earlyLeaveRequestActions.initialize(target));
        break;
      case CODE.Leave:
        dispatch(leaveRequestActions.initialize(target));
        break;
      case CODE.OvertimeWork:
        dispatch(overtimeWorkRequestActions.initialize(target));
        break;
      case CODE.Pattern:
        dispatch(patternRequestActions.initialize(target));
        break;
      default:
        break;
    }
  };

/**
 * 申請済みの勤怠日次申請を詳細ペインに表示する
 * @param request 各種日時申請
 */
export const showRequestDetailPane =
  (target: AttDailyRequest) => (dispatch: AppDispatch) => {
    dispatch(initializeRequest(target));
    dispatch(editingActions.initialize(target));
  };

/**
 * 勤怠日次申請ダイアログを表示する
 */
export const showManagementDialog =
  (dailyRequestConditions: DailyRequestConditions, employeeId?: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const { recordDate, latestRequests } = dailyRequestConditions;
    const editingActionsService = bindActionCreators(editingActions, dispatch);
    const targetDateActionsService = bindActionCreators(
      targetDateActions,
      dispatch
    );
    const service = bindActionCreators(
      {
        loadingStart,
        loadingEnd,
      },
      dispatch
    );

    service.loadingStart();

    // 申請可能な申請一覧を取得する
    await dispatch(loadAvailableDailyRequests(recordDate, employeeId));

    // 画面に表示する日付を設定する。
    targetDateActionsService.set(recordDate);

    // 申請済みの申請があれば取得して画面に表示する
    const target = head(latestRequests);
    if (target) {
      dispatch(initializeRequest(target));
      dispatch(editingActions.initialize(target));
    } else {
      editingActionsService.clear();
    }

    service.loadingEnd();
  };

/**
 * 勤怠日次申請ダイアログを閉じる
 */
export const hideManagementDialog = targetDateActions.unset;

/**
 * 指定された種別の勤怠日次申請について、新規申請の編集画面を表示する
 * @param {AttRequestTypeCode} requestType
 * @param {String} targetDate
 * @param {AttWorkingType} attWorkingType
 * @param {?String} [targetEmployeeId=null] The ID of target employee
 */
export const showEntryRequestPane =
  (
    targetDate: string,
    requestTypeCode: Code,
    attRequestTypeMap: AttDailyRequestTypeMap,
    workingType: WorkingType,
    attDailyRecord: AttDailyRecord,
    targetEmployeeId: string | null | undefined = null
  ) =>
  async (dispatch: AppDispatch) => {
    const service = bindActionCreators(
      {
        loadingStart,
        loadingEnd,
        catchApiError,
        catchBusinessError,
      },
      dispatch
    );
    const editingActionsService = bindActionCreators(editingActions, dispatch);
    const target = createFromDefaultValue(attRequestTypeMap, requestTypeCode);

    switch (requestTypeCode) {
      // 休暇申請
      case CODE.Leave: {
        try {
          service.loadingStart();
          const attLeaveList = await AttDailyLeaveRepository.search({
            targetDate,
            empId: targetEmployeeId || '',
          });

          if (attLeaveList.length === 0) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_CannotCreateIfAttLeaveListLengthIsZero,
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          const leave = LeaveRequest.create(target, attLeaveList, targetDate);
          dispatch(leaveRequestActions.initialize(leave, attLeaveList));
          editingActionsService.initialize(target);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;
      }

      // 休日出勤申請
      case CODE.HolidayWork: {
        const holidayWorkRequest = HolidayWorkRequest.create(
          target,
          workingType,
          targetDate
        );
        const substituteLeaveType = SubstituteLeaveType.create(
          holidayWorkRequest,
          workingType,
          attDailyRecord.dayType
        );
        dispatch(
          holidayWorkRequestActions.initialize(
            holidayWorkRequest,
            substituteLeaveType
          )
        );
        editingActionsService.initialize(target);
        break;
      }

      // 早朝勤務申請
      case CODE.EarlyStartWork: {
        const earlyStartWorkRequest = EarlyStartWorkRequest.create(
          target,
          attDailyRecord.earlyStartWorkApplyDefaultEndTime,
          targetDate
        );
        dispatch(
          earlyStartWorkRequestActions.initialize(earlyStartWorkRequest)
        );
        editingActionsService.initialize(target);
        break;
      }

      // 残業申請
      case CODE.OvertimeWork: {
        const overtimeWorkRequest = OvertimeWorkRequest.create(
          target,
          attDailyRecord.overtimeWorkApplyDefaultStartTime,
          targetDate
        );
        dispatch(overtimeWorkRequestActions.initialize(overtimeWorkRequest));
        editingActionsService.initialize(target);
        break;
      }

      // 遅刻申請
      case CODE.LateArrival: {
        const lateArrivalRequest = LateArrivalRequest.create(
          target,
          attDailyRecord,
          targetDate
        );
        dispatch(lateArrivalRequestActions.initialize(lateArrivalRequest));
        editingActionsService.initialize(target);
        break;
      }

      // 早退申請
      case CODE.EarlyLeave: {
        const earlyLeaveRequest = EarlyLeaveRequest.create(
          target,
          attDailyRecord,
          targetDate
        );
        dispatch(earlyLeaveRequestActions.initialize(earlyLeaveRequest));
        editingActionsService.initialize(target);
        break;
      }

      // 欠勤申請
      case CODE.Absence: {
        const absenceRequest = AbsenceRequest.create(target, targetDate);
        dispatch(absenceRequestActions.initialize(absenceRequest));
        editingActionsService.initialize(target);
        break;
      }

      // 直行直帰申請
      case CODE.Direct: {
        const directRequest = DirectRequest.create(
          target,
          workingType,
          targetDate
        );
        dispatch(directRequestActions.initialize(directRequest));
        editingActionsService.initialize(target);
        break;
      }

      // 勤務時間変更申請
      case CODE.Pattern: {
        try {
          service.loadingStart();
          const attPatternList = await AttDailyPatternRepository.search({
            targetDate,
            empId: targetEmployeeId || '',
          });

          if (attPatternList.length === 0) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_CannotCreateIfAttPatternListLengthIsZero,
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          const patternRequest = PatternRequest.create(
            target,
            attPatternList,
            targetDate
          );
          dispatch(
            patternRequestActions.initialize(patternRequest, attPatternList)
          );
          editingActionsService.initialize(target);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;
      }
      default:
    }
  };

/**
 * 申請内容の変更／修正を開始する
 * @param target 変更・修正の対象の日次申請
 */
export const startEditing =
  (
    target: AttDailyRequest,
    workingType: WorkingType,
    attDailyRecord: AttDailyRecord,
    proxyEmployeeId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const service = bindActionCreators(
      {
        loadingStart,
        loadingEnd,
        catchApiError,
        catchBusinessError,
      },
      dispatch
    );
    const editingActionsService = bindActionCreators(editingActions, dispatch);

    switch (target.requestTypeCode) {
      // 休暇申請
      case CODE.Leave:
        try {
          service.loadingStart();
          const attLeaveList = await AttDailyLeaveRepository.search({
            targetDate: target.startDate,
            empId: proxyEmployeeId || '',
            ignoredId: target.id,
          });

          if (attLeaveList.length === 0) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_CannotEditIfAttLeaveListLengthIsZero,
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          if (isForReapply(target)) {
            if (doesAttLeaveExist(attLeaveList, target)) {
              const leave = LeaveRequest.create(target, attLeaveList);
              dispatch(leaveRequestActions.initialize(leave, attLeaveList));
            } else {
              const leave = LeaveRequest.create(target);
              dispatch(leaveRequestActions.initialize(leave));
            }
          } else {
            const leave = LeaveRequest.create(target);
            dispatch(leaveRequestActions.initialize(leave, attLeaveList));
          }
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }

        break;

      // 休日出勤申請
      case CODE.HolidayWork:
        const holidayWorkRequest = HolidayWorkRequest.create(target);
        const substituteLeaveType = SubstituteLeaveType.create(
          holidayWorkRequest,
          workingType,
          attDailyRecord.dayType
        );
        dispatch(
          holidayWorkRequestActions.initialize(
            holidayWorkRequest,
            substituteLeaveType
          )
        );
        editingActionsService.initialize(target, true);
        break;

      // 遅刻申請
      case CODE.LateArrival:
        const lateArrivalRequest = LateArrivalRequest.create(target);
        dispatch(
          lateArrivalRequestActions.initialize(
            lateArrivalRequest,
            attDailyRecord
          )
        );
        editingActionsService.initialize(target, true);
        break;

      // 早退申請
      case CODE.EarlyLeave:
        const earlyLeaveRequest = EarlyLeaveRequest.create(target);
        dispatch(
          earlyLeaveRequestActions.initialize(earlyLeaveRequest, attDailyRecord)
        );
        editingActionsService.initialize(target, true);
        break;

      // 勤務時間変更申請
      case CODE.Pattern:
        try {
          service.loadingStart();
          const patterns = await AttDailyPatternRepository.search({
            targetDate: target.startDate,
            empId: proxyEmployeeId || '',
            ignoredId: target.id,
          });

          if (patterns.length === 0) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              msg().Att_Err_CannotEditIfAttPatternListLengthIsZero,
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          const patternRequest = PatternRequest.create(target, patterns);
          dispatch(patternRequestActions.initialize(patternRequest, patterns));
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }

        break;

      default:
        dispatch(initializeRequest(target));
        editingActionsService.initialize(target, true);
    }
  };

/**
 * 申請内容の変更／修正を取り消す（中断する）
 */
export const cancelEditing =
  (request: AttDailyRequest) => (dispatch: AppDispatch) => {
    dispatch(initializeRequest(request));
    dispatch(editingActions.initialize(request));
  };

/**
 * 申請を提出する
 * @param editingRequest 編集中の申請
 * @param resultTargetPeriodStartDate 成功時に再取得・表示する対象となる集計期間の起算日
 * @param targetEmployeeId The ID of target employee
 */
export const submit =
  (
    editingRequest: AttDailyRequest,
    editAction: EditAction,
    resultTargetPeriodStartDate: string,
    targetEmployeeId: string | null = null,
    userSetting: UserSetting,
    userPermission: Permission
  ) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(async (): Promise<TimesheetFromRemote | void> => {
        try {
          if (editAction === EDIT_ACTION.Create) {
            await AttDailyRequestRepository.create(
              editingRequest,
              targetEmployeeId
            );
          } else {
            await AttDailyRequestRepository.update(
              editingRequest,
              editAction,
              targetEmployeeId
            );
          }
          dispatch(targetDateActions.unset());
          dispatch(editingActions.clear());

          // Note: 各種勤怠申請の種別や内容によっては、打刻状態が変化しうる
          const [timesheet, _]: [
            TimesheetFromRemote,
            void | CatchApiErrorAction | CatchUnexpectedErrorAction
          ] = await Promise.all([
            dispatch(
              fetchTimesheet(resultTargetPeriodStartDate, targetEmployeeId)
            ),
            dispatch(initDailyStampTime()),
          ]);
          if (
            isAvailableTimeTrack(
              userPermission,
              userSetting,
              !isNil(targetEmployeeId)
            )
          ) {
            const empId = targetEmployeeId || undefined;
            // Don't await loading time-tracking APIs
            Promise.all([
              dispatch(loadTimeTrackAlerts(timesheet, empId)),
              dispatch(loadDailyTimeTrackRecords(timesheet, empId)),
            ]);
          }
          return timesheet;
        } catch (err) {
          dispatch(catchApiError(err, { isContinuable: true }));
          return undefined;
        }
      })
    );
  };

/**
 * 取消系操作の共通の入り口＜申請取消・承認取消・申請取下＞
 * 申請を無効化する（共通：申請取消, 承認取消）
 * @param targetRequest
 * @param disableAction
 * @param resultTargetPeriodStartDate 成功時に再取得・表示する対象となる集計期間の起算日
 * @param targetEmployeeId The ID of target employee
 */
export const disable =
  (
    targetRequest: AttDailyRequest,
    disableAction: DisableAction,
    resultTargetPeriodStartDate: string,
    targetEmployeeId: string | null = null,
    userSetting: UserSetting,
    userPermission: Permission
  ) =>
  (
    dispatch: AppDispatch
  ):
    | {
        payload: { [p: string]: any; callback: (yes: boolean) => void };
        type: 'CONFIRM_DIALOG_OPEN';
      }
    | Promise<boolean> => {
    const request = () =>
      dispatch(
        withLoading(async (): Promise<TimesheetFromRemote | void> => {
          try {
            await AttDailyRequestRepository.delete(
              targetRequest.id,
              disableAction
            );

            // Note: 各種勤怠申請の種別や内容によっては、打刻状態が変化しうる
            const [[timesheet]]: [
              [TimesheetFromRemote, { [id: string]: Code[] }],
              void | CatchApiErrorAction | CatchUnexpectedErrorAction
            ] = await Promise.all([
              dispatch(
                fetchTimesheetAndAvailableDailyRequest(
                  resultTargetPeriodStartDate,
                  targetEmployeeId
                )
              ),
              dispatch(initDailyStampTime()),
            ]);

            const requestId = targetRequest.id;
            const { requestTypes, requests } = timesheet;
            if (requests[requestId]) {
              const $request = createFromRemote(
                requestTypes,
                requests[requestId]
              );
              dispatch(showRequestDetailPane($request));
            } else {
              dispatch(editingActions.clear());
            }

            if (
              isAvailableTimeTrack(
                userPermission,
                userSetting,
                !isNil(targetEmployeeId)
              )
            ) {
              const empId = targetEmployeeId || undefined;
              // Don't await loading time-tracking APIs
              Promise.all([
                dispatch(loadTimeTrackAlerts(timesheet, empId)),
                dispatch(loadDailyTimeTrackRecords(timesheet, empId)),
              ]);
            }

            return timesheet;
          } catch (err) {
            dispatch(catchApiError(err, { isContinuable: true }));
            return undefined;
          }
        })
      );

    switch (disableAction) {
      case DISABLE_ACTION.CancelRequest:
      case DISABLE_ACTION.CancelApproval:
        return request();

      case DISABLE_ACTION.Remove: {
        const message = msg().Att_Msg_DailyReqConfirmRemove;
        dispatch(
          confirm(message, (isAllowed: boolean): void => {
            if (isAllowed) {
              request();
            }
          })
        );
        return;
      }

      default:
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('Unknown disable action');
    }
  };
