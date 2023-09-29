import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import AttDailyRemarksRepository from '../../repositories/attendance/AttDailyRemarksRepository';

import { DailyRemarks } from '../../domain/models/attendance/AttDailyRecord';
import AttRecord from '../models/AttRecord';

import { actions as editingDailyRemarksActions } from '../modules/ui/editingDailyRemarks';

import { AppDispatch } from './AppThunk';
import * as TimesheetActions from './Timesheet';

/**
 * 日次の備考ダイアログを表示する
 */
export const showDialog = (attRecord: AttRecord) => (dispatch: AppDispatch) => {
  dispatch(editingDailyRemarksActions.set(attRecord));
};

/**
 * 日次の備考ダイアログを閉じる
 */
export const hideDialog = editingDailyRemarksActions.unset;

/**
 * 日次の備考を保存する
 * @param {DailyRemarks} dailyRemarks
 * @param {String} resultTargetPeriodStartDate 成功時に再取得・表示する対象となる集計期間の起算日
 * @param {?String} [targetEmployeeId=null] The ID of target employee
 */
export const save =
  (
    dailyRemarks: DailyRemarks,
    resultTargetPeriodStartDate: string,
    targetEmployeeId: string = null
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(loadingStart());
      await AttDailyRemarksRepository.update(dailyRemarks);
      dispatch(editingDailyRemarksActions.unset());
      await dispatch(
        TimesheetActions.fetchTimesheet(
          resultTargetPeriodStartDate,
          targetEmployeeId
        )
      );
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };
