import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as dailyAllowanceSelectors } from '../modules/entities/dailyallowance/index';

import { actions as appActions } from '../action-dispatchers/app';

import App from '../components/App';

function mapStateToProps(state) {
  return {
    language: state.common.userSetting.language,
    period: state.entities.dailyallowance.period,
    ownerInfos: state.entities.dailyallowance.employeeInfoList,
    dailyRecordList: dailyAllowanceSelectors.dailyRecordListSelector(state),
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
