import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { TIME_TRACK_UPDATED } from '../../../../commons/constants/customEventName';

import { State } from '../../modules';

import AppActions from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import TrackSummary from '../../components/TrackSummary';
import { SummaryPeriod, Task } from '../../components/TrackSummary/Props';

import useRequest from '../hooks/useRequest';

type OwnProps = Readonly<{
  onSelect: (
    e: React.SyntheticEvent,
    transferTarget: { task: Task; period: SummaryPeriod; summaryId: string }
  ) => void;
  appActions: ReturnType<typeof AppActions>;
}>;

const mapStateToProps = (state: State) => ({
  data: state.entities.summary.content.taskSummaryRecords,
  startDate: state.entities.summary.content.startDate,
  endDate: state.entities.summary.content.endDate,
  summaryId: state.entities.summary.content.id,
  targetDate: state.entities.request.targetDate,
  status: state.entities.summary.content.request.status,
  useRequest: state.entities.summary.content.useRequest,
});

const TransferContainer: React.FC<OwnProps> = ({
  onSelect,
  appActions,
}: OwnProps) => {
  const { targetDate, ...props } = useSelector(mapStateToProps);

  const request = useRequest({ parentAppActions: appActions });

  const handleSelect = useCallback(
    (e: React.SyntheticEvent, task: Task) => {
      onSelect(e, {
        task,
        period: {
          startDate: props.startDate,
          endDate: props.endDate,
        },
        summaryId: props.summaryId,
      });
    },
    [onSelect, props]
  );

  useEffect(() => {
    const initialize = (): void => {
      request.initialize(targetDate);
    };
    window.addEventListener(TIME_TRACK_UPDATED, initialize);
    return (): void => {
      window.removeEventListener(TIME_TRACK_UPDATED, initialize);
    };
  }, [request, targetDate]);

  useEffect(() => {
    request.initialize();
  }, [request]);

  return <TrackSummary.Transfer {...props} onSelect={handleSelect} />;
};

export default TransferContainer;
