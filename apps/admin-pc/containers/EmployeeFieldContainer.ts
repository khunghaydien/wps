/* flow */
import { connect } from 'react-redux';

import get from 'lodash/get';

import msg from '../../commons/languages';

import { defaultValue } from '../../domain/models/organization/MasterEmployeeBase';

import { actions as uiActionsDA } from '../modules/delegateApprover/ui/assignment';

import ClearableField from '../components/Common/ClearableField';

import TargetEmployeesSearchDialog from './DelegateApprover/EmployeesSearchDialogContainer';

const mapStateToProps = (state) => ({
  // FIXME move TargetEmployeesSearchDialog outside DA to be common component
  isEmployeeSelection: state.delegateApprover.ui.assignment.isEmployeeSelection,
  // in case multiple emp dialog in same page, need to differentiate which one to open
  activeDialog: state.delegateApprover.ui.assignment.activeDialogKey,
});

const mapDispatchToProps = {
  openEmployeeSelection: uiActionsDA.openEmployeeSelection,
  setActiveDialogKey: uiActionsDA.setActiveDialogKey,
  closeEmployeeSelection: uiActionsDA.cancelEmployeeSelection,
};

/*
 * get path of emp info object from tmpEditRecord based on config key
 */
const mapConfigKeyToInfoPath = (configKey) => {
  let path;
  switch (configKey) {
    case 'managerId':
      path = 'manager';
      break;
    case 'jobOwnerId':
      path = 'jobOwner';
      break;
    case 'approver01Id':
      path = 'approver01';
      break;
    case 'approver02Id':
      path = 'approver02';
      break;
    case 'approver03Id':
      path = 'approver03';
      break;
    case 'approver04Id':
      path = 'approver04';
      break;
    case 'approver05Id':
      path = 'approver05';
      break;
    case 'approver06Id':
      path = 'approver06';
      break;
    case 'approver07Id':
      path = 'approver07';
      break;
    case 'approver08Id':
      path = 'approver08';
      break;
    case 'approver09Id':
      path = 'approver09';
      break;
    case 'approver10Id':
      path = 'approver10';
      break;
    default:
      path = '';
  }
  return path;
};

const getLabel = (tmpEditRecord, config) => {
  const path = mapConfigKeyToInfoPath(config.key);
  const empInfo = get(tmpEditRecord, path, defaultValue);
  const code = empInfo.code || '';
  const name = empInfo.name || '';
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
    const updatedInfo = { name: '', code: '' };
    const empInfoPath = mapConfigKeyToInfoPath(ownProps.config.key);
    ownProps.onChangeDetailItem(ownProps.config.key, null);
    ownProps.onChangeDetailItem(empInfoPath, updatedInfo);
  },
  dialog: TargetEmployeesSearchDialog,

  dialogProps: {
    singleSelection: true,
    targetDate: ownProps.tmpEditRecord.validDateFrom,
    companyId: ownProps.tmpEditRecord.companyId,
    select: (employees) => {
      // currently EmployeeField only support single selection, so there is only one emp selected
      const selectedEmp = employees[0];
      ownProps.onChangeDetailItem(ownProps.config.key, selectedEmp.id);
      const empInfoPath = mapConfigKeyToInfoPath(ownProps.config.key);
      const empInfo = {
        name: selectedEmp.name,
        code: selectedEmp.code,
      };
      ownProps.onChangeDetailItem(empInfoPath, empInfo);
      dispatchProps.closeEmployeeSelection();
    },
  },

  isDialogOpen:
    stateProps.isEmployeeSelection &&
    stateProps.activeDialog === ownProps.config.key,

  labelSelectBtn: msg().Admin_Lbl_SelectEmployee,
  label: getLabel(ownProps.tmpEditRecord, ownProps.config),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ClearableField);
