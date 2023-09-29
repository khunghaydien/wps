import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';
import {
  endLoading,
  startLoading,
  withLoading,
} from '@mobile/modules/commons/loading';

import {
  Record,
  RecordCloneResponseType,
} from '@apps/domain/models/exp/Record';

import { actions as recordUpdatedInfoAction } from '@apps/mobile-app/modules/expense/ui/record/recordUpdatedInfo';
import { AppDispatch } from '@mobile/modules/expense/AppThunk';
import { actions as recordActions } from '@mobile/modules/expense/entities/recordList';

export const createRecord =
  (
    values: Record,
    reportId?: string,
    reportTypeId?: string,
    empId?: string,
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        recordActions.save(values, reportId, reportTypeId, empId, isRequest)
      )
    ).catch((err) => {
      throw err;
    });

export const createMultiRecords =
  (records: Record[], reportId?: string, reportTypeId?: string) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(recordActions.saveList(records, reportId, reportTypeId))
    ).catch((err) => {
      dispatch(showToast(err.message || err.event.message));
    });

export const deleteRecord =
  (recordId: string, isRequest?: boolean, isUseCashAdvance?: boolean) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(recordActions.delete(recordId, isRequest, isUseCashAdvance))
    ).catch((err) => {
      throw err;
    });

export const cloneRecord =
  (
    recordIds: Array<string>,
    numberOfDays?: number,
    targetDates?: Array<string>,
    empId?: string,
    isRequest?: boolean,
    isUseCashAdvance?: boolean
  ) =>
  (dispatch: AppDispatch): Promise<RecordCloneResponseType | void> => {
    const loadingId = dispatch(startLoading());
    return dispatch(
      recordActions.cloneRecord(
        recordIds,
        numberOfDays,
        targetDates,
        empId,
        isRequest,
        isUseCashAdvance
      )
    )
      .then((res: RecordCloneResponseType) => {
        if (res.updatedRecords.length > 0) {
          dispatch(recordUpdatedInfoAction.setUpdateInfo(res.updatedRecords));
        }
        dispatch(showToast(msg().Exp_Msg_CloneRecord));
        return res;
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatch(showToast(errMsg));
      })
      .finally(() => {
        dispatch(endLoading(loadingId));
      });
  };
