import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as currency from '../actions/currency';

import { Props as OwnProps } from '../components/Admin/ContentsSelector';
import Currency, { Props } from '../presentational-components/Currency';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchCurrency: state.searchCurrency,
    searchIsoCurrencyCode: state.searchIsoCurrencyCode,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: currency.createCurrency,
    update: currency.updateCurrency,
    delete: currency.deleteCurrency,
    search: currency.searchCurrency,
    searchIsoCode: currency.searchIsoCurrencyCode,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, currency), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
