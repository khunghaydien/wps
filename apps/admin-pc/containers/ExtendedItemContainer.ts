import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as extendedItem from '../actions/extendedItem';
import { searchExtendedItemCustom } from '../actions/extendedItemCustom';

import ExtendedItem from '../presentational-components/ExtendedItem';

const mapStateToProps = (state) => {
  return {
    searchExtendedItem: state.searchExtendedItem,
    searchExtendedItemCustom: state.searchExtendedItemCustom,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: extendedItem.createExtendedItem,
    update: extendedItem.updateExtendedItem,
    delete: extendedItem.deleteExtendedItem,
    search: extendedItem.searchExtendedItem,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, extendedItem, { searchExtendedItemCustom }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtendedItem);
