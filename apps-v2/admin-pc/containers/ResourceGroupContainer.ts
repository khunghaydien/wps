import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as resourceGroupActions from '../actions/resourceGroup';

import ResourceGroup from '../presentational-components/ResourceGroup';

const mapStateToProps = (state) => ({
  itemList: state.searchResourceGroup,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: resourceGroupActions.searchResourceGroup,
      create: resourceGroupActions.createResourceGroup,
      update: resourceGroupActions.updateResourceGroup,
      delete: resourceGroupActions.deletehResourceGroup,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceGroup) as React.ComponentType<Record<string, any>>;
