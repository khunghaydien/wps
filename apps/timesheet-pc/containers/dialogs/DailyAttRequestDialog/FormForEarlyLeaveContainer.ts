import { connect } from 'react-redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/earlyLeaveRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForEarlyLeave';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const targetDate =
    state.ui.dailyRequest.requests.earlyLeaveRequest.request.startDate;
  const attRecord = state.entities.timesheet.attRecordList.find(
    (record) => record.recordDate === targetDate
  );
  return {
    ...ownProps,
    isLeavingOffice: attRecord && attRecord.endTime !== null,
    targetRequest: state.ui.dailyRequest.requests.earlyLeaveRequest.request,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
