import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as proxyEmployeeSelectDialogActions } from '../../../widgets/dialogs/ProxyEmployeeSelectDialog/modules/ui';
import { actions as switchApproverDialogActions } from '../../../widgets/dialogs/SwitchApporverDialog/modules/entities';
import { actions as switchApproverDialogUIActions } from '../../../widgets/dialogs/SwitchApporverDialog/modules/ui';
import { AppDispatch } from '../modules/AppThunk';
import { actions as delegateApproverActions } from '../modules/delegateApprovalDialog';
import { actions as uiActions } from '../modules/widgets/PersonalMenuPopover/ui';

import * as ApproverEmployeeSetting from '../action-dispatchers/ApproverEmployeeSetting';

import PersonalMenuPopover, {
  Props as PersonalMenuPopoverProps,
} from '../components/PersonalMenuPopover';

type OwnProps = {
  showProxyEmployeeSelectButton?: boolean;
  showChangeApproverButton?: boolean;
  showLeaveDetailButton?: boolean;
};

export type Props = OwnProps &
  PersonalMenuPopoverProps & {
    onClickOpenDADialog: () => void;
    delegateAssignmentsCount: string;
    pendingRequestCount: number;
    isVisible: boolean;
  };

const mapStateToProps = (state) => {
  const { tabs } = state.ui;
  const delegateApprover = state.entities && state.entities.delegateApprover;
  const { SwitchApproverDialog } = state.widgets;
  const { userSetting, personalSetting, proxyEmployeeInfo } = state.common;

  const isValidApprovalScreen =
    tabs && ['EXPENSES', 'EXP_PRE_APPROVAL'].indexOf(tabs.selected) > -1;

  const delegateAssignmentsCount =
    delegateApprover && delegateApprover.assignment.length;

  const selectCanEditApproverEmployee =
    userSetting.allowToChangeApproverSelf && !proxyEmployeeInfo.isProxyMode;

  return {
    isVisible: state.widgets.PersonalMenuPopover.ui.visible,
    pendingRequestCount:
      SwitchApproverDialog && SwitchApproverDialog.entities.pendingRequestCount,
    employeeId: userSetting.employeeId,
    employeeName: userSetting.employeeName,
    departmentName: userSetting.departmentName,
    managerName: userSetting.approver01Name, // 承認者01を表示する
    approver01Name: userSetting.approver01Name,
    companyId: userSetting.companyId,
    departmentId: userSetting.departmentId,
    showChangeApproverButton:
      !isValidApprovalScreen && selectCanEditApproverEmployee,
    personalSetting,
    isApprovalScreen: isValidApprovalScreen,
    delegateAssignmentsCount,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      onClickCloseButton: uiActions.hide,
      onClickOpenLeaveWindowButton: uiActions.openLeaveWindow,
      onClickOpenProxyEmployeeSelectButton:
        proxyEmployeeSelectDialogActions.show,
      onClickOpenChangeApproverButton: ApproverEmployeeSetting.showDialog,
      openDADialog: delegateApproverActions.openNewAssignment,
      showSwitchApproverDialog: switchApproverDialogUIActions.show,
      getOriginalApproverList: switchApproverDialogActions.list,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickOpenDADialog: () => {
    dispatchProps.openDADialog(true);
  },
  onClickSwitchApproverButton: () => {
    dispatchProps.onClickCloseButton();
    dispatchProps.showSwitchApproverDialog();
    dispatchProps.getOriginalApproverList(stateProps.employeeId);
  },
  onClickOpenProxyEmployeeSelectButton: () => {
    dispatchProps.onClickCloseButton();
    dispatchProps.onClickOpenProxyEmployeeSelectButton(
      stateProps.companyId,
      stateProps.departmentId,
      stateProps.employeeId
    );
  },
  onClickOpenLeaveWindowButton: () => {
    dispatchProps.onClickCloseButton();
    dispatchProps.onClickOpenLeaveWindowButton();
  },
  onClickOpenChangeApproverButton: () => {
    dispatchProps.onClickCloseButton();
    dispatchProps.onClickOpenChangeApproverButton(
      {
        id: '',
        employeeName: stateProps.approver01Name, // 承認者01
      },
      '',
      !stateProps.showChangeApproverButton
    );
  },
});

class PersonalMenuPopoverContainer extends React.Component<Props> {
  render() {
    return this.props.isVisible ? (
      <PersonalMenuPopover
        employeeName={this.props.employeeName}
        departmentName={this.props.departmentName}
        managerName={this.props.managerName}
        isApprovalScreen={this.props.isApprovalScreen}
        showProxyEmployeeSelectButton={this.props.showProxyEmployeeSelectButton}
        showChangeApproverButton={this.props.showChangeApproverButton}
        showLeaveDetailButton={this.props.showLeaveDetailButton}
        delegateAssignmentsCount={this.props.delegateAssignmentsCount}
        pendingRequestCount={this.props.pendingRequestCount}
        onClickSwitchApproverButton={this.props.onClickSwitchApproverButton}
        onClickCloseButton={this.props.onClickCloseButton}
        onClickOpenLeaveWindowButton={this.props.onClickOpenLeaveWindowButton}
        onClickOpenProxyEmployeeSelectButton={
          this.props.onClickOpenProxyEmployeeSelectButton
        }
        onClickOpenChangeApproverButton={
          this.props.onClickOpenChangeApproverButton
        }
        onClickOpenDADialog={this.props.onClickOpenDADialog}
      />
    ) : null;
  }
}

const Component: React.ComponentType<OwnProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PersonalMenuPopoverContainer) as React.ComponentType<Record<string, any>>;

export default Component;
