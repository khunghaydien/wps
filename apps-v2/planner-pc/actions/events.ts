import moment from 'moment';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';
import { BaseEvent } from '../../commons/models/DailySummary/BaseEvent';

import { EventParam } from '../models/calendar-event/EventFromRemote';

import { State } from '../modules';

import { AppAction, AppDispatch } from '../action-dispatchers/AppThunk';
import Events from '../action-dispatchers/Events';

export const SELECT_DAY = 'SELECT_DAY';
export const SWITCH_CALENDAR_MODE = 'SWITCH_CALENDAR_MODE';
export const REQUEST_LOAD_EMP_EVENTS = 'REQUEST_LOAD_EMP_EVENTS';
export const RECEIVE_LOAD_EMP_EVENTS = 'RECEIVE_LOAD_EMP_EVENTS';
export const RECEIVE_SAVE_EMP_EVENT = 'RECEIVE_SAVE_EMP_EVENT';

type GetState = () => State;

export function selectDay(date: moment.Moment) {
  return {
    type: SELECT_DAY,
    date,
  };
}

export function switchCalendarMode(calendarMode: 'month' | 'week') {
  return {
    type: SWITCH_CALENDAR_MODE,
    calendarMode,
  };
}

/**
 * 予定一覧
 */
export function requestEmpEventsPosts() {
  return {
    type: REQUEST_LOAD_EMP_EVENTS,
  };
}

export function receiveEmpEventsPosts(json: Record<string, any>) {
  return {
    type: RECEIVE_LOAD_EMP_EVENTS,
    empEvents: json,
  };
}

/**
 * 予定保存
 */
function receiveSaveEmpEventPosts(result, event: EventParam) {
  return {
    type: RECEIVE_SAVE_EMP_EVENT,
    event,
  };
}
export const saveEmpEvent =
  (event: EventParam): AppAction<Promise<void>> =>
  (dispatch: AppDispatch, getState: GetState): Promise<void> => {
    const state = getState();
    const selectedDay = state.selectedDay;
    const req = {
      path: '/planner/event/save',
      param: {
        id: event.id,
        title: event.title,
        startDateTime: event.startDate,
        endDateTime: event.endDate,
        jobId: (!event.isAllDay && event.job && event.job.id) || null,
        workCategoryId: (!event.isAllDay && event.workCategoryId) || null,
        isAllDay: event.isAllDay,
        calculateCapacity: event.calculateCapacity,
        isOuting: event.isOuting,
        location: event.location,
        description: event.remarks,
      },
    };

    dispatch(loadingStart());

    let isSuccess = false;

    return Api.invoke(req)
      .then((res) => {
        isSuccess = true;
        dispatch(receiveSaveEmpEventPosts(res, event));

        Events(dispatch).loadEvents(selectedDay.toDate());
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()))
      .then(() => ({ isSuccess }));
  };

/**
 * 予定削除
 */
export const deleteEmpEvent =
  (event: BaseEvent): AppAction<Promise<void>> =>
  (dispatch: AppDispatch, getState: GetState): Promise<void> => {
    const state = getState();
    const selectedDay = state.selectedDay;
    const req = {
      path: '/planner/event/delete',
      param: {
        id: event.id,
      },
    };

    dispatch(loadingStart());

    return Api.invoke(req)
      .then(() => Events(dispatch).loadEvents(selectedDay.toDate()))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };
