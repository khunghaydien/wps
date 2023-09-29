import isNil from 'lodash/isNil';

import {
  catchApiError,
  catchBusinessError,
  withLoading,
} from '@apps/commons/actions/app';
import { getUserSetting } from '@apps/commons/actions/userSetting';
import msg from '@apps/commons/languages';
import { setUserPermission } from '@apps/commons/modules/accessControl/permission';
import { actions as proxyEmployeeInfoActions } from '@apps/commons/modules/proxyEmployeeInfo';
import { actions as standaloneModeActions } from '@apps/commons/modules/standaloneMode';
import UrlUtil from '@apps/commons/utils/UrlUtil';

import EmployeeRepository from '@apps/repositories/EmployeeRepository';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

import UseCases from '../UseCases';
import { fetchTimesheetAndAvailableDailyRequest } from './Timesheet';
import { IOutputData as IFetchTimesheetOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import Events from '@attendance/timesheet-pc/events';

/**
 * 勤務表画面を初期化する
 */
export const initialize =
  (param: { userPermission: Permission }) =>
  async (dispatch): Promise<void> => {
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

    await dispatch(
      withLoading(async (): Promise<void> => {
        try {
          // @ts-ignore
          // Cast (void | UserSetting) to UserSetting
          const [userSetting, fetchedTimesheet, _]: [
            UserSetting,
            IFetchTimesheetOutputData,
            void
          ] = await Promise.all([
            dispatch(getUserSetting()),
            UseCases().fetchTimesheet({
              targetDate,
              employeeId: empId,
            }),
            dispatch(async () => {
              if (!isProxy) {
                await dispatch(initDailyStampTime());
              }
            }),
          ]);

          const { timesheet } = fetchedTimesheet;

          const isSuccess = !isNil(timesheet);

          if (!isSuccess) {
            return;
          }

          if (timesheet.isMigratedSummary) {
            return;
          }

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
          Events.initialized.publish({
            fetchedUserSetting: userSetting,
            fetchedTimesheet,
          });
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
  (targetDate: string, targetEmployee: { id: string }) =>
  async (dispatch): Promise<boolean> => {
    try {
      await dispatch(
        withLoading(async (): Promise<void> => {
          await UseCases().fetchTimesheet({
            targetDate,
            employeeId: targetEmployee.id,
          });
          dispatch(proxyEmployeeInfoActions.set(targetEmployee));
        })
      );
      return true;
    } catch (e) {
      if (e && e.errorCode === 'ATT_DAILY_IMPORT_REGISTERING') {
        dispatch(
          catchBusinessError(
            msg().Com_Lbl_Error,
            msg().Att_Msg_DailyImportProcessing,
            null,
            { isContinuable: true }
          )
        );
      } else {
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
    }
  };

/**
 * 承認者を変更した後に実行する
 * 将来的にEventService.publish() に置換する。
 */
export const onChangeApproverEmployee =
  (
    targetDate: string | null | undefined = null,
    endDate: string | null | undefined = null
  ) =>
  async (dispatch) =>
    dispatch(
      withLoading(async () => {
        await dispatch(
          fetchTimesheetAndAvailableDailyRequest(targetDate, endDate)
        );
      })
    );

/**
 * 打刻した後に呼び出す一連のアクション
 */
export const onStampSuccess = () => (_) => {
  Events.stampedTime.publish();
};

export default initialize;
