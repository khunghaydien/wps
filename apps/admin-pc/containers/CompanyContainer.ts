import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as company from '../actions/company';
import { searchCountry } from '../actions/country';

import Company from '../presentational-components/Company';

const mapStateToProps = (state) => {
  return {
    searchCompany: state.searchCompany,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: company.createCompany,
    update: company.updateCompany,
    delete: company.deleteCompany,
    search: company.searchCompany,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, { searchCountry }, company),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
