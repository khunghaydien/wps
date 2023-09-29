import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import * as allowance from '../actions/allowance';

import Allowance from '../presentational-components/Allowance';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchAllowance: state.searchAllowance,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: allowance.createAllowance,
    update: allowance.updateAllowance,
    delete: allowance.deleteAllowance,
    search: allowance.searchAllowance,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, allowance), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Allowance);
