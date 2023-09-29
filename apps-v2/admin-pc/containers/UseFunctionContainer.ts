import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { updateCompany } from '../actions/company';

import UseFunction from '../presentational-components/UseFunction';

const mapStateToProps = (state) => {
  return {
    searchCompany: state.searchCompany,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    update: updateCompany,
    search: () => {},
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, { updateCompany }), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(UseFunction);
