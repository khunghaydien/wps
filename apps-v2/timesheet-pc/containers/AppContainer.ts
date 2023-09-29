import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../modules';

import {
  onChangeApproverEmployee,
  switchProxyEmployee,
} from '../action-dispatchers/App';

import App from '../components/App';

const mapStateToProps = (state: State) => ({
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  userPermission: state.common.accessControl.permission,

  // Note: These props are used in props merge
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  proxyEmployee: state.common.proxyEmployeeInfo,
  userSetting: state.common.userSetting,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onDecideProxyEmployee: switchProxyEmployee,
      onChangeApproverEmployee,
    },
    dispatch
  );

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps
) => ({
  ...stateProps,
  ...dispatchProps,
  onDecideProxyEmployee: (targetEmployee) =>
    dispatchProps.onDecideProxyEmployee(
      stateProps.selectedPeriodStartDate,
      targetEmployee,
      stateProps.userPermission,
      stateProps.userSetting
    ),
  onChangeApproverEmployee: () => {
    if (stateProps.proxyEmployee && stateProps.proxyEmployee.id) {
      return;
    }
    dispatchProps.onChangeApproverEmployee(stateProps.selectedPeriodStartDate);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(App) as React.ComponentType<Record<string, unknown>>;
