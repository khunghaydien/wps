import { catchApiError, withLoading } from '@apps/commons/actions/app';
import { actions as proxyEmployeeInfoActions } from '@apps/commons/modules/proxyEmployeeInfo';
import UrlUtil from '@apps/commons/utils/UrlUtil';

import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';
import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

import { Code as RequestTypeCode } from '@attendance/domain/models/AttDailyRequestType';

import { actions as entitiesActions } from '../modules/entities/timesheet';

import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

import UseCases from '../UseCases';
import { AppDispatch } from './AppThunk';

/**
 * 指定された集計期間の勤務表と利用可能な申請を取得して表示する
 * @param {String} [targetDate=null] YYYY-MM-DD 対象の集計期間に含まれる日付
 * @param {String} [targetEmployeeId=null] The ID of target employee
 */
export const fetchTimesheetAndAvailableDailyRequest =
  (
    targetDate: null | string = null,
    endDate: null | string = null,
    targetEmployeeId: null | string = null
  ) =>
  async (
    dispatch: AppDispatch
  ): Promise<[TimesheetFromRemote, { [id: string]: RequestTypeCode[] }]> => {
    const [timesheet, { availableRequestTypeCodesMap }] = await Promise.all([
      TimesheetRepository.fetchRaw(targetDate, targetEmployeeId).then(
        (timesheet) => {
          const useViewTable = timesheet.workingTypeList?.some(
            (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
          );
          if (useViewTable) {
            UseCases().fetchDailyFieldLayoutTable({
              employeeId: targetEmployeeId,
              startDate: targetDate,
              endDate,
            });
          }

          return timesheet;
        }
      ),
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
  (): void => {
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
  (): void => {
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
 * - 手当情報読込
 */
export const onPeriodSelected = (
  targetDate: null | string = null,
  targetEmployeeId: null | string = null
) =>
  UseCases().fetchTimesheet({
    targetDate,
    employeeId: targetEmployeeId,
  });

/**
 * 代理表示モード解除時に実行される
 * - 代理表示モード表示を解除
 * - 勤務表(本人)再読込
 * - 打刻情報初期化
 * - 工数情報(本人)再読込
 * - 手当情報(本人)再読込
 */
export const onExitProxyMode =
  (selectedPeriodStartDate: string) =>
  async (dispatch): Promise<void> => {
    return dispatch(
      withLoading(async (): Promise<void> => {
        try {
          dispatch(proxyEmployeeInfoActions.unset());
          await Promise.all([
            UseCases().fetchTimesheet({
              targetDate: selectedPeriodStartDate,
            }),
            dispatch(initDailyStampTime()),
          ]);
        } catch (e) {
          dispatch(catchApiError(e, { isContinuable: true }));
        }
      })
    );
  };
