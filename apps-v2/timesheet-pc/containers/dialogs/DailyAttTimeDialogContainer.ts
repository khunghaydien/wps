import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../modules';
import { isTimesheetReadOnly } from '../../modules/selectors';
import { actions as editingDailyAttTimeActions } from '../../modules/ui/editingDailyAttTime';

import * as DailyAttTimeActions from '../../action-dispatchers/DailyAttTime';

import DailyAttTimeDialog from '../../components/dialogs/DailyAttTimeDialog';

const mapStateToProps = (state: State) => ({
  isLoading: !!state.common.app.loadingDepth,
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  userPermission: state.common.accessControl.permission,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  dailyAttTime: state.ui.editingDailyAttTime,
  isReadOnly: isTimesheetReadOnly(state),
  userSetting: state.common.userSetting,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onUpdateClockTime: editingDailyAttTimeActions.update,
      onUpdateRestTime: editingDailyAttTimeActions.updateRestTime,
      onAddRestTime: editingDailyAttTimeActions.addRestTime,
      onDeleteRestTime: editingDailyAttTimeActions.deleteRestTime,
      onSubmit: DailyAttTimeActions.save,
      onCancel: DailyAttTimeActions.hideDialog,
    },
    dispatch
  );

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmit: () => {
    dispatchProps.onSubmit(
      stateProps.dailyAttTime,
      stateProps.selectedPeriodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null,
      stateProps.userPermission,
      stateProps.userSetting
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DailyAttTimeDialog);
