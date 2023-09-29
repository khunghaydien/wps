import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as workArrangement from '../actions/workArrangement';

import WorkArrangement from '../presentational-components/WorkArrangement';

const mapStateToProps = (state) => ({
  itemList: state.searchWorkArrangement,
  searchCompanySetting: state.searchCompany,
  editRecord: state.editRecord,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: workArrangement.searchWorkArrangement,
      create: workArrangement.createWorkArrangement,
      update: workArrangement.updateWorkArrangement,
      delete: workArrangement.deleteWorkArrangement,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkArrangement) as React.ComponentType<Record<string, any>>;
