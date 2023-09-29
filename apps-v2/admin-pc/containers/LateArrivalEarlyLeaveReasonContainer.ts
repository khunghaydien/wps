import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import * as lateArrivalEarlyLeaveReason from '../actions/lateArrivalEarlyLeaveReason';

import LateArrivalEarlyLeaveReason from '../presentational-components/LateArrivalEarlyLeaveReason';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchLateArrivalEarlyLeaveReason: state.searchLateArrivalEarlyLeaveReason,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: lateArrivalEarlyLeaveReason.createLateArrivalEarlyLeaveReason,
    update: lateArrivalEarlyLeaveReason.updateLateArrivalEarlyLeaveReason,
    delete: lateArrivalEarlyLeaveReason.deleteLateArrivalEarlyLeaveReason,
    search: lateArrivalEarlyLeaveReason.searchLateArrivalEarlyLeaveReason,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, lateArrivalEarlyLeaveReason), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LateArrivalEarlyLeaveReason);
