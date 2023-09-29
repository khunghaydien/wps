import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { State } from '../../modules';
import { isTimesheetReadOnly } from '../../modules/selectors';
import { actions as editingDailyRemarksActions } from '../../modules/ui/editingDailyRemarks';

import * as DailyRemarksActions from '../../action-dispatchers/DailyRemarks';

import DailyRemarksDialog from '../../components/dialogs/DailyRemarksDialog';

const mapStateToProps = (state: State) => ({
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  dailyRemarks: state.ui.editingDailyRemarks,
  isReadOnly: isTimesheetReadOnly(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onUpdateValue: editingDailyRemarksActions.update,
      onSubmit: DailyRemarksActions.save,
      onCancel: DailyRemarksActions.hideDialog,
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
      stateProps.dailyRemarks,
      stateProps.selectedPeriodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DailyRemarksDialog);
