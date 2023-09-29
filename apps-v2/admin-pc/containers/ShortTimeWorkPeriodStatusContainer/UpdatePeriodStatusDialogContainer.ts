import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as selectionUISelectors } from '../../modules/adminCommon/employeeSelection/ui/selection';
import { actions as shortTimeWorkPeriodStatusListActions } from '../../modules/shortTimeWorkPeriodStatus/entities/shortTimeWorkPeriodStatusList';
import { actions as editingUIActions } from '../../modules/shortTimeWorkPeriodStatus/ui/editingUpdatePeriodStatus';

import UpdatePeriodStatusDialog from '../../presentational-components/ShortTimeWorkPeriodStatus/UpdatePeriodStatusDialog';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  targetEmployee: selectionUISelectors.selectSelectedEmployee(state),
  editingShortTimeWorkPeriodStatus:
    state.shortTimeWorkPeriodStatus.ui.editingUpdatePeriodStatus,
});

const mapDispatchToProps = (dispatch) => ({
  onCancel: bindActionCreators(editingUIActions.unset, dispatch),
  onUpdateValue: (stateProps, key, value) => {
    dispatch(editingUIActions.update(key, value));

    // NOTE: 開始日の入力値が更新された場合に有効な短時間勤務設定を取得しなおす
    if (
      key === 'validDateFrom' &&
      value !== stateProps.editingShortTimeWorkPeriodStatus.validDateFrom
    ) {
      if (value.match(/\d{4}-\d{2}-\d{2}/)) {
        dispatch(
          editingUIActions.fetchShortTimeWorkSettingList({
            companyId: stateProps.companyId,
            targetDate: value,
          })
        );
      } else {
        dispatch(editingUIActions.clearShortTimeWorkSettingList());
      }
    }
  },
  onSubmit: (stateProps, dispatchProps) =>
    dispatch(
      editingUIActions.save(
        stateProps.targetEmployee.id,
        stateProps.editingShortTimeWorkPeriodStatus,
        () => dispatchProps.onExecutionSuccess(stateProps)
      )
    ),
  onClickDeleteButton: (stateProps, dispatchProps) =>
    dispatch(
      editingUIActions.delete(stateProps.editingShortTimeWorkPeriodStatus, () =>
        dispatchProps.onExecutionSuccess(stateProps)
      )
    ),
  onExecutionSuccess: (stateProps) =>
    dispatch(
      shortTimeWorkPeriodStatusListActions.fetch(stateProps.targetEmployee.id)
    ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onUpdateValue: (key, value) =>
    dispatchProps.onUpdateValue(stateProps, key, value),
  onSubmit: () => dispatchProps.onSubmit(stateProps, dispatchProps),
  onClickDeleteButton: () =>
    dispatchProps.onClickDeleteButton(stateProps, dispatchProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UpdatePeriodStatusDialog);
