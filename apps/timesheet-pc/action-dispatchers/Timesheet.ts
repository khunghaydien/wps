import { initDailyStampTime } from '../../commons/action-dispatchers/StampWidget';
import {
  catchApiError,
  catchBusinessError,
  withLoading,
} from '../../commons/actions/app';
import msg from '../../commons/languages';
import { actions as proxyEmployeeInfoActions } from '../../commons/modules/proxyEmployeeInfo';
import UrlUtil from '../../commons/utils/UrlUtil';

import TimesheetRepository from '../../repositories/attendance/TimesheetRepository';

import {
  isAvailableTimeTrack,
  Permission,
} from '../../domain/models/access-control/Permission';
import { Code as RequestTypeCode } from '../../domain/models/attendance/AttDailyRequestType';
import { TimesheetFromRemote } from '../../domain/models/attendance/Timesheet';
import { UserSetting } from '../../domain/models/UserSetting';

import { actions as selectedPeriodUiActions } from '../modules/client/selectedPeriodStartDate';
import { actions as entitiesActions } from '../modules/entities/timesheet';

import { AppDispatch } from './AppThunk';
import { loadDailyTimeTrackRecords } from './DailyTimeTrack';
import { loadTimeTrackAlerts } from './TimeTrackAlert';

/**
 * 指定された集計期間の勤務表を取得して表示する
 * @param {String} [targetDate=null] YYYY-MM-DD 対象の集計期間に含まれる日付
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const fetchTimesheet =
  (targetDate: null | string = null, targetEmployeeId: null | string = null) =>
  async (dispatch: AppDispatch): Promise<TimesheetFromRemote> => {
    const timesheet = await TimesheetRepository.fetchRaw(
      targetDate,
      targetEmployeeId
    );
    dispatch(entitiesActions.setTimesheetItems(timesheet, targetEmployeeId));
    return timesheet;
  };

/**
 * 指定された集計期間の勤務表と利用可能な申請を取得して表示する
 * @param {String} [targetDate=null] YYYY-MM-DD 対象の集計期間に含まれる日付
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const fetchTimesheetAndAvailableDailyRequest =
  (targetDate: null | string = null, targetEmployeeId: null | string = null) =>
  async (
    dispatch: AppDispatch
  ): Promise<[TimesheetFromRemote, { [id: string]: RequestTypeCode[] }]> => {
    const [timesheet, { availableRequestTypeCodesMap }] = await Promise.all([
      TimesheetRepository.fetchRaw(targetDate, targetEmployeeId),
      TimesheetRepository.fetchAvailableDailyRequest(
        targetDate,
        targetEmployeeId
      ),
    ]);
    dispatch(entitiesActions.setTimesheetItems(timesheet, targetEmployeeId));
    dispatch(entitiesActions.setRequestTypeCodes(availableRequestTypeCodesMap));
    return [timesheet, availableRequestTypeCodesMap];
  };

/**
 * @param {String} periodStartDate The start date of target month
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const openLeaveWindow =
  (periodStartDate: string, targetEmployeeId: null | string = null) =>
  () => {
    const param = targetEmployeeId
      ? {
          targetDate: periodStartDate,
          targetEmployeeId,
        }
      : {
          targetDate: periodStartDate,
        };
    UrlUtil.openApp('timesheet-pc-leave', param);
  };

/**
 * @param {String} periodStartDate The start date of target month
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const openSummaryWindow =
  (periodStartDate: string, targetEmployeeId: null | string = null) =>
  () => {
    const param = targetEmployeeId
      ? {
          targetDate: periodStartDate,
          targetEmployeeId,
        }
      : {
          targetDate: periodStartDate,
        };
    UrlUtil.openApp('timesheet-pc-summary', param);
  };

/**
 * 月度切替時に実行される
 * - 勤務表読込
 * - 月度選択フィールド再セット
 * - 工数情報読込
 */
export const onPeriodSelected =
  (
    targetDate: null | string = null,
    targetEmployeeId: null | string = null,
    userPermission: Permission,
    userSetting: UserSetting,
    isDelegated = false
  ) =>
  async (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(async (): Promise<void> => {
        try {
          const timesheet: TimesheetFromRemote =
            await TimesheetRepository.fetchRaw(targetDate, targetEmployeeId);

          if (timesheet.isMigratedSummary) {
            dispatch(
              catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_CanNotDisplayBeforeUsing,
                null,
                {
                  isContinuable: true,
                }
              )
            );
            return;
          }

          dispatch(
            entitiesActions.setTimesheetItems(timesheet, targetEmployeeId)
          );
          dispatch(selectedPeriodUiActions.set(timesheet.startDate));
          if (isAvailableTimeTrack(userPermission, userSetting, isDelegated)) {
            const empId = targetEmployeeId || undefined;
            // Don't await loading time-tracking APIs
            Promise.all([
              dispatch(loadTimeTrackAlerts(timesheet, empId)),
              dispatch(loadDailyTimeTrackRecords(timesheet, empId)),
            ]);
          }
        } catch (e) {
          dispatch(catchApiError(e, { isContinuable: true }));
        }
      })
    );
  };

/**
 * 代理表示モード解除時に実行される
 * - 代理表示モード表示を解除
 * - 勤務表(本人)再読込
 * - 打刻情報初期化
 * - 工数情報(本人)再読込
 */
export const onExitProxyMode =
  (
    selectedPeriodStartDate: string,
    userPermission: Permission,
    userSetting: UserSetting
  ) =>
  async (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(async (): Promise<void> => {
        try {
          dispatch(proxyEmployeeInfoActions.unset());
          const [timesheet] = await Promise.all([
            dispatch(fetchTimesheet(selectedPeriodStartDate)),
            dispatch(initDailyStampTime()),
          ]);

          if (timesheet.isMigratedSummary) {
            dispatch(
              catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_CanNotDisplayBeforeUsing,
                null,
                {
                  isContinuable: false,
                }
              )
            );
            return;
          }

          dispatch(selectedPeriodUiActions.set(timesheet.startDate));
          if (isAvailableTimeTrack(userPermission, userSetting, false)) {
            // Don't await loading time-tracking APIs
            Promise.all([
              dispatch(loadTimeTrackAlerts(timesheet)),
              dispatch(loadDailyTimeTrackRecords(timesheet)),
            ]);
          }
        } catch (e) {
          dispatch(catchApiError(e, { isContinuable: true }));
        }
      })
    );
  };
