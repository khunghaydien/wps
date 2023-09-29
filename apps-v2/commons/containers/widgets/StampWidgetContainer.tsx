import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import useOnResume from '@apps/commons/hooks/useOnResume';

import * as stampWidgetActions from '../../action-dispatchers/StampWidget';

import $StampWidget from '../../components/widgets/StampWidget';

const mapStateToProps = (state, ownProps) => ({
  loading: !!state.common.app.loadingDepth,
  language: state.common.userSetting.language, // NOTE: 言語適用タイミングの検知
  isEnableStartStamp: state.common.stampWidget.isEnableStartStamp,
  isEnableEndStamp: state.common.stampWidget.isEnableEndStamp,
  isEnableRestartStamp: state.common.stampWidget.isEnableRestartStamp,
  mode: state.common.stampWidget.mode,
  message: state.common.stampWidget.message,
  className: ownProps.className,
});

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      reload: stampWidgetActions.initDailyStampTime,
      onDidMount:
        ownProps.onDidMount !== undefined
          ? ownProps.onDidMount
          : stampWidgetActions.initDailyStampTime,
      onClickStampButton: (stampWidget) =>
        stampWidgetActions.submitStamp(stampWidget, {
          withGlobalLoading: ownProps.withGlobalLoading,
          onStampSuccess: ownProps.onStampSuccess,
        }),
      onChangeMessage: (message) => stampWidgetActions.updateMessage(message),
      onClickModeButton: (clockType) =>
        stampWidgetActions.switchClockType(clockType),
    },
    dispatch
  );
}

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickStampButton: () => dispatchProps.onClickStampButton(stateProps),
});

const StampWidget = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(
  (
    props: React.ComponentProps<typeof $StampWidget> & {
      loading: boolean;
      reload: () => Promise<void>;
    }
  ) => {
    const { loading, reload } = props;
    const handler = React.useCallback(() => {
      if (loading) {
        return;
      }
      return reload();
    }, [loading, reload]);
    useOnResume(handler);
    return <$StampWidget {...props} />;
  }
);

export default StampWidget;
