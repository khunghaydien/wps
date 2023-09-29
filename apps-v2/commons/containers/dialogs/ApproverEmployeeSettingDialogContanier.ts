import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import * as ApproverEmployeeSearchActions from '../../action-dispatchers/ApproverEmployeeSearch';
import * as ApproverEmployeeSettingActions from '../../action-dispatchers/ApproverEmployeeSetting';

import ApproverEmployeeSettingDialog from '../../components/dialogs/ApproverEmployeeSettingDialog';

const mapStateToProps = (state: any) => {
  const { companyId, departmentId } = state.common.userSetting;
  const { entities } = state.common.approverEmployeeSetting;
  const isHide = !state.common.approverEmployeeSetting.ui.dialog.isOpen;
  const isReadOnly = state.common.approverEmployeeSetting.ui.status.isReadOnly;
  const isEdited = !!entities.id;
  const targetDate = state.common.approverEmployeeSetting.ui.status.targetDate;
  const employeeName = entities.employeeName;
  const dialogType = state.common.approverEmployeeSetting.ui.dialog.type;
  return {
    isHide,
    isReadOnly,
    isEdited,
    targetDate,
    approverEmployee: employeeName ? entities : null,
    approverEmployeeName: employeeName,
    companyId,
    departmentId,
    dialogType,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators(
    {
      handleCancel: ApproverEmployeeSettingActions.hideDialog,
      handleChangeEmployee: ApproverEmployeeSearchActions.showDialog,
      handleSave: ApproverEmployeeSettingActions.save as any,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  handleChangeEmployee: () => {
    dispatchProps.handleChangeEmployee(
      stateProps.targetDate,
      stateProps.companyId,
      stateProps.departmentId,
      stateProps.dialogType
    );
  },
  handleSave: () => {
    const { approverEmployee } = stateProps;
    if (approverEmployee && approverEmployee.id) {
      dispatchProps.handleSave(approverEmployee, ownProps.handleSave);
    } else {
      dispatchProps.handleCancel();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApproverEmployeeSettingDialog) as React.ComponentType<Record<string, any>>;
