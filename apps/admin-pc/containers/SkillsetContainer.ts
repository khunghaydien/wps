import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import { searchCategory } from '../actions/category';
import * as skillSetActions from '../actions/skillset';

import Skillset from '../presentational-components/Skillset';

export function getSkillsetList(state: any) {
  const { skillsetList } = state.entities;

  if (skillsetList && skillsetList.length > 0) {
    return skillsetList.map((skillset) => ({
      code: skillset.code,
      id: skillset.id,
      name: skillset.name,
      label: skillset.name,
    }));
  }

  return skillsetList;
}

const mapStateToProps = (state) => ({
  itemList: state.searchSkillset,
  searchCategory: state.searchCategory,
  value2msgkey: state.value2msgkey,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: skillSetActions.searchSkillset,
      create: skillSetActions.createSkillset,
      update: skillSetActions.updateSkillset,
      delete: skillSetActions.deleteSkillset,
      searchCategory,
      getConstantsSkillset: skillSetActions.getConstantsSkillset,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Skillset) as React.ComponentType<Record<string, any>>;
