import { Job } from '../../../domain/models/time-tracking/Job';

import {
  ADD_JOB_LIST_EVENT_EDIT_POPUP,
  CLEAR_EVENT_EDIT_POPUP,
  FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
} from '../../actions/eventEditPopup';

// State

type State = {
  jobId: string;
  jobName: string;
  jobCode: string;
  hasJobType: boolean;
}[];

export const initialState = [];

// Actions

export type ClearEventEditPopupAction = {
  type: 'CLEAR_EVENT_EDIT_POPUP';
};

export type AddJobListEventEditPopupAction = {
  type: 'ADD_JOB_LIST_EVENT_EDIT_POPUP';
  payload: Job;
};

export type FetchSuccessActiveJobListEventEditPopupAction = {
  type: 'FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP';
  payload: State;
};

type Action =
  | ClearEventEditPopupAction
  | AddJobListEventEditPopupAction
  | FetchSuccessActiveJobListEventEditPopupAction;

// Reducer

export default function jobListReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case CLEAR_EVENT_EDIT_POPUP:
      return initialState;
    case ADD_JOB_LIST_EVENT_EDIT_POPUP:
      return [
        ...state,
        {
          jobId: (action as AddJobListEventEditPopupAction).payload.id,
          jobName: (action as AddJobListEventEditPopupAction).payload.name,
          jobCode: (action as AddJobListEventEditPopupAction).payload.code,
          hasJobType: (action as AddJobListEventEditPopupAction).payload
            .hasJobType,
        },
      ];
    case FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP:
      return (action as FetchSuccessActiveJobListEventEditPopupAction).payload;
    default:
      return state;
  }
}
