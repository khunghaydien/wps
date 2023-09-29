import { LOADING_AREA } from '@commons/constants/exp/calendar';

import { actions as eventActions } from '@commons/modules/exp/entities/events';

import PlannerEventRepository from '@apps/repositories/PlannerEventRepository';

import { AppDispatch } from '../modules/AppThunk';

import { loadingEnd, loadingStart } from '../actions/app';

export const startCalendarLoading = () => (dispatch: AppDispatch) => {
  dispatch(loadingStart({ areas: LOADING_AREA }));
};

export const fetchCalendarEvent =
  (targetDate: string, loadingAreas: string[], empId?: string) =>
  (dispatch: AppDispatch) => {
    if (!loadingAreas.includes(LOADING_AREA)) dispatch(startCalendarLoading());

    dispatch(eventActions.setTargetDate(targetDate));
    PlannerEventRepository.fetch({
      startDate: targetDate,
      endDate: targetDate,
      empId,
    })
      .then(({ events }) => {
        dispatch(eventActions.fetchSuccess(events, targetDate));
      })
      .finally(() => {
        dispatch(loadingEnd(LOADING_AREA));
      });
  };
