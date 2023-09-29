import moment from 'moment';

import { BaseEvent } from '@commons/models/DailySummary/BaseEvent';
import { toViewModel } from '@commons/models/DailySummary/Converter';

import { Event } from '@apps/domain/models/time-management/Event';

// State

type State = {
  targetDate: string | undefined;
  records: BaseEvent[];
};

const initialState = { targetDate: undefined, records: [] };

// Actions

const ACTION_TYPES = {
  SET_TARGET_DATE: `MODULES/EXP/ENTITIES/EVENTS/SET_TARGET_DATE`,
  FETCH_SUCCESS: `MODULES/EXP/ENTITIES/EVENTS/FETCH_SUCCESS`,
  RESET: `MODULES/EXP/ENTITIES/EVENTS/RESET`,
};

type ActionTypes = typeof ACTION_TYPES;

type SetTargetDate = {
  type: ActionTypes['SET_TARGET_DATE'];
  payload: string;
};

type FetchSuccess = {
  type: ActionTypes['FETCH_SUCCESS'];
  payload: {
    events: Event[];
    targetDate: string;
  };
};

type Reset = {
  type: ActionTypes['RESET'];
};

type Action = SetTargetDate | FetchSuccess | Reset;

export const actions = {
  setTargetDate: (targetDate: string): SetTargetDate => ({
    type: ACTION_TYPES.SET_TARGET_DATE,
    payload: targetDate,
  }),
  fetchSuccess: (events: Event[], targetDate: string): FetchSuccess => ({
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: { events, targetDate },
  }),
  reset: (): Reset => ({
    type: ACTION_TYPES.RESET,
  }),
};

// Reducer

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SET_TARGET_DATE: {
      return {
        ...state,
        targetDate: (action as SetTargetDate).payload,
      };
    }
    case ACTION_TYPES.FETCH_SUCCESS: {
      const { events, targetDate } = (action as FetchSuccess).payload;
      return targetDate === state.targetDate
        ? {
            ...state,
            records: toViewModel(events, moment(targetDate)),
          }
        : state;
    }
    case ACTION_TYPES.RESET: {
      return initialState;
    }
    default:
      return state;
  }
};
