import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from '@apps/admin-pc/modules/resourceGroupMemberLinkConfig/ui';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import { searchPSAGroup } from '../actions/psaGroup';
import * as resourceGroupActions from '../actions/resourceGroup';

import ResourceGroup from '../presentational-components/ResourceGroup';

const mapStateToProps = (state) => ({
  itemList: state.searchResourceGroup,
  searchPSAGroup: state.searchPSAGroup,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: resourceGroupActions.searchResourceGroup,
      create: resourceGroupActions.createResourceGroup,
      update: resourceGroupActions.updateResourceGroup,
      delete: resourceGroupActions.deletehResourceGroup,
      searchPSAGroup,
      cleanOwners: actions.cleanSelectedEmployeeMember,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceGroup) as React.ComponentType<Record<string, any>>;
