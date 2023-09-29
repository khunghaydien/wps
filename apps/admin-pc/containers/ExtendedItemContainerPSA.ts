import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as extendedItem from '../actions/extendedItemPSA';

import ExtendedItemPSA from '../presentational-components/ExtendedItemPSA';

const mapStateToProps = (state) => ({
  searchExtendedItem: state.searchExtendedItemPSA,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const alias = {
    create: extendedItem.createExtendedItem(ownProps.objectType),
    update: extendedItem.updateExtendedItem(ownProps.objectType),
    delete: extendedItem.deleteExtendedItem(ownProps.objectType),
    search: extendedItem.searchExtendedItem,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, extendedItem), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtendedItemPSA);
