import { connect } from 'react-redux';
import { compose } from 'redux';

import { State } from '../../../modules';
import { actions } from '../../../modules/ui/dailyRequest/requests/lateArrivalRequest';

import Component from '../../../components/dialogs/DailyAttRequestDialog/FormForLateArrival';

type OwnProps = {
  isReadOnly: boolean;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const targetDate =
    state.ui.dailyRequest.requests.lateArrivalRequest.request.startDate;
  const attRecord = state.entities.timesheet.attRecordList.find(
    (record) => record.recordDate === targetDate
  );
  return {
    ...ownProps,
    isBeforeWorking: !attRecord || attRecord.startTime === null,
    targetRequest: state.ui.dailyRequest.requests.lateArrivalRequest.request,
    lateArrivalReasonList:
      state.ui.dailyRequest.requests.lateArrivalRequest.lateArrivalReasonList,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Component);
