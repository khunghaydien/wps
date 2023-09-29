import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { format } from 'date-fns';

import DateUtil from '../../commons/utils/DateUtil';

import { State } from '../modules';

import * as DailySummaryActions from '../action-dispatchers/DailySummary';

import Header from '../components/Header';

const HeaderContainer = () => {
  const employeeId = useSelector((state: State) => state.entities.user.id);

  const targetDate = useSelector(
    (state: State) => state.ui.dailySummary.targetDate
  );

  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const onClickPrev = useCallback(() => {
    dispatch(
      DailySummaryActions.openDailySummary(
        DateUtil.addDays(targetDate, -1),
        employeeId
      )
    );
  }, [employeeId, dispatch, targetDate]);

  const onSelectDate = useCallback(
    (date: Date) => {
      dispatch(
        DailySummaryActions.openDailySummary(
          format(date, 'YYYY-MM-DD'),
          employeeId
        )
      );
    },
    [dispatch, employeeId]
  );

  const onClickNext = useCallback(() => {
    dispatch(
      DailySummaryActions.openDailySummary(
        DateUtil.addDays(targetDate, 1),
        employeeId
      )
    );
  }, [employeeId, dispatch, targetDate]);

  return (
    <Header
      targetDate={targetDate}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
      onSelectDate={onSelectDate}
    />
  );
};

export default HeaderContainer;
