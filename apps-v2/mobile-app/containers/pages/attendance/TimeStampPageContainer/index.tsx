import * as React from 'react';
import { connect, useSelector, useStore } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import lifecycle from '../../../../concerns/lifecycle';
import onResume from '../../../../concerns/onResume';

import { LOCATION_FETCH_STATUS } from '../../../../../domain/models/Location';
import { STATUS as DAILY_REQUEST_STATUS } from '@attendance/domain/models/AttDailyRequest';
import {
  CLOCK_TYPE,
  DailyStampTime,
  MODE_TYPE,
} from '@attendance/domain/models/DailyStampTime';
import {
  ACTIONS_FOR_FIX,
  getPermissionTestConditionsForActionForFix,
} from '@attendance/domain/models/FixDailyRequest';

import { State } from '../../../../modules';
import { actions as uiActions } from '../../../../modules/attendance/timeStamp/ui';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';
import {
  createPostParam,
  initialize,
  onToggleSendLocation,
  pushCommuteCount,
  stamp,
} from '../../../../action-dispatchers/attendance/timeStamp';

import AttendanceRequestIgnoreWarningConfirm from '@mobile/containers/organisms/attendance/AttendanceRequestIgnoreWarningConfirmContainer';

import TimeStampPage from '../../../../components/pages/attendance/TimeStampPage';

import setup from './config/production';
import UseCases from './UseCases';
import useAccessControl from '@mobile/hooks/useAccessControl';

const Container: React.FC<React.ComponentProps<typeof TimeStampPage>> = (
  props
) => {
  const store = useStore();
  const permission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  const timeStamp = useSelector(
    (state: State) => state.attendance.timeStamp.entities.dailyStampTime
  ) as DailyStampTime;
  const permissionTestConditionsForActionForFix = React.useMemo(
    () =>
      getPermissionTestConditionsForActionForFix(
        timeStamp?.record?.fixDailyRequest?.performableActionForFix
      ),
    [timeStamp?.record?.fixDailyRequest?.performableActionForFix]
  );
  const allowedActionForFixDailyRequest = useAccessControl(
    permissionTestConditionsForActionForFix
  );

  const $createPostParam = React.useCallback(
    () =>
      createPostParam(
        {
          mode: null,
          comment: props.comment,
          latitude:
            props.showLocationToggleButton && props.willSendLocation
              ? props.latitude // $FlowFixMe
              : null,
          longitude:
            props.showLocationToggleButton && props.willSendLocation
              ? props.longitude // $FlowFixMe
              : null,
          commuteForwardCount: props.commuteCount?.forwardCount,
          commuteBackwardCount: props.commuteCount?.backwardCount,
        },
        props.showLocationToggleButton,
        props.showLocationToggleButton &&
          props.fetchStatus === LOCATION_FETCH_STATUS.Success,
        props.useManageCommuteCount
      ),
    [
      props.comment,
      props.commuteCount,
      props.fetchStatus,
      props.latitude,
      props.longitude,
      props.showLocationToggleButton,
      props.useManageCommuteCount,
      props.willSendLocation,
    ]
  );
  const $createSubmitDailyRequestParam = React.useCallback(
    () => ({
      [timeStamp.stampOutDate]: {
        id: timeStamp.record.id,
        dailyRequestSummary: {
          status: DAILY_REQUEST_STATUS.NOT_REQUESTED,
        },
      },
    }),
    [timeStamp]
  );
  const $createSubmitDailyRequest = React.useCallback(
    () => ({
      id: timeStamp.record.id,
      dailyRequestSummary: {
        status: DAILY_REQUEST_STATUS.NOT_REQUESTED,
      },
    }),
    [timeStamp]
  );

  const onClickSubmitFixDaily = React.useCallback(async () => {
    switch (timeStamp.record?.fixDailyRequest?.performableActionForFix) {
      case ACTIONS_FOR_FIX.Submit:
        if (timeStamp.defaultAction === CLOCK_TYPE.OUT) {
          await UseCases().submitFixDailyRequestWithClockOut({
            stampTimeRecord: $createPostParam(),
            dailyRecords: $createSubmitDailyRequestParam(),
          });
        } else {
          await UseCases().submitFixDailyRequest($createSubmitDailyRequest());
        }
        break;
      case ACTIONS_FOR_FIX.CancelApproval:
        await UseCases().cancelApprovalFixDailyRequest(
          timeStamp.record.fixDailyRequest.id
        );
        break;
      case ACTIONS_FOR_FIX.CancelRequest:
        await UseCases().cancelSubmittedFixDailyRequest(
          timeStamp.record.fixDailyRequest.id
        );
        break;
    }
    props.onClickRefresh();
  }, [
    props,
    timeStamp?.record?.fixDailyRequest?.performableActionForFix,
    timeStamp?.record?.fixDailyRequest?.id,
    timeStamp?.defaultAction,
    $createPostParam,
    $createSubmitDailyRequestParam,
    $createSubmitDailyRequest,
  ]);

  React.useEffect(() => {
    setup({ store, permission });
  }, [permission, store]);

  return (
    <TimeStampPage
      {...props}
      {...{
        onClickSubmitFixDaily,
        allowedActionForFixDailyRequest,
        Containers: {
          AttendanceRequestIgnoreWarningConfirm,
        },
      }}
    />
  );
};

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

  commuteCount: state.attendance.timeStamp.ui.commuteCount,

  enabledResume: !state.mobileCommons.error.message,

  isEnableStartStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableStartStamp,
  isEnableEndStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableEndStamp,
  isEnableRestartStamp:
    state.attendance.timeStamp.entities.dailyStampTime.isEnableRestartStamp,
  defaultAction:
    state.attendance.timeStamp.entities.dailyStampTime.defaultAction,
  isPossibleFixDailyRequest:
    state.attendance.timeStamp.entities.dailyStampTime
      .isPossibleFixDailyRequest,
  useDailyFixRequest: state.attendance.mobileSetting.useDailyFixRequest,
  record: state.attendance.timeStamp.entities.dailyStampTime.record,
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
          ? MODE_TYPE.CLOCK_REIN
          : MODE_TYPE.CLOCK_IN,
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
        mode: MODE_TYPE.CLOCK_OUT,
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
)(Container);
