import { connect } from 'react-redux';

import { actions as skillsetLinkConfigActions } from '../modules/skillsetLinkConfig/ui';

import { changeRecordValue as changeTmpEditRecord } from '../action-dispatchers/Edit';
import { setEditRecord } from '../actions/editRecord';

import SkillsetGrid from '../components/SkillsetLinkConfig/SkillsetGrid';

const mapStateToProps = (state, ownProps) => {
  const isDisabled = ownProps.disabled;
  const { employeeSkillset, selectedSkillset } = state.skillsetLinkConfig.ui;

  const isSkillsetSelected =
    selectedSkillset.filter((skillset) => skillset.isSelected).length === 0;

  const isRemoveButtonDisabled = isDisabled || isSkillsetSelected;

  return {
    employeeSkillset,
    selectedSkillset,
    isDisabled,
    isRemoveButtonDisabled,
    config: ownProps.config,
    skillsets: state.searchSkillset,
    selectedId: state.editRecord.id,
    editRecord: state.editRecord,
    tmpEditRecord: state.tmpEditRecord,
  };
};

const mapDispatchToProps = {
  changeTmpEditRecord,
  setEditRecord,
  toggleSelectedSkillset: skillsetLinkConfigActions.toggleSelectedSkillset,
  removeFromSelectedSkillset:
    skillsetLinkConfigActions.removeFromSelectedSkillset,
  cleanSelectedSkillset: skillsetLinkConfigActions.cleanSelectedSkillset,
  addToSelectedSkillset: skillsetLinkConfigActions.addToSelectedSkillset,
  setSelectedSkillset: skillsetLinkConfigActions.setSelectedSkillset,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeDetailItem: (key, value, charType) => {
    dispatchProps.changeTmpEditRecord(key, value, charType);
  },
  resetToEditRecord: () => {
    const originalSkillsets = stateProps.editRecord.skills;
    let results = originalSkillsets || [];
    if (results.length > 0) {
      results = results.map((_) => ({
        id: _.skillId,
        skillCode: _.skillCode,
        skillName: _.skillName,
        ratingType: _.ratingType,
        rating: _.rating,
        categoryName: _.categoryName,
        grades: _.grades,
        isSelected: false,
      }));
    }
    dispatchProps.setSelectedSkillset(results);
  },
  remove: () =>
    dispatchProps.removeFromSelectedSkillset(stateProps.selectedSkillset),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SkillsetGrid);
