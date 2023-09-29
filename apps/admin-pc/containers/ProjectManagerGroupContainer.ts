import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as projectManagerGroupActions from '../actions/projectManagerGroup';

import ProjectManagerGroup from '../presentational-components/ProjectManagerGroup';

const mapStateToProps = (state) => ({
  itemList: state.searchProjectManagerGroup,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: projectManagerGroupActions.searchProjectManagerGroup,
      create: projectManagerGroupActions.createProjectManagerGroup,
      update: projectManagerGroupActions.updateProjectManagerGroup,
      delete: projectManagerGroupActions.deletehProjectManagerGroup,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectManagerGroup) as React.ComponentType<Record<string, any>>;
