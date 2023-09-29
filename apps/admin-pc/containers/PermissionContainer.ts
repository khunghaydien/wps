import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import {
  createPermission,
  deletePermission,
  searchPermission,
  updatePermission,
} from '../actions/permission';

import { State } from '../reducers';

import Permission from '../presentational-components/Permission';

const mapStateToProps = (state: State) => ({
  searchPermission: state.searchPermission,
});

const mapDispatchToProps = (dispatch: AppDispatch) => {
  const alias = {
    create: createPermission,
    update: updatePermission,
    delete: deletePermission,
    search: searchPermission,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, { searchPermission }), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Permission) as React.ComponentType<Record<string, any>>;
