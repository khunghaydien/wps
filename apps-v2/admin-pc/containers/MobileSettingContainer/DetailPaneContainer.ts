import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as entityActions } from '../../modules/mobileSetting/entities';
import { actions as uiActions } from '../../modules/mobileSetting/ui';

import DetailPane from '../../presentational-components/MobileSetting/DetailPane';

const mapStateToProps = (state) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  mode: state.mobileSetting.ui ? 'edit' : '',
  mobileSetting: state.mobileSetting.ui || state.mobileSetting.entities,
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
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickEditButton: () =>
    dispatchProps.onClickEditButton(stateProps.mobileSetting),
  onClickUpdateButton: () =>
    dispatchProps.onClickUpdateButton(
      stateProps.companyId,
      stateProps.mobileSetting,
      () => dispatchProps.onUpdateSuccess(stateProps.companyId)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane);
