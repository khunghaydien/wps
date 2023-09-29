import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as appActions } from '../action-dispatchers/app';

import App from '../components/App';

function mapStateToProps(state) {
  return {
    language: state.common.userSetting.language,
    period: state.entities.dailyObjectivelyEvnetLog.period,
    ownerInfos: state.entities.dailyObjectivelyEvnetLog.employeeInfoList,
    dailyRecordList: state.entities.dailyObjectivelyEvnetLog.dailyRecordList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClickPrintButton: bindActionCreators(
      appActions.openPrintDialog,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
