import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as leave from '../actions/leave';

import Leave from '../presentational-components/Leave';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchLeave: state.searchLeave,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: leave.createLeave,
    update: leave.updateLeave,
    delete: leave.deleteLeave,
    search: leave.searchLeave,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, leave), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leave);
