import _ from 'lodash';

import eventTemplate from '../../constants/eventTemplate';

import { CalendarEvent } from '../../models/calendar-event/CalendarEvent';

import {
  CLEAR_EVENT_EDIT_POPUP,
  CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
  EDIT_EVENT_EDIT_POPUP,
  SELECT_DATA_EVENT_EDIT_POPUP,
  SELECT_JOB_EVENT_EDIT_POPUP,
} from '../../actions/eventEditPopup';

// State

export type State = CalendarEvent;

export const initialState = eventTemplate;

// Action

export type ClearEventEditPopupAction = {
  type: 'CLEAR_EVENT_EDIT_POPUP';
};

export type SelectDataEventEditPopupAction = {
  type: 'SELECT_DATA_EVENT_EDIT_POPUP';
  payload: CalendarEvent;
};

export type EditEventEditPopupAction = {
  type: 'EDIT_EVENT_EDIT_POPUP';
  payload: {
    key: keyof State;
    value: State[keyof State];
  };
};

export type SelectJobEventEditPopupAction = {
  type: 'SELECT_JOB_EVENT_EDIT_POPUP';
  payload: {
    id: string;
    name: string;
    code: string;
  };
};

export type ClearWorkCategoryListEventEditPopupAction = {
  type: 'CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP';
};

type Action =
  | ClearEventEditPopupAction
  | SelectDataEventEditPopupAction
  | EditEventEditPopupAction
  | SelectJobEventEditPopupAction
  | ClearWorkCategoryListEventEditPopupAction;

// Reducer

// FIXME momentがObject.assignでおかしくなるため、deepCloneしている
// 本来momentをstate管理すべきではない
export default function eventReducer(
  state: State = initialState,
  action: Action
): State {
  let cloneState;

  switch (action.type) {
    case CLEAR_EVENT_EDIT_POPUP:
      return eventTemplate;
    case SELECT_DATA_EVENT_EDIT_POPUP:
      return _.cloneDeep((action as SelectDataEventEditPopupAction).payload);
    case EDIT_EVENT_EDIT_POPUP:
      cloneState = _.cloneDeep(state);
      cloneState[(action as EditEventEditPopupAction).payload.key] = (
        action as EditEventEditPopupAction
      ).payload.value;

      return cloneState;
    case SELECT_JOB_EVENT_EDIT_POPUP:
      cloneState = _.cloneDeep(state);

      cloneState.job = {
        id: (action as SelectJobEventEditPopupAction).payload.id,
        name: (action as SelectJobEventEditPopupAction).payload.name,
        code: (action as SelectJobEventEditPopupAction).payload.code,
      };

      return cloneState;
    case CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP:
      cloneState = _.cloneDeep(state);
      cloneState.workCategoryId = '';
      cloneState.workCategoryName = '';

      return cloneState;
    default:
      return state;
  }
}
