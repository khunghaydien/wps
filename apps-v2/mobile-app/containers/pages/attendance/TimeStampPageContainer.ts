import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import lifecycle from '../../../concerns/lifecycle';
import onResume from '../../../concerns/onResume';

import { CLOCK_TYPE } from '../../../../domain/models/attendance/DailyStampTime';
import { LOCATION_FETCH_STATUS } from '../../../../domain/models/Location';

import { State } from '../../../modules';
import { actions as uiActions } from '../../../modules/attendance/timeStamp/ui';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import {
  initialize,
  onToggleSendLocation,
  pushCommuteCount,
  stamp,
} from '../../../action-dispatchers/attendance/timeStamp';

import TimeStampPage from '../../../components/pages/attendance/TimeStampPage';

const mapStateToProps = (state: State) => ({
  timeLocale: state.userSetting.language,

  showLocationToggleButton:
    state.attendance.mobileSetting.requireLocationAtMobileStamp,
  willSendLocation: state.attendance.timeStamp.ui.willSendLocation,
  useManageCommuteCount: state.attendance.mobileSetting.useManageCommuteCount,

  fetchStatus: state.mobileCommons.location.fetchStatus,
  locationFetchTime: state.mobileCommons.location.fetchTime,
  latitude: state.mobileCommons.location.latitude,
  longitude: state.mobileCommons.location.longitude,

  comment: state.attendance.timeStamp.ui.comment,

  commuteForwardCount: state.attendance.timeStamp.ui.commuteForwardCount,
  commuteBackwardCount: state.attendance.timeStamp.ui.commuteBackwardCount,

  enabledResume: !state.mobileCommons.error.message,

  isEnableStartStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableStartStamp,
  isEnableEndStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableEndStamp,
  isEnableRestartStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableRestartStamp,
  defaultAction:
    state.attendance.timeStamp.entities.dailyStampTime.defaultAction,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  ...bindActionCreators(
    {
      onClickStartStampButton: stamp,
      onClickEndStampButton: stamp,
      onChangeCommentField: uiActions.editComment,
      onChangeCommuteCount: pushCommuteCount,
      onClickToggleButton: onToggleSendLocation,
      onClickRefresh: initialize,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickRefresh: () => {
    dispatchProps.onClickRefresh(stateProps.willSendLocation);
  },
  onClickStartStampButton: () =>
    dispatchProps.onClickStartStampButton(
      {
        mode: stateProps.isEnableRestartStamp
          ? CLOCK_TYPE.CLOCK_REIN
          : CLOCK_TYPE.CLOCK_IN,
        comment: stateProps.comment,
        latitude:
          stateProps.showLocationToggleButton && stateProps.willSendLocation
            ? stateProps.latitude // $FlowFixMe
            : null,
        longitude:
          stateProps.showLocationToggleButton && stateProps.willSendLocation
            ? stateProps.longitude // $FlowFixMe
            : null,
        commuteForwardCount: stateProps.commuteForwardCount,
        commuteBackwardCount: stateProps.commuteBackwardCount,
      },
      stateProps.showLocationToggleButton,
      stateProps.willSendLocation,
      stateProps.showLocationToggleButton &&
        stateProps.fetchStatus === LOCATION_FETCH_STATUS.Success,
      stateProps.useManageCommuteCount
    ),
  onClickEndStampButton: () =>
    dispatchProps.onClickEndStampButton(
      {
        mode: CLOCK_TYPE.CLOCK_OUT,
        comment: stateProps.comment,
        latitude:
          stateProps.showLocationToggleButton && stateProps.willSendLocation
            ? stateProps.latitude // $FlowFixMe v0.85
            : null,
        longitude:
          stateProps.showLocationToggleButton && stateProps.willSendLocation
            ? stateProps.longitude // $FlowFixMe v0.85
            : null,
        commuteForwardCount: stateProps.commuteForwardCount,
        commuteBackwardCount: stateProps.commuteBackwardCount,
      },
      stateProps.showLocationToggleButton,
      stateProps.willSendLocation,
      stateProps.showLocationToggleButton &&
        stateProps.fetchStatus === LOCATION_FETCH_STATUS.Success,
      stateProps.useManageCommuteCount
    ),
  onClickToggleButton: (isChecked: boolean) =>
    dispatchProps.onClickToggleButton(isChecked),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onResume(
    (
      dispatch: AppDispatch,
      props: { enabledResume: boolean; willSendLocation: boolean }
    ) => {
      if (props.enabledResume) {
        dispatch(initialize(props.willSendLocation));
      }
    }
  ),
  lifecycle({
    componentDidMount: (dispatch: AppDispatch) => {
      dispatch(initialize(true));
    },
  })
)(TimeStampPage);
