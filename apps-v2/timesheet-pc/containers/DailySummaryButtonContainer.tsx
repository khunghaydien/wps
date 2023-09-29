import * as React from 'react';
import { useSelector } from 'react-redux';

import {
  Alerts,
  isConsistentWithAttTime,
} from '../../domain/models/time-tracking/Alert';

import { State } from '../modules';
import { State as DailyTimeTrackState } from '../modules/entities/dailyTimeTrack';

import DailySummaryButton from '../components/MainContent/Timesheet/DailySummaryButton';

type OwnProps = {
  date: string;
};

const DailySummaryButtonContainer = (ownProps: OwnProps) => {
  const isLoading = useSelector(
    (state: State) => state.ui.dailyTimeTrack.isLoading
  );
  const timeTrackAlertMap = useSelector(
    (state: State) => state.entities.timeTrackAlert as Alerts
  );
  const dailyTimeTrackMap = useSelector(
    (state: State) => state.entities.dailyTimeTrack as DailyTimeTrackState
  );

  const {
    realWorkTime,
    totalTaskTime,
  }: {
    realWorkTime?: number;
    totalTaskTime?: number;
  } = React.useMemo(() => {
    return dailyTimeTrackMap[ownProps.date] || {};
  }, [dailyTimeTrackMap, ownProps.date]);
  const alerts = React.useMemo(() => {
    return timeTrackAlertMap[ownProps.date] || [];
  }, [timeTrackAlertMap, ownProps.date]);
  const showAlert = React.useMemo(() => {
    return !isConsistentWithAttTime(alerts, totalTaskTime, realWorkTime);
  }, [alerts, totalTaskTime, realWorkTime]);

  return (
    <DailySummaryButton
      isLoading={isLoading}
      date={ownProps.date}
      totalTaskTime={totalTaskTime}
      showAlert={showAlert}
    />
  );
};

export default DailySummaryButtonContainer;
