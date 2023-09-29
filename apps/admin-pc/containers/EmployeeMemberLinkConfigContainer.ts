import { connect } from 'react-redux';

import DateUtil from '../../commons/utils/DateUtil';

import {
  actions as employeeMemberLinkConfigActions,
  addSelectedEmployeeMember,
  cancelSearch,
  openSearchDialog,
  searchEmployeeMemberList,
} from '../modules/employeeMemberLinkConfig/ui';

import EmployeeMemberLinkConfigItem from '../components/EmployeeMemberLinkConfig/EmployeeMemberLinkConfigItem';

const managerLabels = (type) => ({
  noItem: 'Admin_Lbl_PsaManagerNoItemInTheSet',
  addItem:
    type === 'PM'
      ? 'Admin_Lbl_PsaAddProjectManager'
      : 'Admin_Lbl_PsaAddManager',
  dialogTitle: 'Admin_Lbl_Employee',
});

const employeeLabels = {
  noItem: 'Admin_Lbl_PsaResourcesNoItemInTheSet',
  addItem: 'Admin_Lbl_PsaAddResource',
  dialogTitle: 'Admin_Lbl_Resource',
};

const mapStateToProps = (state, ownProps) => {
  const { selectedEmployeeMember, isDialogOpen, foundEmployeeMember } =
    state.employeeMemberLinkConfig.ui;
  const isSelectedEmpty = selectedEmployeeMember.length === 0;
  const isAddButtonDisabled =
    foundEmployeeMember.filter((employeeMember) => employeeMember.isSelected)
      .length === 0;

  // change label if it's used in resource manager key
  const isUsedInRMGroup = ownProps.config.class.includes(
    'resource-manager-group'
  );
  const labels = isUsedInRMGroup
    ? employeeLabels
    : managerLabels(state.tmpEditRecord.groupType);

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
    config: ownProps.config,
    selectedId: state.employee.ui.detail.baseRecord.id,
    hasSearch: true,
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
  addSelectedEmployeeMember: () =>
    dispatchProps.addSelectedEmployeeMember(stateProps.foundEmployeeMember),
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
