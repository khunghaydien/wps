import { bindActionCreators } from 'redux';

import isNil from 'lodash/isNil';

import { initDailyStampTime } from '../../commons/action-dispatchers/StampWidget';
import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import { UpdateResult as AttDailyTimeUpdateResult } from '../../repositories/attendance/AttDailyTimeRepository';

import {
  isAvailableTimeTrack,
  Permission,
} from '../../domain/models/access-control/Permission';
import {
  convertToPostRequestParam,
  createFromParam,
  DailyAttTime as DailyAttTimeModel,
} from '../../domain/models/attendance/DailyAttTime';
import { TimesheetFromRemote } from '../../domain/models/attendance/Timesheet';
import { UserSetting } from '../../domain/models/UserSetting';
import AttRecord from '../models/AttRecord';

import { actions as editingDailyAttTimeActions } from '../modules/ui/editingDailyAttTime';

import { AppDispatch } from './AppThunk';
import * as DailyAttTimeResultActions from './DailyAttTimeResult';
import { loadDailyTimeTrackRecords } from './DailyTimeTrack';
import { fetchTimesheet } from './Timesheet';
import { loadTimeTrackAlerts } from './TimeTrackAlert';

/**
 * 日次の勤務時刻ダイアログを表示する
 * @param {AttRecord} attRecord
 */
export const showDialog = (attRecord: AttRecord) => (dispatch: AppDispatch) => {
  const dailyAttTime = createFromParam(attRecord);
  dispatch(editingDailyAttTimeActions.set(dailyAttTime));
};

/**
 * 日次の勤務時刻ダイアログを閉じる
 */
export const hideDialog = editingDailyAttTimeActions.unset;

/**
 * 日次の勤務時刻を保存する
 * @param {DailyAttTime} dailyAttTime
 * @param {String} resultTargetPeriodStartDate 成功時に再取得・表示する対象となる集計期間の起算日
 * @param {?String} [targetEmployeeId=null] The ID of target employee
 */
export const save =
  (
    dailyAttTime: DailyAttTimeModel,
    resultTargetPeriodStartDate: string,
    targetEmployeeId: null | string = null,
    userPermission: Permission,
    userSetting: UserSetting
  ) =>
  async (dispatch: AppDispatch) => {
    const AppService = bindActionCreators(
      { loadingStart, loadingEnd, catchApiError },
      dispatch
    );

    const req = {
      path: '/att/daily-time/save',
      param: convertToPostRequestParam(dailyAttTime, targetEmployeeId),
    };

    const isProxy: boolean =
      !!targetEmployeeId && targetEmployeeId !== userSetting.employeeId;

    try {
      AppService.loadingStart();
      const result: AttDailyTimeUpdateResult = await Api.invoke(req);
      AppService.loadingEnd();

      await dispatch(
        DailyAttTimeResultActions.confirmToComplementInsufficientingRestTime(
          dailyAttTime.recordDate,
          targetEmployeeId,
          result
        )
      );

      AppService.loadingStart();
      dispatch(editingDailyAttTimeActions.unset());

      const [timesheet, _]: [TimesheetFromRemote, void] = await Promise.all([
        dispatch(fetchTimesheet(resultTargetPeriodStartDate, targetEmployeeId)),
        dispatch(async () => {
          if (!isProxy) {
            await dispatch(initDailyStampTime());
          }
        }),
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
          dispatch(
            loadDailyTimeTrackRecords(timesheet, targetEmployeeId || undefined)
          ),
        ]);
      }
      AppService.loadingEnd();
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      AppService.loadingEnd();
    }
  };
