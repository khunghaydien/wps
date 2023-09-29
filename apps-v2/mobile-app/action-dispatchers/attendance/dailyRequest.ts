import { bindActionCreators, Dispatch } from 'redux';

import isNil from 'lodash/isNil';

import { getUserSetting } from '../../../commons/actions/userSetting';
import msg from '../../../commons/languages';
import { showToast } from '../../../commons/modules/toast';
import TextUtil from '../../../commons/utils/TextUtil';
import { showAlert } from '../../modules/commons/alert';
import { showConfirm } from '../../modules/commons/confirm';
import { catchApiError, catchBusinessError } from '../../modules/commons/error';
import {
  endLoading,
  startLoading,
  withLoading,
} from '../../modules/commons/loading';

import Repository from '@attendance/repositories/AttDailyRequestRepository';
import AttPatternRepository from '@attendance/repositories/AttPatternRepository';
import EarlyLeaveReasonRepository from '@attendance/repositories/EarlyLeaveReasonRepository';
import LateArrivalReasonRepository from '@attendance/repositories/LateArrivalReasonRepository';
import AttDailyLeaveRepository from '@attendance/repositories/LeaveRepository';
import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

import {
  AttDailyRecord,
  DAY_TYPE,
} from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest,
  DISABLE_ACTION,
  EDIT_ACTION,
} from '@attendance/domain/models/AttDailyRequest';
import * as EarlyLeaveRequest from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import { HolidayWorkRequest } from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import * as LateArrivalRequest from '@attendance/domain/models/AttDailyRequest/LateArrivalRequest';
import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';
import * as PatternRequest from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import * as AttPattern from '@attendance/domain/models/AttPattern';
import {
  getAttDailyRecordByDate,
  isTargetDateInTimesheet,
  Timesheet,
} from '@attendance/domain/models/Timesheet';
import {
  WORK_SYSTEM_TYPE,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

import { actions as EntitiesAvailableRequestsActions } from '../../modules/attendance/dailyRequest/entities/availableRequests';
import { actions as EntitiesLatestRequestsActions } from '../../modules/attendance/dailyRequest/entities/latestRequests';
import { actions } from '../../modules/attendance/dailyRequest/ui/detail';
import { actions as earlyLeaveRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/earlyLeaveRequest';
import { actions as holidayWorkRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/holidayWorkRequest';
import { actions as lateArrivalRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/lateArrivalRequest';
import { actions as leaveRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/leaveRequest';
import { actions as patternRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/patternRequest';
import { actions as ValidationActions } from '../../modules/attendance/dailyRequest/ui/validation';
import {
  actions as TimesheetEntitiesActions,
  State as TimesheetState,
} from '../../modules/attendance/timesheet/entities';
import { actions as TimesheetDailyUiPagingActions } from '../../modules/attendance/timesheet/ui/daily/paging';
import { actions as EntitiesApprovalHistoriesActions } from '@mobile/modules/attendance/dailyRequest/entities/approvalHistories';

import { loadTimesheet } from './timesheet';
import createHolidayWorkRequestFactory from '@attendance/domain/factories/dailyRequest/HolidayWorkRequestFactory/ForEditing';
import createLeaveRequestFactory from '@attendance/domain/factories/dailyRequest/LeaveRequestFactory/ForEditing';
import holidayWorkRequestPatternName from '@attendance/ui/helpers/dailyRequest/holidayWorkRequest/patternName';

const HolidayWorkRequestFactory = createHolidayWorkRequestFactory({
  AttPatternRepository,
});

const LeaveRequestFactory = createLeaveRequestFactory({
  LeaveRepository: AttDailyLeaveRepository,
});

const loadAvailableDailyRequest =
  (attDailyRecord: AttDailyRecord, timesheet: Timesheet) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const { availableRequestTypeCodesMap } =
      await TimesheetRepository.fetchAvailableDailyRequest(
        attDailyRecord.recordDate
      );
    dispatch(
      EntitiesAvailableRequestsActions.initialize(
        attDailyRecord.id,
        availableRequestTypeCodesMap,
        timesheet
      )
    );
  };

const setDailyRequest =
  (targetDate: string, timesheet: Timesheet) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const attDailyRecord = getAttDailyRecordByDate(targetDate, timesheet);
    dispatch(TimesheetDailyUiPagingActions.fetchSuccess(targetDate, timesheet));
    dispatch(TimesheetEntitiesActions.fetchSuccess(timesheet));
    if (attDailyRecord) {
      dispatch(
        EntitiesLatestRequestsActions.initialize(attDailyRecord, timesheet)
      );
      await dispatch(loadAvailableDailyRequest(attDailyRecord, timesheet));
    } else {
      dispatch(EntitiesLatestRequestsActions.clear());
      dispatch(EntitiesAvailableRequestsActions.clear());
    }
  };

const resetDailyRequest =
  (targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<Timesheet | null> => {
    try {
      const timesheet = await loadTimesheet(targetDate);
      await dispatch(setDailyRequest(targetDate, timesheet));
      return timesheet;
    } catch (e) {
      dispatch(
        catchApiError(e, {
          isContinuable: true,
        })
      );
      dispatch(TimesheetDailyUiPagingActions.setCurrent(targetDate));
    }
    return null;
  };

const initializeDailyRequest =
  (targetDate: string, timesheet?: TimesheetState) =>
  async (dispatch: Dispatch<any>) => {
    if (!isNil(timesheet) && isTargetDateInTimesheet(timesheet, targetDate)) {
      await dispatch(setDailyRequest(targetDate, timesheet));
      return timesheet;
    } else {
      return await dispatch(resetDailyRequest(targetDate));
    }
  };

export const initialize =
  (targetDate: string, timesheet?: TimesheetState) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(ValidationActions.clear());
    dispatch(TimesheetDailyUiPagingActions.clear());
    dispatch(TimesheetEntitiesActions.clear());
    dispatch(EntitiesLatestRequestsActions.clear());
    dispatch(EntitiesAvailableRequestsActions.clear());
    dispatch(EntitiesApprovalHistoriesActions.initialize([]));
    // @ts-ignore
    const [_, $timesheet] = await dispatch(
      withLoading(
        // @ts-ignore
        () => dispatch(getUserSetting()),
        () => dispatch(initializeDailyRequest(targetDate, timesheet))
      )
    );
    if ($timesheet && $timesheet.isMigratedSummary) {
      dispatch(showAlert(msg().Att_Err_CanNotDisplayBeforeUsing));
    }
  };

export const startEditing =
  (
    target: AttDailyRequest,
    record?: AttDailyRecord | null,
    workingType?: WorkingType | null,
    targetDate?: string
  ) =>
  async (dispatch: Dispatch<any>) => {
    dispatch(ValidationActions.clear());
    if (target.requestTypeCode === CODE.Pattern) {
      target.requestableDayType = target.requestDayType;
      target.canDirectInputTimeRequest = target.isDirectInputTimeRequest;
    }
    switch (target.requestTypeCode) {
      case CODE.Leave:
        try {
          await dispatch(
            withLoading(async () => {
              const leave = await LeaveRequestFactory({
                targetDate: target.startDate,
                ignoredId: target.id,
              }).create(target as LeaveRequest.LeaveRequest);

              if (leave.leaves.size === 0) {
                dispatch(
                  catchBusinessError(
                    msg().Com_Lbl_Error,
                    msg().Att_Err_CannotEditIfAttLeaveListLengthIsZero,
                    null,
                    { isContinuable: true }
                  )
                );
                return;
              }
              dispatch(leaveRequestActions.initialize(leave));
              dispatch(actions.startEditing());
            })
          );
        } catch (e) {
          dispatch(catchApiError(e));
        }

        break;
      case CODE.Pattern:
        try {
          await dispatch(
            withLoading(async () => {
              const attPatternList = await AttPatternRepository.fetch({
                targetDate,
                ignoredId: target.id,
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
                  target
                );

                attPatternList.patterns.push(directInputInfo);
              }

              if (
                record.dayType === DAY_TYPE.Workday &&
                attPatternList.requestableDayType === DAY_TYPE.Workday
              ) {
                catchBusinessError(
                  msg().Com_Lbl_Error,
                  TextUtil.template(
                    msg().Att_Err_NotAvailableDayType,
                    targetDate,
                    msg().Att_Lbl_WorkDay
                  ),
                  null,
                  { isContinuable: true }
                );
                return;
              }

              if (
                record.dayType === DAY_TYPE.Holiday &&
                attPatternList.requestableDayType === DAY_TYPE.Holiday
              ) {
                catchBusinessError(
                  msg().Com_Lbl_Error,
                  TextUtil.template(
                    msg().Att_Err_NotAvailableDayType,
                    targetDate,
                    msg().Att_Lbl_Holiday
                  ),
                  null,
                  { isContinuable: true }
                );
                return;
              }

              if (
                attPatternList.patterns.length === 0 &&
                attPatternList.requestableDayType === null
              ) {
                dispatch(
                  catchBusinessError(
                    msg().Com_Lbl_Error,
                    msg().Att_Err_CannotEditIfAttPatternListLengthIsZero,
                    null,
                    { isContinuable: true }
                  )
                );
                return;
              }

              const pattern = PatternRequest.create(
                target,
                attPatternList.patterns,
                target.startDate,
                attPatternList.requestableDayType,
                attPatternList.canDirectInputTimeRequest
              );
              dispatch(
                patternRequestActions.initialize(
                  pattern,
                  attPatternList.patterns
                )
              );
              dispatch(actions.startEditing());
            })
          );
        } catch (e) {
          dispatch(catchApiError(e));
        }

        break;
      case CODE.LateArrival:
        try {
          await dispatch(
            withLoading(async () => {
              const lateArrivalReasonList =
                await LateArrivalReasonRepository.fetchList({
                  targetDate: target.startDate,
                });
              const lateArrival = LateArrivalRequest.create(
                target,
                record,
                target.startDate,
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
                  lateArrival,
                  record,
                  lateArrivalReasonList
                )
              );
              dispatch(actions.startEditing());
            })
          );
        } catch (e) {
          dispatch(catchApiError(e));
        }
        break;
      case CODE.EarlyLeave:
        try {
          await dispatch(
            withLoading(async () => {
              const earlyLeaveReasonList =
                await EarlyLeaveReasonRepository.fetchList({
                  targetDate: target.startDate,
                });
              const earlyLeave = EarlyLeaveRequest.create(
                target,
                target.startDate
              );
              dispatch(
                earlyLeaveRequestActions.setUpForEditing(
                  earlyLeave,
                  record,
                  earlyLeaveReasonList,
                  workingType.useEarlyLeaveReason
                )
              );
              dispatch(actions.startEditing());
            })
          );
        } catch (e) {
          dispatch(catchApiError(e));
        }
        break;
      case CODE.HolidayWork: {
        const loading = dispatch(startLoading()) as unknown as string;
        try {
          const result = await HolidayWorkRequestFactory({
            dayType: record.dayType,
            workingType,
            patternName: holidayWorkRequestPatternName,
            ignoredId: target.id,
          }).create(target as HolidayWorkRequest);
          dispatch(holidayWorkRequestActions.initialize(result));
          dispatch(actions.startEditing());
        } catch (e) {
          dispatch(catchApiError(e));
        } finally {
          dispatch(endLoading(loading));
        }
        break;
      }
      default:
        dispatch(actions.startEditing());
        break;
    }
  };

const validate = (target: AttDailyRequest) => (dispatch: Dispatch<any>) =>
  dispatch(ValidationActions.validate(target));

export const create =
  (target: AttDailyRequest, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const appService = bindActionCreators(
      {
        withLoading,
        catchApiError,
      },
      dispatch
    );
    const dailyRequestService = bindActionCreators(
      { initializeDailyRequest, validate },
      dispatch
    );

    const isValid = await dailyRequestService.validate(target);
    if (!isValid) {
      return false;
    }

    try {
      await appService.withLoading(async () => {
        // submit
        await Repository.create(target);
        await dailyRequestService.initializeDailyRequest(targetDate);
      });
      dispatch(showToast(msg().Att_Lbl_Requested));
      return true;
    } catch (err) {
      appService.catchApiError(err, { isContinuable: true });
      return false;
    }
  };

export const modify =
  (target: AttDailyRequest, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const appService = bindActionCreators(
      {
        withLoading,
        catchApiError,
      },
      dispatch
    );
    const dailyRequestService = bindActionCreators(
      { initializeDailyRequest, validate },
      dispatch
    );

    const isValid = await dailyRequestService.validate(target);
    if (!isValid) {
      return false;
    }

    try {
      await appService.withLoading(async () => {
        // submit
        await Repository.update(target, EDIT_ACTION.Modify);
        await dailyRequestService.initializeDailyRequest(targetDate);
      });
      dispatch(showToast(msg().Att_Lbl_Requested));
      return true;
    } catch (err) {
      appService.catchApiError(err, { isContinuable: true });
      return false;
    }
  };

export const reapply =
  (target: AttDailyRequest, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const appService = bindActionCreators(
      {
        withLoading,
        catchApiError,
      },
      dispatch
    );
    const dailyRequestService = bindActionCreators(
      { initializeDailyRequest, validate },
      dispatch
    );

    const isValid = await dailyRequestService.validate(target);
    if (!isValid) {
      return false;
    }
    try {
      await appService.withLoading(async () => {
        await Repository.update(target, EDIT_ACTION.Reapply);
        await dailyRequestService.initializeDailyRequest(targetDate);
      });
      dispatch(showToast(msg().Att_Lbl_Requested));
      return true;
    } catch (err) {
      appService.catchApiError(err, { isContinuable: true });
      return false;
    }
  };

export const cancelRequest =
  (id: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    try {
      await dispatch(
        withLoading(async () => {
          await Repository.delete(id, DISABLE_ACTION.CancelRequest);
          await dispatch(initializeDailyRequest(targetDate));
        })
      );
      dispatch(showToast(msg().Att_Lbl_CancelRequest));
      return true;
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
      return false;
    }
  };

export const cancelApproval =
  (id: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    try {
      await dispatch(
        withLoading(async () => {
          await Repository.delete(id, DISABLE_ACTION.CancelApproval);
          await dispatch(initializeDailyRequest(targetDate));
        })
      );
      dispatch(showToast(msg().Att_Lbl_CancelRequest));
      return true;
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
      return false;
    }
  };

export const remove =
  (id: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    if (!(await dispatch(showConfirm(msg().Appr_Msg_RequestConfirmRemove)))) {
      return false;
    }
    try {
      await dispatch(
        withLoading(async () => {
          await Repository.delete(id, DISABLE_ACTION.Remove);
          await dispatch(initializeDailyRequest(targetDate));
        })
      );
      dispatch(showToast(msg().Att_Lbl_RemoveRequest));
      return true;
    } catch (err) {
      dispatch(catchApiError(err, { isContinuable: true }));
      return false;
    }
  };
