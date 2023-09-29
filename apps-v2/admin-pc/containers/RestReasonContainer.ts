import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import * as restReason from '../actions/restReason';

import RestReason from '../presentational-components/RestReason';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchRestReason: state.searchRestReason,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: restReason.createRestReason,
    update: restReason.updateRestReason,
    delete: restReason.deleteRestReason,
    search: restReason.searchRestReason,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, restReason), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestReason);
