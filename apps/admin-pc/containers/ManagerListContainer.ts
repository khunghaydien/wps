import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as managerListActions from '../actions/managerList';

import ManagerList from '../presentational-components/ManagerList';

const mapStateToProps = (state) => ({
  itemList: state.searchManagerList,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: managerListActions.searchManagerList,
      create: managerListActions.createManagerList,
      update: managerListActions.updateManagerList,
      delete: managerListActions.deletehManagerList,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerList) as React.ComponentType<Record<string, any>>;
