import { connect } from 'react-redux';

import msg from '../../commons/languages';
import { showErrorToast } from '../../commons/modules/toast';

import {
  actions as resourceGroupMemberLinkConfigActions,
  searchEmployeeMemberListByManagerListId,
} from '../modules/resourceGroupMemberLinkConfig/ui';

import { changeRecordValue as changeTmpEditRecord } from '../action-dispatchers/Edit';
import { setEditRecord } from '../actions/editRecord';

import ResourceMemberGrid from '../components/EmployeeMemberLinkConfig/ResourceMemberGrid';

const mapStateToProps = (state, ownProps) => {
  const isDisabled = ownProps.disabled;
  const { selectedEmployeeMember } = state.resourceGroupMemberLinkConfig.ui;

  const isEmployeeMemberSelected =
    selectedEmployeeMember.filter((_) => _.isSelected).length === 0;

  const isRemoveButtonDisabled = isDisabled || isEmployeeMemberSelected;

  // show default RM field if it's project manager
  const hasDefaultRM = ownProps.config.class.includes('project-manager-group');

  return {
    hasDefaultRM,
    selectedEmployeeMember,
    isDisabled,
    isRemoveButtonDisabled,
    config: ownProps.config,
    selectedId: state.editRecord.id,
    editRecord: state.editRecord,
    tmpEditRecord: state.tmpEditRecord,
  };
};

const mapDispatchToProps = {
  changeTmpEditRecord,
  setEditRecord,
  showErrorToast,
  getMember: searchEmployeeMemberListByManagerListId('Owner'),
  toggleSelectedEmployeeMember:
    resourceGroupMemberLinkConfigActions.toggleSelectedEmployeeMember,
  removeFromSelectedEmployeeMember:
    resourceGroupMemberLinkConfigActions.removeFromSelectedEmployeeMember,
  setAsDefaultResourceManager:
    resourceGroupMemberLinkConfigActions.setAsDefaultResourceManager,
  setSelectedEmployeeMember:
    resourceGroupMemberLinkConfigActions.setSelectedEmployeeMember,
  cleanSelectedEmployeeMember:
    resourceGroupMemberLinkConfigActions.cleanSelectedEmployeeMember,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, employeeMembers, charType) => {
    dispatchProps.changeTmpEditRecord(key, employeeMembers, charType);
  },
  resetToEditRecord: () => {
    dispatchProps.setSelectedEmployeeMember(stateProps.editRecord.owners);
  },
  showToast: () => {
    dispatchProps.showErrorToast(msg().Admin_Err_SelectSingleRecord);
  },
  remove: () =>
    dispatchProps.removeFromSelectedEmployeeMember(
      stateProps.selectedEmployeeMember
    ),
  setDefaultRM: () =>
    dispatchProps.setAsDefaultResourceManager(
      stateProps.selectedEmployeeMember
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ResourceMemberGrid);
