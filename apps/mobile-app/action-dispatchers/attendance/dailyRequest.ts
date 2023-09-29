import { bindActionCreators, Dispatch } from 'redux';

import isNil from 'lodash/isNil';

import { getUserSetting } from '../../../commons/actions/userSetting';
import msg from '../../../commons/languages';
import { showToast } from '../../../commons/modules/toast';
import { showAlert } from '../../modules/commons/alert';
import { showConfirm } from '../../modules/commons/confirm';
import { catchApiError, catchBusinessError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import AttDailyLeaveRepository from '../../../repositories/attendance/AttDailyLeaveRepository';
import AttDailyPatternRepository from '../../../repositories/attendance/AttDailyPatternRepository';
import Repository from '../../../repositories/attendance/AttDailyRequestRepository';
import TimesheetRepository from '@apps/repositories/attendance/TimesheetRepository';

import { AttDailyRecord } from '../../../domain/models/attendance/AttDailyRecord';
import {
  AttDailyRequest,
  DISABLE_ACTION,
  EDIT_ACTION,
  isForReapply,
} from '../../../domain/models/attendance/AttDailyRequest';
import * as EarlyLeaveRequest from '../../../domain/models/attendance/AttDailyRequest/EarlyLeaveRequest';
import * as LateArrivalRequest from '../../../domain/models/attendance/AttDailyRequest/LateArrivalRequest';
import * as LeaveRequest from '../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import * as PatternRequest from '../../../domain/models/attendance/AttDailyRequest/PatternRequest';
import { CODE } from '../../../domain/models/attendance/AttDailyRequestType';
import { doesAttLeaveExist } from '../../../domain/models/attendance/LeaveType';
import {
  getAttDailyRecordByDate,
  isTargetDateInTimesheet,
  Timesheet,
} from '../../../domain/models/attendance/Timesheet';

import { actions as EntitiesAvailableRequestsActions } from '../../modules/attendance/dailyRequest/entities/availableRequests';
import { actions as EntitiesLatestRequestsActions } from '../../modules/attendance/dailyRequest/entities/latestRequests';
import { actions } from '../../modules/attendance/dailyRequest/ui/detail';
import { actions as earlyLeaveRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/earlyLeaveRequest';
import { actions as lateArrivalRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/lateArrivalRequest';
import { actions as leaveRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/leaveRequest';
import { actions as patternRequestActions } from '../../modules/attendance/dailyRequest/ui/requests/patternRequest';
import { actions as ValidationActions } from '../../modules/attendance/dailyRequest/ui/validation';
import {
  actions as TimesheetEntitiesActions,
  State as TimesheetState,
} from '../../modules/attendance/timesheet/entities';
import { actions as TimesheetDailyUiPagingActions } from '../../modules/attendance/timesheet/ui/daily/paging';

import { loadTimesheet } from './timesheet';

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
  (target: AttDailyRequest, record?: AttDailyRecord | null) =>
  async (dispatch: Dispatch<any>) => {
    dispatch(ValidationActions.clear());
    switch (target.requestTypeCode) {
      case CODE.Leave:
        try {
          await dispatch(
            withLoading(async () => {
              const attLeaveList = await AttDailyLeaveRepository.search({
                targetDate: target.startDate,
                ignoredId: target.id,
              });

              if (attLeaveList.length === 0) {
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

              if (isForReapply(target)) {
                if (doesAttLeaveExist(attLeaveList, target)) {
                  const leave = LeaveRequest.create(target, attLeaveList);
                  dispatch(leaveRequestActions.initialize(leave, attLeaveList));
                } else {
                  const leave = LeaveRequest.create(target);
                  dispatch(leaveRequestActions.initialize(leave));
                }
              } else {
                const leave = LeaveRequest.create(target, attLeaveList);
                dispatch(leaveRequestActions.initialize(leave, attLeaveList));
              }
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
              const attPatternList = await AttDailyPatternRepository.search({
                targetDate: target.startDate,
                ignoredId: target.id,
              });

              if (attPatternList.length === 0) {
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
                attPatternList,
                target.startDate
              );
              dispatch(
                patternRequestActions.initialize(pattern, attPatternList)
              );
              dispatch(actions.startEditing());
            })
          );
        } catch (e) {
          dispatch(catchApiError(e));
        }

        break;
      case CODE.LateArrival:
        const lateArrival = LateArrivalRequest.create(
          target,
          record,
          target.startDate
        );
        dispatch(lateArrivalRequestActions.initialize(lateArrival, record));
        dispatch(actions.startEditing());
        break;
      case CODE.EarlyLeave:
        const earlyLeave = EarlyLeaveRequest.create(
          target,
          record,
          target.startDate
        );
        dispatch(earlyLeaveRequestActions.initialize(earlyLeave, record));
        dispatch(actions.startEditing());
        break;
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
    if (!(await dispatch(showConfirm(msg().Att_Msg_DailyReqConfirmRemove)))) {
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
