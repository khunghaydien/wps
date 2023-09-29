import { bindActionCreators } from 'redux';

import {
  catchApiError,
  catchBusinessError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '@apps/commons/languages';

import repository from '@apps/attendance/repositories/admin/index';

import { TempFractionGrantRecord } from '@apps/attendance/domain/models/admin/FractionGrant';

import { fetch as fetchAnnualLeaveGrantHistoryList } from '@apps/admin-pc/modules/annual-paid-leave-management/detail-pane/entities/grant-history-list';
import { actions } from '@apps/admin-pc/modules/fractionGrant/ui';
import { fetch as fetchManageLeaveGrantHistoryList } from '@apps/admin-pc/modules/managed-leave-management/detail-pane/entities/grant-history-list';

import { AppDispatch } from '../AppThunk';

interface FractionGrantService {
  setShowDialog: (isShow: boolean) => void;
  setShowSuccessMessage: (isShow: boolean) => void;
  update: (
    arg0: keyof TempFractionGrantRecord,
    arg1: TempFractionGrantRecord[keyof TempFractionGrantRecord]
  ) => void;
  setEvent: (detailEvent: TempFractionGrantRecord) => void;
  createAnnualLeaveFractionRecord: (
    empId: string,
    grantId: string,
    updateRecord: TempFractionGrantRecord
  ) => void;
  flushAnnualLeaveHistory: (empId: string, targetDate: string) => void;
  createManageLeaveFractionRecord: (
    empId: string,
    grantId: string,
    updateRecord: TempFractionGrantRecord
  ) => void;
  flushManageLeaveHistory: (
    empId: string,
    targetDate: string,
    targetLeaveTypeId: string
  ) => void;
}

export const EventActions = (dispatch: AppDispatch): FractionGrantService => {
  const eventActions = bindActionCreators(actions, dispatch);
  return {
    setShowDialog: eventActions.setShowDialog,
    setShowSuccessMessage: eventActions.setShowSuccessMessage,
    update: eventActions.update,
    setEvent: eventActions.setTempEvent,
    createAnnualLeaveFractionRecord: async (
      empId: string,
      grantId: string,
      updateRecord: TempFractionGrantRecord
    ) => {
      try {
        dispatch(loadingStart());
        await repository.createAnnualLeaveAdjuset({
          ...updateRecord,
          employeeId: empId,
          grantId,
        });
        dispatch(loadingEnd());
        dispatch(actions.setShowDialog(false));
        dispatch(actions.setShowSuccessMessage(true));
      } catch (err) {
        dispatch(catchApiError(err, { isContinuable: true }));
      } finally {
        dispatch(loadingEnd());
      }
    },
    createManageLeaveFractionRecord: async (
      empId: string,
      grantId: string,
      updateRecord: TempFractionGrantRecord
    ) => {
      try {
        dispatch(loadingStart());
        await repository.createManageLeaveAdjuset({
          ...updateRecord,
          employeeId: empId,
          grantId,
        });
        dispatch(loadingEnd());
        dispatch(actions.setShowDialog(false));
        dispatch(actions.setShowSuccessMessage(true));
      } catch (err) {
        dispatch(catchApiError(err, { isContinuable: true }));
      } finally {
        dispatch(loadingEnd());
      }
    },
    flushAnnualLeaveHistory: (empId: string, targetDate: string) => {
      dispatch(loadingStart());
      dispatch(fetchAnnualLeaveGrantHistoryList(empId, targetDate));
      dispatch(loadingEnd());
    },
    flushManageLeaveHistory: (
      empId: string,
      targetDate: string,
      targetLeaveTypeId: string
    ) => {
      dispatch(loadingStart());
      dispatch(
        fetchManageLeaveGrantHistoryList(empId, targetLeaveTypeId, targetDate)
      );
      dispatch(loadingEnd());
    },
  };
};

export const getTartgetAnnualLeaveFractionRecord =
  (empId: string, grantId: string, targetRecord: TempFractionGrantRecord) =>
  async (dispatch: AppDispatch) => {
    const service = bindActionCreators(
      {
        loadingStart,
        loadingEnd,
        catchApiError,
        catchBusinessError,
      },
      dispatch
    );
    try {
      service.loadingStart();
      const targetFractionRecord = await repository.getAnnualLeaveAdjuset({
        employeeId: empId,
        grantId,
      });
      if (targetFractionRecord === null) {
        service.catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Att_Err_CannotOpenIfFractionGrantRecordIsNull,
          null,
          {
            isContinuable: true,
          }
        );
      }
      dispatch(
        actions.setDetailEvent({
          ...targetFractionRecord,
          validDateTo: targetRecord.validDateTo,
          comment: targetRecord.comment,
        })
      );
      dispatch(actions.setTargetGrantHistoryRecordId(grantId));
    } catch (err) {
      service.catchApiError(err, { isContinuable: true });
    } finally {
      service.loadingEnd();
    }
  };

export const getTartgetManageLeaveFractionRecord =
  (empId: string, grantId: string, targetRecord: TempFractionGrantRecord) =>
  async (dispatch: AppDispatch) => {
    const service = bindActionCreators(
      {
        loadingStart,
        loadingEnd,
        catchApiError,
        catchBusinessError,
      },
      dispatch
    );
    try {
      service.loadingStart();
      const targetFractionRecord = await repository.getManageLeaveAdjuset({
        employeeId: empId,
        grantId,
      });
      if (targetFractionRecord === null) {
        service.catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Att_Err_CannotOpenIfFractionGrantRecordIsNull,
          null,
          {
            isContinuable: true,
          }
        );
      }
      dispatch(
        actions.setDetailEvent({
          ...targetFractionRecord,
          validDateTo: targetRecord.validDateTo,
          comment: targetRecord.comment,
        })
      );
      dispatch(actions.setTargetGrantHistoryRecordId(grantId));
    } catch (err) {
      service.catchApiError(err, { isContinuable: true });
    } finally {
      service.loadingEnd();
    }
  };
