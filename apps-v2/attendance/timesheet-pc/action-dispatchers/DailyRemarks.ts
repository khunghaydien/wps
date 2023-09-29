import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import DailyRecordRepository from '@attendance/repositories/DailyRecordRepository';

import AttRecord from '../models/AttRecord';
import { DailyRemarks } from '@attendance/domain/models/AttDailyRecord';

import { actions as editingDailyRemarksActions } from '../modules/ui/editingDailyRemarks';

import UseCases from '../UseCases';
import { AppDispatch } from './AppThunk';

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
      await DailyRecordRepository.saveRemarks(dailyRemarks);
      dispatch(editingDailyRemarksActions.unset());
      await UseCases().reloadTimesheetOnly({
        targetDate: resultTargetPeriodStartDate,
        employeeId: targetEmployeeId,
      });
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };
