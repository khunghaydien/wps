import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getPlannerSetting,
  openAuthWindow,
  openRemoteSiteSettingWindow,
} from '../../actions/plannerSetting';

import { State } from '../../reducers';

import AuthStatusField from '../../presentational-components/PlannerSetting/ExternalCalenderAccess/AuthStatusField';

type OwnProps = Pick<
  React.ComponentProps<typeof AuthStatusField>,
  'isEditing' | 'authStatus'
>;

const mapStateToProps = (state: State) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onCloseChildWindow: (companyId) => (thunkDispatch) => {
        return thunkDispatch(getPlannerSetting({ companyId }));
      },
      onClickAuthButton: openAuthWindow,
      onClickRemoteSiteSettingButton: openRemoteSiteSettingWindow,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps, ownProps: OwnProps) => ({
  ...ownProps,
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
)(AuthStatusField);
