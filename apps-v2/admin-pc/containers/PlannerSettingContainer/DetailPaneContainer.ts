import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as entityActions } from '../../modules/plannerSetting/entities/plannerSetting';
import { actions as uiActions } from '../../modules/plannerSetting/ui/plannerSetting';

import DetailPane from '../../presentational-components/PlannerSetting/DetailPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  mode: state.plannerSetting.ui.plannerSetting ? 'edit' : '',
  plannerSetting:
    state.plannerSetting.ui.plannerSetting ||
    state.plannerSetting.entities.plannerSetting,
  sfObjFieldValues: state.sfObjFieldValues,
  getOrganizationSetting: state.getOrganizationSetting,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onClickEditButton: uiActions.startEditing,
      onClickCancelEditButton: uiActions.cancelEditing,
      onUpdateDetailItemValue: uiActions.update,
      onClickUpdateButton: uiActions.save,
      onUpdateSuccess: (companyId) => (thunkDispatch) => {
        return thunkDispatch(entityActions.fetch(companyId));
      },
      onCloseChildWindow: (companyId) => (thunkDispatch) => {
        return thunkDispatch(entityActions.fetch(companyId));
      },
      onClickAuthButton: uiActions.openAuthWindow,
      onClickRemoteSiteSettingButton: uiActions.openRemoteSiteSettingWindow,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickEditButton: () =>
    dispatchProps.onClickEditButton(stateProps.plannerSetting),
  onClickUpdateButton: () =>
    dispatchProps.onClickUpdateButton(
      stateProps.companyId,
      stateProps.plannerSetting,
      () => dispatchProps.onUpdateSuccess(stateProps.companyId)
    ),
  onClickAuthButton: () =>
    dispatchProps.onClickAuthButton(stateProps.companyId, () =>
      dispatchProps.onCloseChildWindow(stateProps.companyId)
    ),
  onClickRemoteSiteSettingButton: () =>
    dispatchProps.onClickRemoteSiteSettingButton(() =>
      dispatchProps.onCloseChildWindow(stateProps.companyId)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane);
