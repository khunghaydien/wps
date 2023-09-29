import isNil from 'lodash/isNil';

import { initDailyStampTime } from '../../commons/action-dispatchers/StampWidget';
import {
  catchApiError,
  catchBusinessError,
  withLoading,
} from '../../commons/actions/app';
import { getUserSetting } from '../../commons/actions/userSetting';
import msg from '../../commons/languages';
import { setUserPermission } from '../../commons/modules/accessControl/permission';
import { actions as proxyEmployeeInfoActions } from '../../commons/modules/proxyEmployeeInfo';
import { actions as standaloneModeActions } from '../../commons/modules/standaloneMode';
import UrlUtil from '../../commons/utils/UrlUtil';

import EmployeeRepository from '../../repositories/EmployeeRepository';

import {
  isAvailableTimeTrack,
  Permission,
} from '../../domain/models/access-control/Permission';
import { TimesheetFromRemote } from '../../domain/models/attendance/Timesheet';
import { UserSetting } from '../../domain/models/UserSetting';

import { actions as selectedPeriodUiActions } from '../modules/client/selectedPeriodStartDate';

import { AppDispatch } from './AppThunk';
import { loadDailyTimeTrackRecords } from './DailyTimeTrack';
import {
  fetchTimesheet,
  fetchTimesheetAndAvailableDailyRequest,
} from './Timesheet';
import { loadTimeTrackAlerts } from './TimeTrackAlert';

/**
 * 勤務表画面を初期化する
 */
export const initialize =
  (param: { userPermission: Permission }) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const urlQuery = UrlUtil.getUrlQuery();
    const empId = urlQuery && urlQuery.empId;
    const targetDate = urlQuery && urlQuery.targetDate;
    const standalone = (urlQuery && urlQuery.standalone) === '1';
    const isProxy = !isNil(empId);
    if (isProxy && isNil(targetDate)) {
      dispatch(
        catchBusinessError(
          msg().Com_Err_ErrorTitle,
          msg().Com_Err_ProxyPermissionErrorBody,
          msg().Com_Err_ProxyPermissionErrorSolution,
          { isContinuable: false }
        )
      );
    }
    if (standalone) {
      dispatch(standaloneModeActions.enable());
    }

    if (param) {
      dispatch(setUserPermission(param.userPermission));
    }

    dispatch(
      withLoading(async (): Promise<void> => {
        try {
          // @ts-ignore
          // Cast (void | UserSetting) to UserSetting
          const [userSetting, timesheet, _]: [
            UserSetting,
            TimesheetFromRemote,
            void
          ] = await Promise.all([
            dispatch(getUserSetting()),
            dispatch(fetchTimesheet(targetDate, empId)),
            dispatch(async () => {
              if (!isProxy) {
                await dispatch(initDailyStampTime());
              }
            }),
          ]);

          const isSuccess = !isNil(timesheet);

          if (!isSuccess) {
            return;
          }

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

          const isCurrentEmployee =
            isNil(empId) || userSetting.employeeId === empId;

          if (!isCurrentEmployee) {
            const [targetEmployee] = await EmployeeRepository.search({
              id: empId || undefined,
              targetDate: targetDate || undefined,
            });
            dispatch(
              proxyEmployeeInfoActions.set({
                id: targetEmployee.id,
                employeeCode: targetEmployee.code,
                employeeName: targetEmployee.name,
                employeePhotoUrl: targetEmployee.user.photoUrl,
                departmentCode: '', // Not used?
                departmentName: targetEmployee.department
                  ? targetEmployee.department.name
                  : '',
                title: targetEmployee.title,
                managerName: targetEmployee.manager
                  ? targetEmployee.manager.name
                  : '',
              })
            );
          }

          if (
            isAvailableTimeTrack(
              param.userPermission,
              userSetting,
              !isCurrentEmployee
            )
          ) {
            const employeeId = empId || undefined;
            // Don't await loading time-tracking APIs
            Promise.all([
              dispatch(loadTimeTrackAlerts(timesheet, employeeId)),
              dispatch(loadDailyTimeTrackRecords(timesheet, employeeId)),
            ]);
          }
        } catch (e) {
          dispatch(catchApiError(e, { isContinuable: false }));
        }
      })
    );
  };

/**
 * @param {String} targetDate the target date
 * @param {Object} targetEmployee the target employee
 */
export const switchProxyEmployee =
  (
    targetDate: string,
    targetEmployee: { id: string },
    userPermission: Permission,
    userSetting: UserSetting
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      await dispatch(
        withLoading(async (): Promise<void> => {
          const timesheet: TimesheetFromRemote = await dispatch(
            fetchTimesheet(targetDate, targetEmployee.id)
          );

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

          if (isAvailableTimeTrack(userPermission, userSetting, true)) {
            // Don't await loading time-tracking APIs
            Promise.all([
              dispatch(loadTimeTrackAlerts(timesheet, targetEmployee.id)),
              dispatch(loadDailyTimeTrackRecords(timesheet, targetEmployee.id)),
            ]);
          }
          dispatch(proxyEmployeeInfoActions.set(targetEmployee));
        })
      );
      return true;
    } catch (e) {
      dispatch(
        catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Com_Err_ProxyPermissionErrorBody,
          msg().Com_Err_ProxyPermissionErrorSolution,
          { isContinuable: true }
        )
      );
      return false;
    }
  };

/**
 * 承認者を変更した後に実行する
 */
export const onChangeApproverEmployee =
  (targetDate: string | null | undefined = null) =>
  async (dispatch: AppDispatch) =>
    dispatch(
      withLoading(async () => {
        await dispatch(fetchTimesheetAndAvailableDailyRequest(targetDate));
      })
    );

/**
 * 打刻した後に呼び出す一連のアクション
 * ※自分の勤務表を表示している状態で実行することを前提にしている
 * 1. 以下を並列実行
 *    a. 勤務表を初期化する(打刻前にどの月度を表示していても、今日時点の勤務表を表示する)
 *    b. 打刻ウィジェットを初期化する
 * 2. 工数設定が有効なら、工数レコードを初期化する
 */
export const onStampSuccess =
  (userPermission: Permission, userSetting: UserSetting) =>
  async (dispatch: AppDispatch) => {
    await dispatch(
      withLoading(async () => {
        try {
          const [timesheet]: [TimesheetFromRemote] = await Promise.all([
            dispatch(fetchTimesheet()),
          ]);

          // 月度切替が発生しうるので、月度セレクトボックスの値を再セット
          dispatch(selectedPeriodUiActions.set(timesheet.startDate));

          if (isAvailableTimeTrack(userPermission, userSetting)) {
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

export default initialize;
