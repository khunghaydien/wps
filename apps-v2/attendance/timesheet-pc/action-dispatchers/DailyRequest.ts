import { bindActionCreators } from 'redux';

import head from 'lodash/head';
import isNil from 'lodash/isNil';

import {
  catchApiError,
  CatchApiErrorAction,
  catchBusinessError,
  CatchUnexpectedErrorAction,
  confirm,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';

import AttDailyRequestRepository from '@attendance/repositories/AttDailyRequestRepository';
import AttPatternRepository from '@attendance/repositories/AttPatternRepository';
import EarlyLeaveReasonRepository from '@attendance/repositories/EarlyLeaveReasonRepository';
import LateArrivalReasonRepository from '@attendance/repositories/LateArrivalReasonRepository';
import AttDailyLeaveRepository from '@attendance/repositories/LeaveRepository';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import {
  isAvailableTimeTrack,
  Permission,
} from '../../../domain/models/access-control/Permission';
import { UserSetting } from '../../../domain/models/UserSetting';
import DailyRequestConditions from '../models/DailyRequestConditions';
import {
  AttDailyRecord,
  DAY_TYPE,
} from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest,
  createFromDefaultValue,
  createFromRemote,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '@attendance/domain/models/AttDailyRequest';
import * as AbsenceRequest from '@attendance/domain/models/AttDailyRequest/AbsenceRequest';
import * as DirectRequest from '@attendance/domain/models/AttDailyRequest/DirectRequest';
import * as EarlyLeaveRequest from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import * as EarlyStartWorkRequest from '@attendance/domain/models/AttDailyRequest/EarlyStartWorkRequest';
import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import * as LateArrivalRequest from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import * as OvertimeWorkRequest from '@attendance/domain/models/AttDailyRequest/OvertimeWorkRequest';
import * as PatternRequest from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import {
  CODE,
  Code,
  DailyRequestNameMap,
} from '@attendance/domain/models/AttDailyRequestType';
import * as AttPattern from '@attendance/domain/models/AttPattern';
import {
  WORK_SYSTEM_TYPE,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

import { State } from '../modules';
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

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import UseCases from '../UseCases';
import { AppDispatch } from './AppThunk';
import { load as loadAvailableDailyRequests } from './AvailableDailyRequest';
import { loadDailyTimeTrackRecords } from './DailyTimeTrack';
import { initDailyStampTime } from './StampWidget';
import { fetchTimesheetAndAvailableDailyRequest } from './Timesheet';
import { loadTimeTrackAlerts } from './TimeTrackAlert';
import * as Factories from '@attendance/domain/factories/dailyRequest';
import holidayWorkRequestPatternName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/patternName';

const HolidayWorkRequestFactory = {
  NewRequest: Factories.HolidayWorkRequestFactory.createNewRequest({
    AttPatternRepository,
  }),
  ForReadOnly: Factories.HolidayWorkRequestFactory.createForReadOnly,
  ForEditing: Factories.HolidayWorkRequestFactory.createForEditing({
    AttPatternRepository,
  }),
};

const LeaveRequestFactory = {
  NewRequest: Factories.LeaveRequestFactory.createNewRequest({
    LeaveRepository: AttDailyLeaveRepository,
  }),
  ForReadOnly: Factories.LeaveRequestFactory.createForReadOnly,
  ForEditing: Factories.LeaveRequestFactory.createForEditing({
    LeaveRepository: AttDailyLeaveRepository,
  }),
};

type GetState = () => State;
/**
 * 各種勤怠申請毎にモジュールを結びつけます。
 * @param request 各種日時申請
 */
const initializeRequest =
  (target: AttDailyRequest, maxRestTimesCount: number) =>
  (dispatch: AppDispatch) => {
    switch (target.type) {
      case CODE.Absence:
        dispatch(absenceRequestActions.initialize(target));
        break;
      case CODE.Direct:
        dispatch(directRequestActions.initialize(target, maxRestTimesCount));
        break;
      case CODE.EarlyStartWork:
        dispatch(earlyStartWorkRequestActions.initialize(target));
        break;
      case CODE.HolidayWork:
        dispatch(
          holidayWorkRequestActions.initialize(
            HolidayWorkRequestFactory.ForReadOnly({
              patternName: holidayWorkRequestPatternName,
            }).create(target)
          )
        );
        break;
      case CODE.LateArrival:
        dispatch(lateArrivalRequestActions.initialize(target));
        break;
      case CODE.EarlyLeave:
        dispatch(earlyLeaveRequestActions.initialize(target));
        break;
      case CODE.Leave:
        dispatch(
          leaveRequestActions.initialize(
            LeaveRequestFactory.ForReadOnly().create(target)
          )
        );
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
  (target: AttDailyRequest, maxRestTimesCount: number) =>
  (dispatch: AppDispatch) => {
    if (target.requestTypeCode === CODE.Pattern) {
      target.requestableDayType = target.requestDayType;
      target.canDirectInputTimeRequest = target.isDirectInputTimeRequest;
    }
    dispatch(initializeRequest(target, maxRestTimesCount));
    dispatch(editingActions.initialize(target));
  };

/**
 * 勤怠日次申請ダイアログを表示する
 */
export const showManagementDialog =
  (
    dailyRequestConditions: DailyRequestConditions,
    maxRestTimesCount: number,
    employeeId?: string
  ) =>
  async (dispatch: AppDispatch, getState: GetState): Promise<void> => {
    const {
      recordDate,
      latestRequests,
      isLocked: locked,
    } = dailyRequestConditions;
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
    if (!locked) {
      await dispatch(loadAvailableDailyRequests(recordDate, employeeId));
    }

    // 画面に表示する日付を設定する。
    targetDateActionsService.set(recordDate);

    const patternRequest = latestRequests.find(
      (item) =>
        item.requestTypeCode === CODE.Pattern && item.isDirectInputTimeRequest
    );

    if (patternRequest != null) {
      const directInputInfo = AttPattern.createDirectInput(
        msg().Att_Lbl_DirectInput,
        patternRequest
      );
      dispatch(patternRequestActions.setDirectInput(directInputInfo));
    }

    // 申請済みの申請があれば取得して画面に表示する
    const target = head(latestRequests);
    if (target) {
      if (target.requestTypeCode === CODE.Pattern) {
        target.requestableDayType = target.requestDayType;
        target.canDirectInputTimeRequest = target.isDirectInputTimeRequest;
      }
      const state = getState();
      const attWorkingType = RecordsUtil.getWithinRange(
        recordDate,
        state.entities.timesheet.workingTypes
      );
      const workingTypeInfo = AttPattern.createRegularShift(
        msg().Att_Lbl_WorkPattern,
        attWorkingType
      );
      dispatch(patternRequestActions.setWorkingType(workingTypeInfo));
      dispatch(
        lateArrivalRequestActions.setLateArrivalReason(
          attWorkingType.useLateArrivalReason
        )
      );
      dispatch(
        earlyLeaveRequestActions.setEarlyLeaveReason(
          attWorkingType.useEarlyLeaveReason
        )
      );
      dispatch(initializeRequest(target, maxRestTimesCount));
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
    attRequestTypeMap: DailyRequestNameMap,
    workingType: WorkingType,
    attDailyRecord: AttDailyRecord,
    targetEmployeeId: string | null | undefined = null,
    maxRestTimesCount: number
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
    const target = createFromDefaultValue(requestTypeCode, {
      nameMap: attRequestTypeMap,
      dailyRecord: attDailyRecord,
    });

    switch (requestTypeCode) {
      // 休暇申請
      case CODE.Leave: {
        try {
          service.loadingStart();

          const leave = await LeaveRequestFactory.NewRequest({
            targetDate,
            employeeId: targetEmployeeId || '',
          }).create(target as LeaveRequest.LeaveRequest);

          if (leave.leaves.size === 0) {
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

          dispatch(leaveRequestActions.initialize(leave));
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
        try {
          service.loadingStart();
          const holidayWorkRequest = await HolidayWorkRequestFactory.NewRequest(
            {
              employeeId: targetEmployeeId,
              dayType: attDailyRecord.dayType,
              workingType,
              targetDate,
              patternName: holidayWorkRequestPatternName,
            }
          ).create(target as HolidayWorkRequest.HolidayWorkRequest);
          dispatch(holidayWorkRequestActions.initialize(holidayWorkRequest));
          editingActionsService.initialize(target);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }

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
        try {
          service.loadingStart();
          const lateArrivalReasonList =
            await LateArrivalReasonRepository.fetchList({
              targetDate,
              employeeId: targetEmployeeId || '',
            });
          const lateArrivalRequest = LateArrivalRequest.create(
            target,
            attDailyRecord,
            targetDate,
            lateArrivalReasonList,
            workingType.useLateArrivalReason
          );
          dispatch(
            lateArrivalRequestActions.setLateArrivalReason(
              workingType.useLateArrivalReason
            )
          );
          dispatch(
            lateArrivalRequestActions.initialize(
              lateArrivalRequest,
              null,
              lateArrivalReasonList
            )
          );
          editingActionsService.initialize(target);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;
      }

      // 早退申請
      case CODE.EarlyLeave: {
        try {
          service.loadingStart();
          const earlyLeaveReasonList =
            await EarlyLeaveReasonRepository.fetchList({
              targetDate,
              employeeId: targetEmployeeId || '',
            });
          const earlyLeaveRequest = EarlyLeaveRequest.create(
            target,
            targetDate
          );
          dispatch(
            earlyLeaveRequestActions.setUpForEditing(
              earlyLeaveRequest,
              attDailyRecord,
              earlyLeaveReasonList,
              workingType.useEarlyLeaveReason
            )
          );
          editingActionsService.initialize(target);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
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
        dispatch(
          directRequestActions.initialize(directRequest, maxRestTimesCount)
        );
        editingActionsService.initialize(target);
        break;
      }

      // 勤務時間変更申請
      case CODE.Pattern: {
        try {
          service.loadingStart();
          const attPatternList = await AttPatternRepository.fetch({
            targetDate,
            employeeId: targetEmployeeId || '',
          });

          if (attPatternList.requestableDayType === DAY_TYPE.Workday) {
            const workingTypeInfo = AttPattern.createRegularShift(
              msg().Att_Lbl_WorkPattern,
              workingType
            );

            attPatternList.patterns.unshift(workingTypeInfo);
          }

          if (
            attPatternList.canDirectInputTimeRequest &&
            workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Discretion &&
            workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Manager
          ) {
            const directInputInfo = AttPattern.createDirectInput(
              msg().Att_Lbl_DirectInput,
              null
            );
            attPatternList.patterns.push(directInputInfo);
          }

          if (
            attDailyRecord.dayType === DAY_TYPE.Workday &&
            attPatternList.requestableDayType === DAY_TYPE.Workday
          ) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              TextUtil.template(
                msg().Att_Err_NotAvailableDayType,
                targetDate,
                msg().Att_Lbl_WorkDay
              ),
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          if (
            attDailyRecord.dayType === DAY_TYPE.Holiday &&
            attPatternList.requestableDayType === DAY_TYPE.Holiday
          ) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              TextUtil.template(
                msg().Att_Err_NotAvailableDayType,
                targetDate,
                msg().Att_Lbl_Holiday
              ),
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          if (
            attPatternList.patterns.length === 0 &&
            attPatternList.requestableDayType === null
          ) {
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
            attPatternList.patterns,
            targetDate,
            attPatternList.requestableDayType,
            attPatternList.canDirectInputTimeRequest
          );
          dispatch(
            patternRequestActions.initialize(
              patternRequest,
              attPatternList.patterns
            )
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
    proxyEmployeeId: string,
    targetDate: string,
    maxRestTimesCount: number
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

          const leave = await LeaveRequestFactory.ForEditing({
            targetDate: target.startDate,
            employeeId: proxyEmployeeId || '',
            ignoredId: target.id,
          }).create(target as LeaveRequest.LeaveRequest);

          if (leave.leaves.size === 0) {
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

          dispatch(leaveRequestActions.initialize(leave));
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }

        break;

      // 休日出勤申請
      case CODE.HolidayWork:
        try {
          service.loadingStart();
          const holidayWorkRequest = await HolidayWorkRequestFactory.ForEditing(
            {
              employeeId: proxyEmployeeId,
              dayType: attDailyRecord.dayType,
              workingType,
              patternName: holidayWorkRequestPatternName,
              ignoredId: target.id,
            }
          ).create(target as HolidayWorkRequest.HolidayWorkRequest);
          dispatch(holidayWorkRequestActions.initialize(holidayWorkRequest));
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;

      // 遅刻申請
      case CODE.LateArrival:
        try {
          service.loadingStart();
          const lateArrivalReasonList =
            await LateArrivalReasonRepository.fetchList({
              targetDate,
              employeeId: proxyEmployeeId || '',
            });
          const lateArrivalRequest = LateArrivalRequest.create(
            target,
            null,
            null,
            lateArrivalReasonList,
            workingType.useLateArrivalReason
          );
          dispatch(
            lateArrivalRequestActions.setLateArrivalReason(
              workingType.useLateArrivalReason
            )
          );
          dispatch(
            lateArrivalRequestActions.initialize(
              lateArrivalRequest,
              attDailyRecord,
              lateArrivalReasonList
            )
          );
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;

      // 早退申請
      case CODE.EarlyLeave:
        try {
          service.loadingStart();
          const earlyLeaveReasonList =
            await EarlyLeaveReasonRepository.fetchList({
              targetDate,
              employeeId: proxyEmployeeId || '',
            });
          const earlyLeaveRequest = EarlyLeaveRequest.create(target, null);
          dispatch(
            earlyLeaveRequestActions.setUpForEditing(
              earlyLeaveRequest,
              attDailyRecord,
              earlyLeaveReasonList,
              workingType.useEarlyLeaveReason
            )
          );
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }
        break;

      // 勤務時間変更申請
      case CODE.Pattern:
        try {
          service.loadingStart();
          const patterns = await AttPatternRepository.fetch({
            targetDate,
            employeeId: proxyEmployeeId || '',
            ignoredId: target.id,
          });

          if (patterns.requestableDayType === DAY_TYPE.Workday) {
            const workingTypeInfo = AttPattern.createRegularShift(
              msg().Att_Lbl_WorkPattern,
              workingType
            );

            patterns.patterns.unshift(workingTypeInfo);
          }

          if (
            patterns.canDirectInputTimeRequest &&
            workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Discretion &&
            workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Manager
          ) {
            const directInputInfo = AttPattern.createDirectInput(
              msg().Att_Lbl_DirectInput,
              target
            );

            patterns.patterns.push(directInputInfo);
          }

          if (
            attDailyRecord.dayType === DAY_TYPE.Workday &&
            patterns.requestableDayType === DAY_TYPE.Workday
          ) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              TextUtil.template(
                msg().Att_Err_NotAvailableDayType,
                targetDate,
                msg().Att_Lbl_WorkDay
              ),
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          if (
            attDailyRecord.dayType === DAY_TYPE.Holiday &&
            patterns.requestableDayType === DAY_TYPE.Holiday
          ) {
            service.catchBusinessError(
              msg().Com_Lbl_Error,
              TextUtil.template(
                msg().Att_Err_NotAvailableDayType,
                targetDate,
                msg().Att_Lbl_Holiday
              ),
              null,
              {
                isContinuable: true,
              }
            );
            return;
          }

          if (
            patterns.patterns.length === 0 &&
            patterns.requestableDayType === null
          ) {
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

          const patternRequest = PatternRequest.create(
            target,
            patterns.patterns,
            null,
            patterns.requestableDayType,
            patterns.canDirectInputTimeRequest
          );
          dispatch(
            patternRequestActions.initialize(patternRequest, patterns.patterns)
          );
          editingActionsService.initialize(target, true);
        } catch (err) {
          service.catchApiError(err, { isContinuable: true });
        } finally {
          service.loadingEnd();
        }

        break;

      default:
        dispatch(initializeRequest(target, maxRestTimesCount));
        editingActionsService.initialize(target, true);
    }
  };

/**
 * 申請内容の変更／修正を取り消す（中断する）
 */
export const cancelEditing =
  (request: AttDailyRequest, maxRestTimesCount: number) =>
  (dispatch: AppDispatch) => {
    if (request.requestTypeCode === CODE.Pattern) {
      request.requestableDayType = request.requestDayType;
      request.canDirectInputTimeRequest = request.isDirectInputTimeRequest;
    }
    dispatch(initializeRequest(request, maxRestTimesCount));
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
    resultTargetPeriodEndDate: string,
    targetEmployeeId: string | null = null,
    userSetting: UserSetting,
    userPermission: Permission
  ) =>
  (dispatch) => {
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
            UseCases()
              .reloadTimesheetOnly({
                targetDate: resultTargetPeriodStartDate,
                employeeId: targetEmployeeId,
              })
              .then(({ timesheet }) => {
                const useViewTable = timesheet.workingTypeList?.some(
                  (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
                );
                if (useViewTable) {
                  UseCases().fetchDailyFieldLayoutTable({
                    employeeId: targetEmployeeId,
                    startDate: resultTargetPeriodStartDate,
                    endDate: resultTargetPeriodEndDate,
                  });
                }
                return timesheet;
              }),
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
    resultTargetPeriodEndDate: string,
    targetEmployeeId: string | null = null,
    userSetting: UserSetting,
    userPermission: Permission,
    maxRestTimesCount: number
  ) =>
  (
    dispatch
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
                  resultTargetPeriodEndDate,
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
                requests[requestId],
                timesheet
              );
              dispatch(showRequestDetailPane($request, maxRestTimesCount));
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
        const message = msg().Appr_Msg_RequestConfirmRemove;
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
