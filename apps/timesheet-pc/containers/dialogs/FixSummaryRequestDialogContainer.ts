import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createSelector } from 'reselect';

import * as ApproverEmployeeSettingActions from '../../../commons/action-dispatchers/ApproverEmployeeSetting';
import { DIALOG_TYPE } from '../../../commons/modules/approverEmployeeSearch/ui/dialog';

import STATUS from '@apps/domain/models/approval/request/Status';

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
      attSummary.status !== STATUS.Pending &&
      attSummary.status !== STATUS.Approved
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
      (attSummary.status === STATUS.Pending ||
        attSummary.status === STATUS.Approved)
    ) {
      return requestedApproverEmployee;
    } else {
      return lastAttRecordApproverEmployee;
    }
  }
);

type OwnProps = Record<string, unknown>;

const mapStateToProps = (state: State) => ({
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  proxyEmployeePhotoUrl: state.common.proxyEmployeeInfo.employeePhotoUrl,
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
  onSubmit: () => {
    dispatchProps.onSubmit(
      stateProps.fixSummaryRequest,
      stateProps.selectedPeriodStartDate,
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
