import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isFunction, pickBy } from 'lodash';

import * as customHint from '../actions/customHint';

import CustomHint from '../presentational-components/CustomHintPsa';

const mapStateToProps = (state) => ({
  tmpEditRecord: state.tmpEditRecord,
  searchCustomHint: state.searchCustomHint,
});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    update: customHint.updateCustomHint,
    search: customHint.searchCustomHint,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, customHint), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHint);
