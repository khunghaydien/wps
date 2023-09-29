import { connect } from 'react-redux';

import {
  actions as resourceGroupMemberLinkConfigActions,
  addSelectedEmployeeMember,
  cancelSearch,
  openSearchDialog,
  searchEmployeeMemberList,
} from '../modules/resourceGroupMemberLinkConfig/ui';

import EmployeeMemberLinkConfigItem from '../components/EmployeeMemberLinkConfig/EmployeeMemberLinkConfigItem';

const mapStateToProps = (state, ownProps) => {
  const { selectedEmployeeMember, isDialogOpen, foundEmployeeMember } =
    state.resourceGroupMemberLinkConfig.ui;
  const isSelectedEmpty = selectedEmployeeMember.length === 0;
  const isAddButtonDisabled =
    foundEmployeeMember.filter((employeeMember) => employeeMember.isSelected)
      .length === 0;

  const labels = {
    noItem: 'Admin_Lbl_PsaManagerNoItemInTheSet',
    addItem: 'Admin_Lbl_PsaAddManager',
    dialogTitle: 'Admin_Lbl_Manager',
  };

  return {
    foundEmployeeMember,
    isAddButtonDisabled,
    isDialogOpen,
    isSelectedEmpty,
    labels,
    selectedEmployeeMember,
    searchEmployeeMember: state.searchEmployeeMember,
    isDisabled: ownProps.disabled,
    companyId: state.base.menuPane.ui.targetCompanyId,
    selectedId: state.employee.ui.detail.baseRecord.id,
    hasSearch: false,
  };
};

const mapDispatchToProps = {
  toggleSelection: resourceGroupMemberLinkConfigActions.toggleSelection,
  openSelection: openSearchDialog,
  addSelectedEmployeeMember,
  cancelSelection: cancelSearch,
  search: searchEmployeeMemberList,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  addSelectedEmployeeMember: () =>
    dispatchProps.addSelectedEmployeeMember(stateProps.foundEmployeeMember),
  search: (query) => {
    dispatchProps.search(
      {
        ...query,
        companyId: stateProps.companyId,
      },
      stateProps.selectedEmployeeMember
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EmployeeMemberLinkConfigItem);
