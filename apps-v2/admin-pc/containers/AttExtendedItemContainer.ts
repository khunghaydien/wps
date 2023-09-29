import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as attExtendedItem from '../actions/attExtendedItem';

import AttExtendedItem from '../presentational-components/AttExtendedItem';

const mapStateToProps = (state) => {
  return {
    searchAttExtendedItem: state.searchAttExtendedItem,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: attExtendedItem.createAttExtendedItem,
    update: attExtendedItem.updateAttExtendedItem,
    delete: attExtendedItem.deleteAttExtendedItem,
    search: attExtendedItem.searchAttExtendedItem,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, attExtendedItem), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(AttExtendedItem);
