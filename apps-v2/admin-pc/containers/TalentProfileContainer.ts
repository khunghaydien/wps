import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as talentProfileActions from '../actions/talentProfile';

import TalentProfile from '../presentational-components/TalentProfile';

const mapStateToProps = (state) => ({
  itemList: state.searchTalentProfile,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: talentProfileActions.searchTalentProfile,
      create: talentProfileActions.createTalentProfile,
      update: talentProfileActions.updateTalentProfile,
      delete: talentProfileActions.deleteTalentProfile,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TalentProfile) as React.ComponentType<Record<string, any>>;
