import { Dispatch, Reducer } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import Api from '../../../../commons/api';
import msg from '../../../../commons/languages';

import {
  byDisplayOrder,
  Calendar,
  isAttendanceCalendar,
} from '../../../models/calendar/Calendar';

import { SEARCH_ATTENDANCE_CALENDAR } from '../../../actions/calendar';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = Calendar[];
type ResponseBody = {
  records: Calendar[];
};

const initialState: State = [];

const ACTIONS = {
  SET: 'ADMIN/CALENDAR/ENTITIES/CALENDAR_LIST/SET',
  UNSET: 'ADMIN/CALENDAR/ENTITIES/CALENDAR_LIST/UNSET',
};

const setCalendarList = (calendarList: Calendar[]) => (dispatch) => {
  dispatch({
    type: ACTIONS.SET,
    payload: calendarList,
  });
  dispatch({
    type: SEARCH_ATTENDANCE_CALENDAR,
    payload: calendarList,
  });
};

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch: (companyId: string) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return Api.invoke({
      path: '/calendar/search',
      param: { companyId, type: 'Attendance' },
    })
      .then((res: ResponseBody) => dispatch(setCalendarList(res.records)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  },

  delete:
    ({ companyId, calendarId }: { companyId: string; calendarId: string }) =>
    (dispatch: AppDispatch) => {
      return dispatch(
        withLoading(
          () =>
            Api.invoke({
              path: '/calendar/delete',
              param: { id: calendarId },
            }),
          () => dispatch(actions.fetch(companyId))
        )
      )
        .then(() => true) // Success
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          Promise.resolve(false); // Failure
        });
    },

  confirmAndDelete:
    ({ companyId, calendarId }: { companyId: string; calendarId: string }) =>
    (dispatch: Dispatch<any>): Promise<any> => {
      // @ts-ignore
      return dispatch(confirm(msg().Exp_Msg_ConfirmDelete)).then((yes) => {
        if (yes) {
          return dispatch(actions.delete({ companyId, calendarId }));
        }
        return yes;
      });
    },
};

const selectCalendarList = (state) => state.calendar.entities.calendarList;

export const selectors = {
  /**
   * 勤怠カレンダーを返します。
   */

  selectAttendanceCalendars: createSelector(
    selectCalendarList,
    (calendarList) =>
      calendarList.filter(isAttendanceCalendar).sort(byDisplayOrder)
  ),
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
