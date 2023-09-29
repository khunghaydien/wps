import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as appActions } from '../action-dispatchers/app';

import App from '../components/App';

function mapStateToProps(state) {
  return {
    language: state.common.userSetting.language,
    period: state.entities.dailyrest.period,
    ownerInfos: state.entities.dailyrest.employeeInfoList,
    dailyRestList: state.entities.dailyrest.dailyRestList,
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
