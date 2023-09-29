import { connect } from 'react-redux';

import {
  actions as skillsetLinkConfigActions,
  addSelectedSkillset,
  cancelSearch,
  openSearchDialog,
  searchSkillsetList,
} from '../modules/skillsetLinkConfig/ui';

import SkillsetLinkConfigItem from '../components/SkillsetLinkConfig/SkillsetLinkConfigItem';

const mapStateToProps = (state, ownProps) => {
  const { selectedSkillset, isDialogOpen, foundSkillset } =
    state.skillsetLinkConfig.ui;
  const isSelectedEmpty = selectedSkillset.length === 0;
  const isAddButtonDisabled =
    foundSkillset.filter((skillset) => skillset.isSelected).length === 0;

  return {
    selectedSkillset,
    isDialogOpen,
    foundSkillset,
    isSelectedEmpty,
    isAddButtonDisabled,
    searchSkillset: state.searchSkillset,
    isDisabled: ownProps.disabled,
    companyId: state.base.menuPane.ui.targetCompanyId,
    config: ownProps.config,
    selectedId: state.employee.ui.detail.baseRecord.id,
  };
};

const mapDispatchToProps = {
  toggleSelection: skillsetLinkConfigActions.toggleSelection,
  setFoundSkillset: skillsetLinkConfigActions.setFoundSkillset,
  openSelection: openSearchDialog,
  addSelectedSkillset,
  cancelSelection: cancelSearch,
  search: searchSkillsetList,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  addSelectedSkillset: () =>
    dispatchProps.addSelectedSkillset(stateProps.foundSkillset),
  search: (query) => {
    dispatchProps.search(
      {
        ...query,
        companyId: stateProps.companyId,
      },
      stateProps.selectedSkillset
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SkillsetLinkConfigItem);
