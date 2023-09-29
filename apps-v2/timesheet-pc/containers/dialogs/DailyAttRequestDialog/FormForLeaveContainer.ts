import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/leaveRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForLeave';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    targetRequest: state.ui.dailyRequest.requests.leaveRequest.request,
    attLeaveList: state.ui.dailyRequest.requests.leaveRequest.attLeaveList,
    selectedAttLeave:
      state.ui.dailyRequest.requests.leaveRequest.selectedAttLeave,
    hasRange: state.ui.dailyRequest.requests.leaveRequest.hasRange,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
  onUpdateHasRange: actions.updateHasRange,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
