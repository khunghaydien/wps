import _ from 'lodash';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import {
  CLEAR_EVENT_EDIT_POPUP,
  CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
  FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
} from '../../actions/eventEditPopup';

// State

type State = WorkCategory[];

export const initialState = [];

// Action

export type ClearEventEditPopupAction = {
  type: 'CLEAR_EVENT_EDIT_POPUP';
};

export type FetchSuccessWorkCategoryListEventEditPopupAction = {
  type: 'FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP';
  payload: WorkCategory[];
};

export type ClearWorkCategoryListEventEditPopup = {
  type: 'CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP';
};

type Action =
  | ClearEventEditPopupAction
  | FetchSuccessWorkCategoryListEventEditPopupAction
  | ClearWorkCategoryListEventEditPopup;

// Reducer

export default function workCategoryListReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case CLEAR_EVENT_EDIT_POPUP:
      return initialState;
    case FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP:
      return _.cloneDeep(
        (action as FetchSuccessWorkCategoryListEventEditPopupAction).payload
      );
    case CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP:
      return [];
    default:
      return state;
  }
}
