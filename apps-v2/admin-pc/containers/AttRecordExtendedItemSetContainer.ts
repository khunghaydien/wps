import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import { searchAttExtendedItem } from '../actions/attExtendedItem';
import * as recordExtendedItemSet from '../actions/attRecordExtendedItemSet';

import RecordExtendedItemSet from '../presentational-components/AttRecordExtendedItemSet';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchRecordExtendedItemSet: state.searchRecordExtendedItemSet,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: recordExtendedItemSet.createRecordExtendedItemSet,
    update: recordExtendedItemSet.updateRecordExtendedItemSet,
    delete: recordExtendedItemSet.deleteRecordExtendedItemSet,
    search: recordExtendedItemSet.searchRecordExtendedItemSet,
  };

  const actions = bindActionCreators(
    pickBy(
      Object.assign({}, alias, recordExtendedItemSet, {
        searchAttExtendedItem,
      }),
      isFunction
    ),
    dispatch
  );

  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordExtendedItemSet);
