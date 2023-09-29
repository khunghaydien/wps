import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../modules';
import { selectors as summarySelectors } from '../modules/entities/summary';

import * as appActions from '../action-dispatchers/App';
import * as TimesheetSummaryActions from '../action-dispatchers/TimesheetSummary';

import App from '../components/App';

function mapStateToProps(state: State) {
  return {
    language: state.common.userSetting.language,
    periodStartDate: summarySelectors.periodStartDateSelector(state),
    closingDate: summarySelectors.closingDateSelector(state),
    summaryName: state.entities.summary.name,
    status: state.entities.summary.status,
    ownerInfos: state.entities.summary.ownerInfos,
    workingType: state.entities.summary.workingType,
    records: state.entities.summary.records,
    recordTotal: state.entities.summary.recordTotal,
    summaries: state.entities.summary.summaries,
    dividedSummaries: state.entities.summary.dividedSummaries,
    targetEmployeeId: state.entities.summary.targetEmployeeId,
    masked: state.entities.summary.masked,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickPrintButton: bindActionCreators(
      appActions.openPrintDialog,
      dispatch
    ),
    onRequestOpenAllowanceWindow: bindActionCreators(
      TimesheetSummaryActions.openAllowanceWindow,
      dispatch
    ),
    onRequestOpenObjectivelyEventLogWindow: bindActionCreators(
      TimesheetSummaryActions.OpenObjectivelyEventLogWindow,
      dispatch
    ),
    onRequestOpenRestReasonWindow: bindActionCreators(
      TimesheetSummaryActions.openRestReasonWindow,
      dispatch
    ),
  };
}

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  onRequestOpenAllowanceWindow: () => {
    dispatchProps.onRequestOpenAllowanceWindow(
      stateProps.periodStartDate,
      stateProps.closingDate,
      stateProps.targetEmployeeId ? stateProps.targetEmployeeId : null
    );
  },
  onRequestOpenObjectivelyEventLogWindow: () => {
    dispatchProps.onRequestOpenObjectivelyEventLogWindow(
      stateProps.periodStartDate,
      stateProps.closingDate,
      stateProps.targetEmployeeId ? stateProps.targetEmployeeId : null
    );
  },
  onRequestOpenRestReasonWindow: () => {
    dispatchProps.onRequestOpenRestReasonWindow(
      stateProps.periodStartDate,
      stateProps.closingDate,
      stateProps.targetEmployeeId ? stateProps.targetEmployeeId : null
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
