import { connect } from 'react-redux';

import {
  actions as employeeMemberLinkConfigActions,
  searchEmployeeMemberListByManagerListId,
} from '../modules/employeeMemberLinkConfig/ui';

import { changeRecordValue as changeTmpEditRecord } from '../action-dispatchers/Edit';
import { setEditRecord } from '../actions/editRecord';

import EmployeeMemberGrid from '../components/EmployeeMemberLinkConfig/EmployeeMemberGrid';

const mapStateToProps = (state, ownProps) => {
  const isDisabled = ownProps.disabled;
  const { selectedEmployeeMember } = state.employeeMemberLinkConfig.ui;

  const isEmployeeMemberSelected =
    selectedEmployeeMember.filter((_) => _.isSelected).length === 0;

  const isRemoveButtonDisabled = isDisabled || isEmployeeMemberSelected;

  return {
    isDisabled,
    isRemoveButtonDisabled,
    config: ownProps.config,
    selectedId: state.editRecord.id,
    editRecord: state.editRecord,
    tmpEditRecord: state.tmpEditRecord,
    selectedEmployeeMember,
  };
};

const mapDispatchToProps = {
  setEditRecord,
  changeTmpEditRecord,
  getMember: searchEmployeeMemberListByManagerListId,
  toggleSelectedEmployeeMember:
    employeeMemberLinkConfigActions.toggleSelectedEmployeeMember,
  removeFromSelectedEmployeeMember:
    employeeMemberLinkConfigActions.removeFromSelectedEmployeeMember,
  addToSelectedEmployeeMember:
    employeeMemberLinkConfigActions.addToSelectedEmployeeMember,
  setSelectedEmployeeMember:
    employeeMemberLinkConfigActions.setSelectedEmployeeMember,
  cleanSelectedEmployeeMember:
    employeeMemberLinkConfigActions.cleanSelectedEmployeeMember,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, employeeMembers, charType) => {
    dispatchProps.changeTmpEditRecord(key, employeeMembers, charType);
  },
  resetToEditRecord: () => {
    dispatchProps.setSelectedEmployeeMember(stateProps.editRecord.members);
  },
  remove: () =>
    dispatchProps.removeFromSelectedEmployeeMember(
      stateProps.selectedEmployeeMember
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EmployeeMemberGrid);
