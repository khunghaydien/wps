import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { format, isSunday } from 'date-fns';

import {
  AlertCode,
  AlertLevel,
} from '../../../domain/models/time-tracking/Alert';

import { State } from '../../modules';

import TimeTrackAlert from '../../components/Notifications/TimeTrackAlert';

type OwnProps = {
  readonly date: Date;
};

const mapStateToProps = (state: State) => ({
  timeTrackAlert: state.entities.timeTrackAlert,
});

const TimeTrackAlertContainer: React.FC<OwnProps> = ({ date }: OwnProps) => {
  const props = useSelector(mapStateToProps);

  const formattedDate = format(date, 'YYYY-MM-DD');
  const isVisible = useMemo(() => {
    const alerts = props.timeTrackAlert[formattedDate] || [];
    return alerts.some(
      (alert) =>
        alert.code === AlertCode.TimeAttConsistency &&
        alert.level === AlertLevel.Warn
    );
  }, [props.timeTrackAlert, formattedDate]);
  const align: 'top left' = useMemo(() => {
    return isSunday(date) ? 'top left' : undefined;
  }, [date]);

  return <TimeTrackAlert isVisible={isVisible} align={align} />;
};

export default TimeTrackAlertContainer;
