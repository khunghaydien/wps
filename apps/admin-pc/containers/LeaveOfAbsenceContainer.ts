import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as leaveOfAbsence from '../actions/leaveOfAbsence';

import LeaveOfAbsence from '../presentational-components/LeaveOfAbsence';

const mapStateToProps = (state) => ({
  itemList: state.searchLeaveOfAbsence,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      search: leaveOfAbsence.searchLeaveOfAbsence,
      create: leaveOfAbsence.createLeaveOfAbsence,
      update: leaveOfAbsence.updateLeaveOfAbsence,
      delete: leaveOfAbsence.deleteLeaveOfAbsence,
      getConstantsLeaveOfAbsence: leaveOfAbsence.getConstantsLeaveOfAbsence,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveOfAbsence);
