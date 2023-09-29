import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import Api from '../../../../commons/api';

import { CalendarEvent } from '../../../models/calendar/CalendarEvent';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = CalendarEvent[];
type ResponseBody = {
  records: CalendarEvent[];
};

const initialState: State = [];

const ACTIONS = {
  SET: 'ADMIN/CALENDAR/ENTITIES/CALENDAR_EVENT_LIST/SET',
  UNSET: 'ADMIN/CALENDAR/ENTITIES/CALENDAR_EVENT_LIST/UNSET',
};

const setCalendarEventList = (calendarEventList: CalendarEvent[]) => ({
  type: ACTIONS.SET,
  payload: calendarEventList,
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch: (calendarId: string) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return Api.invoke({
      path: '/calendar/record/search',
      param: { calendarId },
    })
      .then((res: ResponseBody) => dispatch(setCalendarEventList(res.records)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  },
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
