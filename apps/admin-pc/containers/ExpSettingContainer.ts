import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as company from '../actions/company';
import { searchCurrency } from '../actions/currency';
import * as expSetting from '../actions/expSetting';

import ExpSetting from '../presentational-components/ExpSetting';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchExpSetting: state.searchCompany,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    update: company.updateCompany,
    search: company.searchCompany,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, { searchCurrency }, company, expSetting),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpSetting);
