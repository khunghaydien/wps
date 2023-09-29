import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PeriodNavigation } from '../../../core';

import TimeTracking from '../actions/TimeTracking';

const mapStateToProps = (state) => ({
  startDate: state.timeTrack.overview.startDate,
  endDate: state.timeTrack.overview.endDate,
});

const PeriodNavigationContainer = () => {
  const props = useSelector(mapStateToProps);

  const dispatch = useDispatch();
  const timeTracking = useMemo(() => TimeTracking(dispatch), [dispatch]);
  const onClickNext = useCallback(() => {
    timeTracking.loadNextPeriod(props);
  }, [timeTracking, props]);
  const onClickPrev = useCallback(() => {
    timeTracking.loadPrevPeriod(props);
  }, [timeTracking, props]);
  const onClickCurrent = useCallback(() => {
    timeTracking.loadCurrentPeriod();
  }, [timeTracking]);

  return (
    <PeriodNavigation
      {...props}
      onClickNext={onClickNext}
      onClickPrev={onClickPrev}
      onClickCurrent={onClickCurrent}
    />
  );
};

export default PeriodNavigationContainer;
