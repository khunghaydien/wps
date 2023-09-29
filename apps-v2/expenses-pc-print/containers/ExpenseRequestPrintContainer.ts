import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import lifecycle from '../../mobile-app/concerns/lifecycle';

import { compose } from '../../commons/utils/FnUtil';

import { State } from '../modules';

import * as appActions from '../action-dispatchers/App';

import App from '../components';

const mapStateToProps = (state: State, _ownProps) => ({
  report: state.entities.report,
  userSetting: state.userSetting,
  selectedReportType: state.entities.reportTypeList.filter(
    (rt) => rt.id === state.entities.report.expReportTypeId
  )[0],
});

const mapDispatchToProps = {
  onClickPrintButton: appActions.openPrintDialog,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount: (dispatch: Dispatch<any>, _props) => {
      dispatch(appActions.initialize());
    },
  })
)(App) as React.ComponentType<Record<string, any>>;
