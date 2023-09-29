import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  TIME_TRACK_SUBMIT,
  TIME_TRACK_UPDATED,
} from '@commons/constants/customEventName';
import {
  KEY_IN_CUSTOM_EVENT_DETAIL as SOURCE,
  TIME_TRACK_REQUEST,
} from '@commons/constants/customEventSource';

import { State } from '../../modules';

import TrackSummary from '../../components/TrackSummary';

import useRequest from '../hooks/useRequest';

const isDispatchedByOwnSelf = (event: CustomEvent) =>
  (event.detail || {})[SOURCE] === TIME_TRACK_REQUEST;

type OwnProps = Readonly<Record<string, unknown>>;

const mapStateToProps = (state: State) => ({
  data: state.entities.summary.content.taskSummaryRecords,
  startDate: state.entities.summary.content.startDate,
  endDate: state.entities.summary.content.endDate,
  targetDate: state.entities.request.targetDate,
  status: state.entities.summary.content.request.status,
  useRequest: state.entities.summary.content.useRequest,
  isTimeTrackSummaryOpenByDefault:
    state.common.personalSetting.isTimeTrackSummaryOpenByDefault,
});

const RequestContainer = (_ownProps: OwnProps) => {
  const { targetDate, isTimeTrackSummaryOpenByDefault, ...props } =
    useSelector(mapStateToProps);
  const requestId = useSelector<State, string>(
    (state) => state.entities.summary.content.request.requestId
  );

  const request = useRequest();

  const openHistoryDialog = useCallback(() => {
    request.openHistoryDialog(requestId);
  }, [requestId]);

  useEffect(() => {
    const initialize = (event: CustomEvent) => {
      if (isDispatchedByOwnSelf(event)) {
        return;
      }
      request.initialize(targetDate);
    };
    window.addEventListener(TIME_TRACK_UPDATED, initialize);
    window.addEventListener(TIME_TRACK_SUBMIT, initialize);
    return () => {
      window.removeEventListener(TIME_TRACK_UPDATED, initialize);
      window.removeEventListener(TIME_TRACK_SUBMIT, initialize);
    };
  }, [targetDate]);

  useEffect(() => {
    request.initialize();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isTimeTrackSummaryOpenByDefault);
  }, [isTimeTrackSummaryOpenByDefault]);

  const onClickOpen = useCallback(() => {
    setIsOpen(!isOpen);
    request.updateIsOpenByDefault(!isOpen);
  }, [isOpen]);

  return (
    <TrackSummary.Request
      {...props}
      isOpen={isOpen}
      onClickOpen={onClickOpen}
      openHistoryDialog={openHistoryDialog}
    />
  );
};

export default RequestContainer;
