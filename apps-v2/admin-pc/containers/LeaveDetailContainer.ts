import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import { searchLeave } from '../actions/leave';
import * as leaveDetail from '../actions/leaveDetail';

import LeaveDetail from '../presentational-components/LeaveDetail';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchLeaveDetail: state.searchLeaveDetail,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: leaveDetail.createLeaveDetail,
    update: leaveDetail.updateLeaveDetail,
    delete: leaveDetail.deleteLeaveDetail,
    search: leaveDetail.searchLeaveDetail,
  };

  const actions = bindActionCreators(
    pickBy(
      Object.assign({}, alias, leaveDetail, {
        searchLeave,
      }),
      isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaveDetail);
