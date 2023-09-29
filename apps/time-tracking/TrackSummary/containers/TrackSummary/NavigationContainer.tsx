import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { PeriodNavigation } from '../../../../core';

import { State } from '../../modules';

import useRequest from '../hooks/useRequest';

const mapStateToProps = (state: State) => ({
  startDate: state.entities.summary.content.startDate,
  endDate: state.entities.summary.content.endDate,
});

const NavigationContainer = () => {
  const props = useSelector(mapStateToProps);

  const request = useRequest();
  const onClickCurrentPeriod = useCallback(() => {
    request.loadCurrentPeriodSummary();
  }, [request]);
  const onClickNext = useCallback(() => {
    request.loadNextPeriodSummary({
      // @ts-ignore
      startDate: props.startDate,
      endDate: props.endDate,
    });
  }, [props.startDate, props.endDate, request]);
  const onClickPrev = useCallback(() => {
    request.loadPrevPeriodSummary({
      startDate: props.startDate,
      // @ts-ignore
      endDate: props.endDate,
    });
  }, [props.startDate, props.endDate, request]);

  return (
    <PeriodNavigation
      {...props}
      onClickCurrent={onClickCurrentPeriod}
      onClickNext={onClickNext}
      onClickPrev={onClickPrev}
    />
  );
};

export default NavigationContainer;
