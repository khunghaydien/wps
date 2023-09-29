import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createSelector } from 'reselect';

import * as ApproverEmployeeSettingActions from '../../../../commons/action-dispatchers/ApproverEmployeeSetting';
import { DIALOG_TYPE } from '../../../../commons/modules/approverEmployeeSearch/ui/dialog';

import { State } from '../../modules';
import { State as TimesheetState } from '../../modules/entities/timesheet';
import * as targetDateSelectors from '../../modules/selectors';
import { actions as approvalHistoryActions } from '../../modules/ui/approvalHistory';
import * as dailyRequestSelectors from '../../modules/ui/dailyRequest/selector';

import * as DailyRequestActions from '../../action-dispatchers/DailyRequest';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import DailyAttRequestDialog from '../../components/dialogs/DailyAttRequestDialog';

const selectProxyEmployeeInfo = (
  state: State
): State['common']['proxyEmployeeInfo'] => state.common.proxyEmployeeInfo;
const selectRequestTargetDate = (state: State) =>
  state.ui.dailyRequest.targetDate;
const selectEditing = (state: State): State['ui']['dailyRequest']['editing'] =>
  state.ui.dailyRequest.editing;
const selectTargetRequest = (state: State) =>
  dailyRequestSelectors.targetRequest(state.ui.dailyRequest);
const selectAttRecordList = (state: State) =>
  (state.entities.timesheet as TimesheetState).attRecordList;
const ownerInfos = (state: State) =>
  (state.entities.timesheet as TimesheetState).ownerInfos;

const selectAttRecord = createSelector(
  selectRequestTargetDate,
  selectAttRecordList,
  (targetDate, attRecordList) => {
    return targetDate && attRecordList
      ? attRecordList.find((attRecord) => attRecord.recordDate === targetDate)
      : null;
  }
);

const selectDailyAttRequestApproverEmployee = createSelector(
  selectEditing,
  selectTargetRequest,
  selectAttRecord,
  (editing, request, attRecord) => {
    if (!editing.isEditing && editing.id && request) {
      return {
        id: '',
        employeeName: request.approver01Name,
      };
    } else if (attRecord) {
      return {
        id: '',
        employeeName: attRecord.approver01Name,
      };
    } else {
      return null;
    }
  }
);

const selectCanEditApproverEmployee = createSelector(
  (state) => state.entities.timesheet.workingTypes,
  selectRequestTargetDate,
  selectProxyEmployeeInfo,
  selectEditing,
  (workingTypes, targetDate, proxyEmployeeInfo, editing) => {
    const workingType = RecordsUtil.getWithinRange(targetDate, workingTypes);
    return (
      workingType &&
      workingType.allowToChangeApproverSelf &&
      !proxyEmployeeInfo.isProxyMode &&
      editing.isEditing
    );
  }
);

const selectedPeriodEndDate = createSelector(ownerInfos, (ownerInfos) =>
  ownerInfos?.length > 0 ? ownerInfos.slice(-1)[0].endDate : null
);

type OwnProps = Record<string, unknown>;

const mapStateToProps = (state: State) => {
  const targetDate = selectRequestTargetDate(state);
  const requestConditions =
    targetDateSelectors.selectSelectedRequestConditions(state);
  const attDailyRecord = selectAttRecord(state);

  return {
    isLoading: !!state.common.app.loadingDepth,
    editing: selectEditing(state),
    canEditApproverEmployee: selectCanEditApproverEmployee(state),
    approverEmployee: selectDailyAttRequestApproverEmployee(state),
    requestConditions,
    targetDate,
    targetRequest: selectTargetRequest(state),
    attDailyRequestTypeMap: (state.entities.timesheet as TimesheetState)
      .attDailyRequestTypeMap,
    attDailyRequestMap: (state.entities.timesheet as TimesheetState)
      .attDailyRequestMap,
    attWorkingType: RecordsUtil.getWithinRange(
      targetDate,
      (state.entities.timesheet as TimesheetState).workingTypes
    ),
    attDailyRecord,
    selectedPeriodStartDate: state.client.selectedPeriodStartDate,
    selectedPeriodEndDate: selectedPeriodEndDate(state),
    isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
    proxyEmployeeId: state.common.proxyEmployeeInfo.id,
    userSetting: state.common.userSetting,
    userPermission: state.common.accessControl.permission,
    maxRestTimesCount: state.entities.timesheet.dailyRestCountLimit,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onClickRequestDetailButton: DailyRequestActions.showRequestDetailPane,
      onClickRequestEntryButton: DailyRequestActions.showEntryRequestPane,
      onStartEditing: DailyRequestActions.startEditing,
      onCancelEditing: DailyRequestActions.cancelEditing,
      onSubmitRequest: DailyRequestActions.submit,
      onDisableRequest: DailyRequestActions.disable,
      onCancel: DailyRequestActions.hideManagementDialog,
      onClickOpenApprovalHistoryDialog: approvalHistoryActions.open,
      onClickOpenApproverEmployeeSettingDialog:
        ApproverEmployeeSettingActions.showDialog,
    },
    dispatch
  );

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  onClickRequestDetailButton: (target) => {
    dispatchProps.onClickRequestDetailButton(
      target,
      stateProps.maxRestTimesCount
    );
  },
  onClickRequestEntryButton: (requestType) => {
    dispatchProps.onClickRequestEntryButton(
      stateProps.targetDate,
      requestType,
      stateProps.attDailyRequestTypeMap,
      stateProps.attWorkingType,
      // @ts-ignore AttRecordとAttDailyRecordには互換性がない、model統合後にこのts-ignoreは削除される予定
      stateProps.attDailyRecord,
      (stateProps.isProxyMode && stateProps.proxyEmployeeId) || null,
      stateProps.maxRestTimesCount
    );
  },
  onStartEditing: () => {
    dispatchProps.onStartEditing(
      stateProps.targetRequest,
      stateProps.attWorkingType,
      // @ts-ignore AttRecordとAttDailyRecordには互換性がない、model統合後にこのts-ignoreは削除される予定
      stateProps.attDailyRecord,
      stateProps.proxyEmployeeId,
      stateProps.targetDate,
      stateProps.maxRestTimesCount
    );
  },
  onCancelEditing: () => {
    const { id } = stateProps.editing;
    const { attDailyRequestMap, maxRestTimesCount } = stateProps;

    if (!id || !attDailyRequestMap[id]) {
      return;
    }

    dispatchProps.onCancelEditing(attDailyRequestMap[id], maxRestTimesCount);
  },
  onSubmitRequest: () => {
    dispatchProps.onSubmitRequest(
      stateProps.targetRequest,
      stateProps.editing.editAction,
      stateProps.selectedPeriodStartDate,
      stateProps.selectedPeriodEndDate,
      stateProps.proxyEmployeeId,
      stateProps.userSetting,
      stateProps.userPermission
    );
  },
  onDisableRequest: () => {
    dispatchProps.onDisableRequest(
      stateProps.targetRequest,
      stateProps.editing.disableAction,
      stateProps.selectedPeriodStartDate,
      stateProps.selectedPeriodEndDate,
      stateProps.proxyEmployeeId,
      stateProps.userSetting,
      stateProps.userPermission,
      stateProps.maxRestTimesCount
    );
  },
  onClickOpenApprovalHistoryDialog: () => {
    dispatchProps.onClickOpenApprovalHistoryDialog(stateProps.editing.id);
  },
  onClickOpenApproverEmployeeSettingDialog: () => {
    dispatchProps.onClickOpenApproverEmployeeSettingDialog(
      stateProps.approverEmployee,
      stateProps.targetDate,
      !stateProps.canEditApproverEmployee,
      DIALOG_TYPE.AttDailyRequest
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(
  DailyAttRequestDialog
) as React.ComponentType<OwnProps> as React.ComponentType;
