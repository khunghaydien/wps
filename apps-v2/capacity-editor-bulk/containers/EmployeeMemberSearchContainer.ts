import { connect } from 'react-redux';

import DateUtil from '@apps/commons/utils/DateUtil';

import {
  actions as employeeMemberLinkConfigActions,
  addSelectedEmployeeMember,
  cancelSearch,
  openSearchDialog,
  searchEmployeeMemberList,
} from '@apps/admin-pc/modules/employeeMemberLinkConfig/ui';

import EmployeeMemberLinkConfigItem from '@apps/admin-pc/components/EmployeeMemberLinkConfig/EmployeeMemberLinkConfigItem';

const employeeLabels = {
  noItem: 'Admin_Lbl_PsaResourcesNoItemInTheSet',
  addItem: 'Admin_Lbl_AddEmployee',
  dialogTitle: 'Admin_Lbl_Resource',
};

const mapStateToProps = (state, ownProps) => {
  const { selectedEmployeeMember, isDialogOpen, foundEmployeeMember } =
    state.employeeMemberLinkConfig.ui;
  const isSelectedEmpty = selectedEmployeeMember.length === 0;
  const isAddButtonDisabled =
    foundEmployeeMember.filter((employeeMember) => employeeMember.isSelected)
      .length === 0;

  const labels = employeeLabels;

  return {
    foundEmployeeMember,
    isAddButtonDisabled,
    isDialogOpen,
    isSelectedEmpty,
    labels,
    selectedEmployeeMember: [], // Allow to select same employee for multiple times
    searchEmployeeMember: state.searchEmployeeMember,
    isDisabled: ownProps.disabled,
    companyId: state.entities.capacityCompanyInfo.companyId,
    config: ownProps.config,
    selectedId: '',
    hasSearch: true,
    addEmployees: ownProps.addEmployees,
    rowId: ownProps.rowId,
    isSingleSelection: ownProps.isSingleSelection,
  };
};

const mapDispatchToProps = {
  toggleSelection: employeeMemberLinkConfigActions.toggleSelection,
  openSelection: openSearchDialog,
  addSelectedEmployeeMember,
  cancelSelection: cancelSearch,
  search: searchEmployeeMemberList,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  addSelectedEmployeeMember: () => {
    stateProps.addEmployees(
      stateProps.foundEmployeeMember.filter(
        (employee) => employee.isSelected === true
      ),
      stateProps.rowId
    );
    dispatchProps.addSelectedEmployeeMember(stateProps.foundEmployeeMember);
  },
  search: (query) => {
    dispatchProps.search(
      {
        ...query,
        startDate: DateUtil.getToday(),
        endDate: DateUtil.formatISO8601Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
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
