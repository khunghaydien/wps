import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { searchExpTypeGroup } from '../actions/expTypeGroup';
import * as taxType from '../actions/taxType';

import TaxType from '../presentational-components/TaxType';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchTaxType: state.searchTaxType,
    value2msgkey: state.value2msgkey,
    searchExpTypeGroup: state.searchExpTypeGroup,
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
      Object.assign({}, alias, taxType, {
        searchExpTypeGroup,
      }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaxType);
