import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { TIME_TRACK_UPDATED } from '@commons/constants/customEventName';

import { State } from '../../modules';

import RequestCompact from '../../components/TrackSummary/RequestCompact';

import useRequest from '../hooks/useRequest';

type Props = {
  readonly targetDate?: string;
  readonly defaultEmpId?: string | null | undefined;
};

const RequestCompactContainer = ({ targetDate, defaultEmpId }: Props) => {
  const doesUseRequest = useSelector(
    (state: State) => state.entities.summary.content.useRequest
  );
  const summaryId = useSelector(
    (state: State) => state.entities.summary.content.id
  );
  const request = useRequest({ defaultEmpId });

  useEffect(() => {
    const initialize = () => request.initialize(targetDate);
    window.addEventListener(TIME_TRACK_UPDATED, initialize);
    return () => {
      window.removeEventListener(TIME_TRACK_UPDATED, initialize);
    };
  }, [targetDate, request, summaryId]);

  useEffect(() => {
    request.initialize(targetDate);
  }, [targetDate, request, summaryId]);

  return <RequestCompact useRequest={doesUseRequest} />;
};

export default RequestCompactContainer;
