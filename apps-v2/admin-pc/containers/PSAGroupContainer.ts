import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as PSAGroupActions from '../actions/psaGroup';

import PSAGroup from '../presentational-components/PSAGroup';

const mapStateToProps = (state) => ({
  itemList: state.searchPSAGroup,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: PSAGroupActions.searchPSAGroup,
      create: PSAGroupActions.createPSAGroup,
      update: PSAGroupActions.updatePSAGroup,
      delete: PSAGroupActions.deletePSAGroup,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PSAGroup) as React.ComponentType<Record<string, any>>;
