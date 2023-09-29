import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { searchCountry } from '../actions/country';
import * as taxType from '../actions/taxType';

import { Props as OwnProps } from '../components/Admin/ContentsSelector';
import CountryDefaultTaxType, {
  Props,
} from '../presentational-components/CountryDefaultTaxType';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchTaxType: state.searchTaxType,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: taxType.createTaxType,
    update: taxType.updateTaxType,
    delete: taxType.deleteTaxType,
    search: taxType.searchTaxType,
    createHistory: taxType.createHistoryTaxType,
    searchHistory: taxType.searchHistoryTaxType,
    updateHistory: taxType.updateHistoryTaxType,
    deleteHistory: taxType.deleteHistoryTaxType,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, { searchCountry }, taxType),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryDefaultTaxType) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
