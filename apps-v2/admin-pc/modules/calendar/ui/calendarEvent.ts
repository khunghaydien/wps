import { Dispatch, Reducer } from 'redux';

import isEmpty from 'lodash/isEmpty';

import {
  catchApiError,
  catchBusinessError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import Api from '../../../../commons/api';
import msg from '../../../../commons/languages';

import {
  CalendarEvent,
  create as createCalendarEvent,
} from '../../../models/calendar/CalendarEvent';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = CalendarEvent | null | undefined;

const initialState: State = null;

const ACTIONS = {
  SET: 'ADMIN/CALENDAR/UI/CALENDAR_EVENT/SET',
  UNSET: 'ADMIN/CALENDAR/UI/CALENDAR_EVENT/UNSET',
  UPDATE: 'ADMIN/CALENDAR/UI/CALENDAR_EVENT/UPDATE',
};

const isBlank = (str: string) => isEmpty(str);

export const actions = {
  select: (calendarEvent: CalendarEvent) => ({
    type: ACTIONS.SET,
    payload: calendarEvent,
  }),

  create: (calendarId: string) => ({
    type: ACTIONS.SET,
    payload: createCalendarEvent(calendarId),
  }),

  unset: () => ({
    type: ACTIONS.UNSET,
  }),

  update: (key: string, value: any) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key,
      value,
    },
  }),

  save:
    (editingCalendarEvent: CalendarEvent, onSuccess: () => Promise<any>) =>
    (dispatch: Dispatch<any>) => {
      // イベント新規追加ダイアログの名前(日本語)のみスペースを入れることができてしまうためこちらでチェックしています。
      // Checking here because you can put a space in the name (Japanese) field in the new addition dialog.
      if (isBlank(editingCalendarEvent.name_L0.trim())) {
        dispatch(
          catchBusinessError(
            msg().Admin_Lbl_ValidationCheck,
            msg().Admin_Lbl_Name,
            msg().Admin_Msg_EmptyItem
          )
        );
        return null;
      }

      dispatch(loadingStart());

      const path =
        editingCalendarEvent.id === null ||
        editingCalendarEvent.id === undefined
          ? '/calendar/record/create'
          : '/calendar/record/update';

      return Api.invoke({
        path,
        param: editingCalendarEvent,
      })
        .then(onSuccess)
        .then(() => dispatch(actions.unset()))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...action.payload };

    case ACTIONS.UPDATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
