import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createSelector } from 'reselect';

import * as ApproverEmployeeSettingActions from '../../../../commons/action-dispatchers/ApproverEmployeeSetting';
import { DIALOG_TYPE } from '../../../../commons/modules/approverEmployeeSearch/ui/dialog';
import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import { STATUS } from '@attendance/domain/models/AttFixSummaryRequest';

import { State } from '../../modules';
import { State as TimesheetState } from '../../modules/entities/timesheet';
import { actions as editingFixSummaryRequestActions } from '../../modules/ui/editingFixSummaryRequest';

import * as FixSummaryRequest from '../../action-dispatchers/FixSummaryRequest';

import FixRequestDialog from '../../components/dialogs/FixRequestDialog';

const selectUserSetting = (state: State) => state.common.userSetting;
const selectProxyEmployeeInfo = (state: State) =>
  state.common.proxyEmployeeInfo;
const selectAttRecordList = (state: State) =>
  (state.entities.timesheet as TimesheetState).attRecordList;
const selectAttSummary = (state: State) =>
  (state.entities.timesheet as TimesheetState).attSummary;
const ownerInfos = (state: State) =>
  (state.entities.timesheet as TimesheetState).ownerInfos;

const selectTargetDate = createSelector(
  selectAttRecordList,
  (attRecordList) => {
    if (attRecordList) {
      const lastAttRecord = attRecordList[attRecordList.length - 1];
      if (lastAttRecord) {
        return lastAttRecord.recordDate;
      }
    }
    return '';
  }
);

const selectCanEditApproverEmployee = createSelector(
  selectUserSetting,
  selectProxyEmployeeInfo,
  selectAttSummary,
  (userSetting, proxyEmployeeInfo, attSummary) => {
    return (
      userSetting.allowToChangeApproverSelf &&
      !proxyEmployeeInfo.isProxyMode &&
      attSummary &&
      attSummary.status !== STATUS.PENDING &&
      attSummary.status !== STATUS.APPROVED
    );
  }
);

const selectRequestedApproverEmployee = createSelector(
  selectAttSummary,
  (attSummary) => {
    if (attSummary) {
      return {
        id: '',
        employeeName: attSummary.approver01Name,
      };
    } else {
      return null;
    }
  }
);

const selectLastAttRecodeApproverEmployee = createSelector(
  selectAttRecordList,
  (attRecordList) => {
    if (attRecordList) {
      const lastAttRecord = attRecordList[attRecordList.length - 1];
      if (lastAttRecord) {
        return {
          id: '',
          employeeName: lastAttRecord.approver01Name,
        };
      }
    }
    return null;
  }
);

const selectApproverEmployee = createSelector(
  selectAttSummary,
  selectLastAttRecodeApproverEmployee,
  selectRequestedApproverEmployee,
  (attSummary, lastAttRecordApproverEmployee, requestedApproverEmployee) => {
    if (
      attSummary &&
      (attSummary.status === STATUS.PENDING ||
        attSummary.status === STATUS.APPROVED)
    ) {
      return requestedApproverEmployee;
    } else {
      return lastAttRecordApproverEmployee;
    }
  }
);

const selectedPeriodEndDate = createSelector(ownerInfos, (ownerInfos) =>
  ownerInfos?.length > 0 ? ownerInfos.slice(-1)[0].endDate : null
);

type OwnProps = Record<string, unknown>;

const mapStateToProps = (state: State) => ({
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  proxyEmployeePhotoUrl: state.common.proxyEmployeeInfo.employeePhotoUrl,
  selectedPeriodEndDate: selectedPeriodEndDate(state),
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  fixSummaryRequest: state.ui.editingFixSummaryRequest,
  userPhotoUrl: state.common.userSetting.photoUrl,
  canEditApproverEmployee: selectCanEditApproverEmployee(state),
  approverEmployee: selectApproverEmployee(state),
  targetDate: selectTargetDate(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onUpdateValue: editingFixSummaryRequestActions.update,
      onSubmit: FixSummaryRequest.submit,
      onCancel: FixSummaryRequest.hideRequestDialog,
      onClickOpenApproverEmployeeSettingDialog:
        ApproverEmployeeSettingActions.showDialog,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  AccessControlContainer,
  onSubmit: () => {
    dispatchProps.onSubmit(
      stateProps.fixSummaryRequest,
      stateProps.selectedPeriodStartDate,
      stateProps.selectedPeriodEndDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onClickOpenApproverEmployeeSettingDialog: () => {
    dispatchProps.onClickOpenApproverEmployeeSettingDialog(
      // $FlowFixMe
      stateProps.approverEmployee,
      stateProps.targetDate,
      !stateProps.canEditApproverEmployee,
      DIALOG_TYPE.AttRequest
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FixRequestDialog) as React.ComponentType<OwnProps> as React.ComponentType;
