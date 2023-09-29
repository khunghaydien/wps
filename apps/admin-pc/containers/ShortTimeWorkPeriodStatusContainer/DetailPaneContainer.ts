import { connect } from 'react-redux';

import {
  actions as selectionUIActions,
  selectors as selectionUISelectors,
} from '../../modules/adminCommon/employeeSelection/ui/selection';
import { actions as editingEntryUIActions } from '../../modules/shortTimeWorkPeriodStatus/ui/editingEntryPeriodStatus';
import { actions as editingUpdateUIActions } from '../../modules/shortTimeWorkPeriodStatus/ui/editingUpdatePeriodStatus';

import DetailPane from '../../presentational-components/ShortTimeWorkPeriodStatus/DetailPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  targetEmployee: selectionUISelectors.selectSelectedEmployee(state),
  shortTimeWorkPeriodStatusList:
    state.shortTimeWorkPeriodStatus.entities.shortTimeWorkPeriodStatusList,
  editingShortTimeWorkPeriodStatus:
    state.shortTimeWorkPeriodStatus.ui.editingEntryPeriodStatus,
});

const mapDispatchToProps = (dispatch) => ({
  onClickCloseButton: () => {
    dispatch(editingEntryUIActions.clear());
    dispatch(selectionUIActions.clear());
  },
  onUpdateEntryFormValue: (stateProps, key, value) => {
    dispatch(editingEntryUIActions.update(key, value));

    // NOTE: 開始日の入力値が更新された場合に有効な短時間勤務設定を取得しなおす
    if (
      key === 'validDateFrom' &&
      value !== stateProps.editingShortTimeWorkPeriodStatus.validDateFrom
    ) {
      if (value.match(/\d{4}-\d{2}-\d{2}/)) {
        dispatch(
          editingEntryUIActions.fetchShortTimeWorkSettingList({
            companyId: stateProps.companyId,
            employeeId: stateProps.targetEmployee.id,
            targetDate: value,
          })
        );
      } else {
        dispatch(editingEntryUIActions.clearShortTimeWorkSettingList());
      }
    }
  },
  onSubmitEntryForm: (stateProps) =>
    dispatch(
      editingEntryUIActions.save(
        stateProps.targetEmployee.id,
        stateProps.editingShortTimeWorkPeriodStatus
      )
    ),
  onClickEditHistoryButton: (stateProps, periodStatus) =>
    dispatch(
      editingUpdateUIActions.initialize(
        periodStatus,
        stateProps.companyId,
        stateProps.targetEmployee.id
      )
    ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onUpdateEntryFormValue: (key, value) =>
    dispatchProps.onUpdateEntryFormValue(stateProps, key, value),
  onSubmitEntryForm: () =>
    dispatchProps.onSubmitEntryForm(stateProps, dispatchProps),
  onClickEditHistoryButton: (periodStatus) =>
    dispatchProps.onClickEditHistoryButton(stateProps, periodStatus),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane);
