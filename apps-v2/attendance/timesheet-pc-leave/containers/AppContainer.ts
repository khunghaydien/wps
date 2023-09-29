import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as appActions } from '../modules/app';
import { selectors as leaveInfoSelectors } from '../modules/entities/leaveInfo/index';

import App from '../components/App';

function mapStateToProps(state) {
  return {
    language: state.common.userSetting.language,
    period: state.entities.leaveInfo.period,
    ownerInfos: state.entities.leaveInfo.employeeInfoList,
    leaveDetails: leaveInfoSelectors.leaveDetailsSelector(state),
    annualLeave: state.entities.leaveInfo.annualLeave,
    paidManagedLeave: state.entities.leaveInfo.paidManagedLeave,
    unpaidManagedLeave: state.entities.leaveInfo.unpaidManagedLeave,
    compensatoryLeave: state.entities.leaveInfo.compensatoryLeave,
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
