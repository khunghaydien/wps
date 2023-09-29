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
  const earlyLeaveReasonList =
    state.ui.dailyRequest.requests.earlyLeaveRequest.earlyLeaveReasonList;
  const selectedEarlyLeaveReason =
    state.ui.dailyRequest.requests.earlyLeaveRequest.selectedEarlyLeaveReason;
  return {
    ...ownProps,
    isLeavingOffice: attRecord && attRecord.endTime !== null,
    targetRequest: state.ui.dailyRequest.requests.earlyLeaveRequest.request,
    isFlexWithoutCoreNoWorkingTime:
      attRecord &&
      attRecord.isFlexWithoutCore &&
      (attRecord.startTime === null || attRecord.endTime === null),
    isFlexWithoutCore: attRecord && attRecord.isFlexWithoutCore,
    personalReasonEarlyLeaveEndTime:
      attRecord && attRecord.personalReasonEarlyLeaveEndTime,
    objectiveReasonEarlyLeaveEndTime:
      attRecord && attRecord.objectiveReasonEarlyLeaveEndTime,
    earlyLeaveReasonList,
    selectedEarlyLeaveReason,
  };
};

const mapDispatchToProps = {
  onUpdateValue: actions.update,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
