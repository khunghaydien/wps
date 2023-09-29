import { Dispatch, Reducer } from 'redux';

import trim from 'lodash/trim';
import { createSelector } from 'reselect';

import {
  catchApiError,
  catchBusinessError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import Api from '../../../../commons/api';
import msg from '../../../../commons/languages';

import {
  Calendar,
  createDefaultAttendanceCalendar,
} from '../../../models/calendar/Calendar';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import { setModeBase, showDetailPane } from '../../base/detail-pane/ui';
import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = {
  selectedId: string | null | undefined;
  editing: Calendar | null | undefined;
  selectedCalendarEventIdList: string[];
};

const initialState: State = {
  selectedId: null,
  editing: null,
  selectedCalendarEventIdList: [],
};

const ACTIONS = {
  SELECT: 'ADMIN/CALENDAR/UI/CALENDAR/SELECT',
  DESELECT: 'ADMIN/CALENDAR/UI/CALENDAR/DESELECT',
  START_EDITING: 'ADMIN/CALENDAR/UI/CALENDAR/START_EDITING',
  CANCEL_EDITING: 'ADMIN/CALENDAR/UI/CALENDAR/CANCEL_EDITING',
  UPDATE: 'ADMIN/CALENDAR/UI/CALENDAR/UPDATE',
  SELECT_EVENTS: 'ADMIN/CALENDAR/UI/CALENDAR/SELECT_EVENTS',
  DESELECT_EVENTS: 'ADMIN/CALENDAR/UI/CALENDAR/DESELECT_EVENTS',
  CLEAR_EVENTS_SELECTION: 'ADMIN/CALENDAR/UI/CALENDAR/CLEAR_EVENTS_SELECTION',
};

export const actions = {
  select: (calendar: Calendar) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.SELECT,
      payload: calendar,
    });
    dispatch(setModeBase(''));
    dispatch(showDetailPane(true));
  },

  deselect: () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.DESELECT,
    });
    dispatch(setModeBase(''));
    dispatch(showDetailPane(false));
  },

  startEditingNew: (companyId: string) => (dispatch: Dispatch<any>) => {
    const defaultAttendanceCalendar =
      createDefaultAttendanceCalendar(companyId);
    dispatch({
      type: ACTIONS.START_EDITING,
      payload: defaultAttendanceCalendar,
    });
    dispatch(setModeBase('new'));
    dispatch(showDetailPane(true));
  },

  startEditing: (calendar: Calendar) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.START_EDITING,
      payload: calendar,
    });
    dispatch(setModeBase('edit'));
    dispatch(showDetailPane(true));
  },

  cancelEditing: () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.CANCEL_EDITING,
    });
    dispatch(setModeBase(''));
  },

  update: (key: string, value: any) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key,
      value,
    },
  }),

  save:
    (editingCalendar: Calendar, onSuccess: () => Promise<any>) =>
    (dispatch: Dispatch<any>): void | any => {
      const isEmptyOrWhitespaces = (x) => !trim(x);

      // FIXME: 従来のエラー表示にならって仮実装した
      if (isEmptyOrWhitespaces(editingCalendar.code)) {
        dispatch(
          catchBusinessError(
            msg().Admin_Lbl_ValidationCheck,
            msg().Admin_Lbl_Code,
            msg().Admin_Msg_EmptyItem
          )
        );
        return Promise.resolve();
      }
      if (isEmptyOrWhitespaces(editingCalendar.name_L0)) {
        dispatch(
          catchBusinessError(
            msg().Admin_Lbl_ValidationCheck,
            msg().Admin_Lbl_Name,
            msg().Admin_Msg_EmptyItem
          )
        );
        return Promise.resolve();
      }

      dispatch(loadingStart());

      const endpoint = !editingCalendar.id
        ? '/calendar/create'
        : '/calendar/update';
      return Api.invoke({
        path: endpoint,
        param: editingCalendar,
      })
        .then(onSuccess)
        .then(() => dispatch(actions.cancelEditing()))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  selectEvents: (selectedEventIdList: string[]) => ({
    type: ACTIONS.SELECT_EVENTS,
    payload: selectedEventIdList,
  }),

  deselectEvents: (deselectedEventIdList: string[]) => ({
    type: ACTIONS.DESELECT_EVENTS,
    payload: deselectedEventIdList,
  }),

  clearEventsSelection: () => ({
    type: ACTIONS.CLEAR_EVENTS_SELECTION,
  }),

  deleteEvents:
    (selectedCalendarEventIdList: string[], onSuccess: () => Promise<any>) =>
    (dispatch: AppDispatch) => {
      if (!selectedCalendarEventIdList || !selectedCalendarEventIdList.length) {
        return;
      }
      // @ts-ignore
      dispatch(confirm(msg().Admin_Msg_ConfirmDelete)).then((yes) => {
        if (!yes) {
          return;
        }

        dispatch(loadingStart());
        Api.invoke({
          path: '/calendar/record/delete',
          param: { ids: selectedCalendarEventIdList },
        })
          .then(onSuccess)
          .then(() => dispatch(actions.clearEventsSelection()))
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()));
      });
    },
};

const selectCalendarList = (state) => state.calendar.entities.calendarList;
const selectCalendarEventList = (state) =>
  state.calendar.entities.calendarEventList;
const selectSelectedCalendarId = (state) =>
  state.calendar.ui.calendar.selectedId;
const selectSelectedCalendarEventIdList = (state) =>
  state.calendar.ui.calendar.selectedCalendarEventIdList;

export const selectors = {
  selectSelectedCalendar: createSelector(
    selectCalendarList,
    selectSelectedCalendarId,
    (calendarList, selectedId) =>
      calendarList.filter((cal) => cal.id === selectedId)[0]
  ),

  getCalendarEventListWithAttribute: createSelector(
    selectCalendarEventList,
    selectSelectedCalendarEventIdList,
    (calendarEventList, selectedCalendarEventIdList) =>
      calendarEventList.map((calendarEvent) => ({
        ...calendarEvent,
        isSelected: selectedCalendarEventIdList.includes(calendarEvent.id),
      }))
  ),
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SELECT:
      return {
        ...initialState,
        selectedId: action.payload.id,
        editing: { ...action.payload },
      };

    case ACTIONS.START_EDITING:
      return {
        ...state,
        selectedId: action.payload.id,
        editing: { ...action.payload },
      };

    case ACTIONS.CANCEL_EDITING:
      return {
        ...state,
        editing: null,
      };

    case ACTIONS.UPDATE:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.payload.key]: action.payload.value,
        },
      };

    case ACTIONS.DESELECT:
      return {
        ...state,
        selectedId: null,
        editing: null,
      };

    case ACTIONS.CLEAR_EVENTS_SELECTION:
      return {
        ...state,
        selectedCalendarEventIdList: initialState.selectedCalendarEventIdList,
      };

    case ACTIONS.SELECT_EVENTS:
      return {
        ...state,
        selectedCalendarEventIdList: [
          ...state.selectedCalendarEventIdList,
          ...action.payload.filter(
            (newId) => !state.selectedCalendarEventIdList.includes(newId)
          ),
        ],
      };

    case ACTIONS.DESELECT_EVENTS:
      return {
        ...state,
        selectedCalendarEventIdList: state.selectedCalendarEventIdList.filter(
          (id) => !action.payload.includes(id)
        ),
      };

    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
