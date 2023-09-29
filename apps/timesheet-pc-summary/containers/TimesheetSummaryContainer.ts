import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../modules';
import { selectors as summarySelectors } from '../modules/entities/summary';

import * as appActions from '../action-dispatchers/App';

import App from '../components/App';

function mapStateToProps(state: State) {
  return {
    language: state.common.userSetting.language,
    summaryName: state.entities.summary.summaryName,
    status: state.entities.summary.status,
    departmentName: state.entities.summary.departmentName,
    workingTypeName: state.entities.summary.workingTypeName,
    employeeCode: state.entities.summary.employeeCode,
    employeeName: state.entities.summary.employeeName,
    records: summarySelectors.recordsSelector(state),
    attentions: summarySelectors.attentionsSelector(state),
    closingDate: summarySelectors.closingDateSelector(state),
    restTimeTotal: summarySelectors.restTimeTotalSelector(state),
    realWorkTimeTotal: summarySelectors.realWorkTimeTotalSelector(state),
    overTimeTotal: summarySelectors.overTimeTotalSelector(state),
    nightTimeTotal: summarySelectors.nightTimeTotalSelector(state),
    virtualWorkTimeTotal: summarySelectors.virtualWorkTimeTotalSelector(state),
    holidayWorkTimeTotal: summarySelectors.holidayWorkTimeTotalSelector(state),
    lostTimeTotal: summarySelectors.lostTimeTotalSelector(state),
    summaries: summarySelectors.summariesSelector(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickPrintButton: bindActionCreators(
      appActions.openPrintDialog,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
