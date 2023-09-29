import { connect } from 'react-redux';

import msg from '../../commons/languages';

import { actions as uiActionsDA } from '../modules/delegateApprover/ui/assignment';

import ClearableField from '../components/Common/ClearableField';

import TargetEmployeesSearchDialog from './PsaEmployeesSearchDialogContainer';

const mapStateToProps = (state) => ({
  isEmployeeSelection: state.delegateApprover.ui.assignment.isEmployeeSelection,
  // in case multiple emp dialog in same page, need to differentiate which one to open
  activeDialog: state.delegateApprover.ui.assignment.activeDialogKey,
});

const mapDispatchToProps = {
  openEmployeeSelection: uiActionsDA.openEmployeeSelection,
  setActiveDialogKey: uiActionsDA.setActiveDialogKey,
  closeEmployeeSelection: uiActionsDA.cancelEmployeeSelection,
};

const getLabel = (tmpEditRecord) => {
  const code = tmpEditRecord.empCode || '';
  const name = tmpEditRecord.empName || '';
  const divider = code && name ? ' - ' : '';
  const label = code + divider + name;

  return label;
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  openDialog: () => {
    dispatchProps.setActiveDialogKey(ownProps.config.key);
    dispatchProps.openEmployeeSelection(true);
  },
  onClickClearBtn: () => {
    ownProps.onChangeDetailItem('empId', null);
    ownProps.onChangeDetailItem('empName', null);
    ownProps.onChangeDetailItem('empCode', null);
  },
  dialog: TargetEmployeesSearchDialog,

  dialogProps: {
    singleSelection: true,
    targetDate: ownProps.tmpEditRecord.validDateFrom,
    select: (employees) => {
      // currently EmployeeField only support single selection, so there is only one emp selected
      const selectedEmp = employees[0];
      ownProps.onChangeDetailItem('empId', selectedEmp.id);
      ownProps.onChangeDetailItem('empName', selectedEmp.name);
      ownProps.onChangeDetailItem('empCode', selectedEmp.code);

      dispatchProps.closeEmployeeSelection();
    },
  },

  isDialogOpen:
    stateProps.isEmployeeSelection &&
    stateProps.activeDialog === ownProps.config.key,

  labelSelectBtn: msg().Admin_Lbl_SelectEmployee,
  // @ts-ignore
  label: getLabel(ownProps.tmpEditRecord, ownProps.config),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ClearableField);
