import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as appSelectors } from '../modules/app';
import { AppDispatch } from '../modules/AppThunk';

import { clearError } from '../actions/app';

import Global, { Props } from '../components/Global';

const mapStateToProps = (state) => ({
  loading: appSelectors.loadingSelector(state),
  loadingHint: state.common.app.loadingHint,
  isLoadingTargeted: appSelectors.loadingAreaSelector(state),
  error: state.common.app.error,
  unexpectedError: state.common.app.unexpectedError,
  confirmDialog: state.common.app.confirmDialog,
  dialog: state.common.dialog,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  ...bindActionCreators(
    {
      handleCloseErrorDialog: clearError,
    },
    dispatch
  ),
});

const mergeProps = (
  stateProps: any,
  dispatchProps: any,
  ownProps: any
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  confirmDialog:
    stateProps.confirmDialog !== undefined && stateProps.confirmDialog !== null
      ? {
          ...stateProps.confirmDialog,
          handleClickOkButton: () => stateProps.confirmDialog.callback(true),
          handleClickCancelButton: () =>
            stateProps.confirmDialog.callback(false),
        }
      : null,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Global) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
