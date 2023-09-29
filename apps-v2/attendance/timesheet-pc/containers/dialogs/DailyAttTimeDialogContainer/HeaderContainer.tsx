import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { createSelector } from 'reselect';

import * as approverEmployeeSettingActions from '@apps/commons/action-dispatchers/ApproverEmployeeSetting';
import { DIALOG_TYPE } from '@apps/commons/modules/approverEmployeeSearch/ui/dialog';

import AttRecord from '../../../models/AttRecord';
import { getPermissionTestConditionsForEdit } from '@attendance/domain/models/AttDailyRecord';
import { Status as DailyRequestStatus } from '@attendance/domain/models/AttDailyRequest';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import {
  ACTIONS_FOR_FIX,
  FixDailyRequest,
  getPermissionTestConditionsForActionForFix,
  STATUS,
} from '@attendance/domain/models/FixDailyRequest';

import { State } from '../../../modules';
import * as selectors from '../../../modules/selectors';
import { actions as approvalHistoryActions } from '../../../modules/ui/approvalHistory';

import * as actions from './actions';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../components/dialogs/DailyAttTimeDialog/Header';

import { convertToSaving, isChange } from './helpers';
import * as localSelectors from './selectors';
import useAccessControl from '@attendance/timesheet-pc/hooks/useAccessControl';

export const submitRequest = async ({
  allowedEditDailyRecord,
  fixDailyRequest,
  dailyAttTime,
  attRecord,
  dailyObjectivelyEventLog,
  employeeId,
  dailyRequestSummary,
}: {
  allowedEditDailyRecord: boolean;
  fixDailyRequest: FixDailyRequest;
  dailyAttTime: State['ui']['editingDailyAttTime'];
  attRecord: AttRecord;
  dailyObjectivelyEventLog: DailyObjectivelyEventLog | null;
  employeeId: string | null;
  dailyRequestSummary: {
    status: DailyRequestStatus;
  };
}) => {
  switch (fixDailyRequest.performableActionForFix) {
    case ACTIONS_FOR_FIX.Submit:
      if (
        allowedEditDailyRecord &&
        isChange({ dailyAttTime, attRecord, dailyObjectivelyEventLog })
      ) {
        const record = convertToSaving(dailyAttTime);
        return actions.saveAndSubmitFixDailyRequest({
          dailyRecord: { ...record, employeeId },
          dailyRequestSummary,
        });
      } else {
        return actions.submitRequest({
          id: dailyAttTime.recordId,
          dailyRequestSummary,
        });
      }
    case ACTIONS_FOR_FIX.CancelApproval:
      return actions.cancelApproval(fixDailyRequest.id);
    case ACTIONS_FOR_FIX.CancelRequest:
      return actions.cancelRequest(fixDailyRequest.id);
  }
};

const Container: React.FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const globalLoading = useSelector(selectors.isLoading);
  const localLoading = useSelector(localSelectors.localLoading);
  const readOnly = useSelector(
    (state: State): boolean => state.entities.timesheet?.attSummary?.isLocked
  );
  const isDelegated = useSelector(selectors.isByDelegate);
  const employeeId = useSelector(selectors.employeeId);
  const dailyAttTime = useSelector(
    (state: State) => state.ui.editingDailyAttTime
  );
  const attRecord = useSelector(selectors.editingAttRecord);
  const dailyObjectivelyEventLog = useSelector(
    selectors.editingDailyObjectivelyEventLog
  );
  const fixDailyRequest = useSelector(
    createSelector(selectors.editingAttRecord, (record) =>
      record ? record.fixDailyRequest : null
    )
  );
  const dailyRequestConditionMap = useSelector(
    selectors.buildDailyRequestConditionMap
  );
  const dailyRequestSummary = React.useMemo(
    () => ({
      status:
        dailyRequestConditionMap && dailyAttTime && dailyAttTime.recordDate
          ? dailyRequestConditionMap[dailyAttTime.recordDate]
              .remarkableRequestStatus
          : null,
    }),
    [dailyAttTime, dailyRequestConditionMap]
  );
  const enabledFixDailyRequest = useSelector(
    (state: State) =>
      RecordsUtil.getWithinRange(
        attRecord.recordDate,
        state.entities.timesheet.workingTypes
      )?.useFixDailyRequest
  );
  const permissionTestConditionsForEdit = React.useMemo(
    () => getPermissionTestConditionsForEdit(),
    []
  );
  const permissionTestConditionsForActionForFix = React.useMemo(
    () =>
      getPermissionTestConditionsForActionForFix(
        fixDailyRequest?.performableActionForFix
      ),
    [fixDailyRequest?.performableActionForFix]
  );
  const allowedEditDailyRecord = useAccessControl(
    permissionTestConditionsForEdit
  );
  const allowedActionForFixDailyRequest = useAccessControl(
    permissionTestConditionsForActionForFix
  );
  const enabledDisplayingNextApprover = useAccessControl({
    requireIfByEmployee: ['viewNextApproverByEmployee'],
    requireIfByDelegate: ['viewNextApproverByDelegate'],
  });
  const allowToChangeApproverSelf = useSelector(
    (state: State) => state.common.userSetting.allowToChangeApproverSelf
  );
  const allowedEditApproverEmployee =
    !readOnly &&
    allowToChangeApproverSelf &&
    !isDelegated &&
    fixDailyRequest &&
    fixDailyRequest.status !== STATUS.PENDING &&
    fixDailyRequest.status !== STATUS.APPROVED;
  const onSubmitRequest = React.useCallback(
    async () =>
      submitRequest({
        allowedEditDailyRecord,
        fixDailyRequest,
        dailyAttTime,
        attRecord,
        dailyObjectivelyEventLog,
        employeeId,
        dailyRequestSummary,
      }),
    [
      allowedEditDailyRecord,
      fixDailyRequest,
      dailyAttTime,
      attRecord,
      dailyObjectivelyEventLog,
      employeeId,
      dailyRequestSummary,
    ]
  );
  const onClickOpenApprovalHistoryDialog = React.useCallback(() => {
    dispatch(approvalHistoryActions.open(fixDailyRequest.id));
  }, [dispatch, fixDailyRequest]);
  const onClickOpenApproverEmployeeSettingDialog = React.useCallback(() => {
    dispatch(
      approverEmployeeSettingActions.showDialog(
        {
          id: '',
          employeeName: fixDailyRequest?.approver01Name,
        },
        dailyAttTime?.recordDate,
        !allowedEditApproverEmployee,
        DIALOG_TYPE.AttRequest
      )
    );
  }, [
    dispatch,
    fixDailyRequest?.approver01Name,
    dailyAttTime?.recordDate,
    allowedEditApproverEmployee,
  ]);

  if (!dailyAttTime || !fixDailyRequest || !enabledFixDailyRequest) {
    return null;
  }

  return (
    <Component
      loading={globalLoading || localLoading}
      readOnly={readOnly}
      fixDailyRequest={fixDailyRequest}
      allowedAction={allowedActionForFixDailyRequest}
      enabledApprovalHistory={!!fixDailyRequest?.id}
      onSubmitRequest={onSubmitRequest}
      onClickOpenApprovalHistoryDialog={onClickOpenApprovalHistoryDialog}
      onClickOpenApproverEmployeeSettingDialog={
        onClickOpenApproverEmployeeSettingDialog
      }
      enabledDisplayingNextApprover={enabledDisplayingNextApprover}
    />
  );
};

export default Container;
