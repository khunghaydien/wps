import * as innerActions from './actions';

export type State = {
  byId: innerActions.AttDailyRequestMap;
  allIds: string[];
};

// CONSTANTS
const FETCH_SUCCESS = 'MODULES/ENTITIES/ATT/LIST/FETCH_SUCCESS';
const CLEAR = 'MODULES/ENTITIES/ATT/LIST/CLEAR';

// ACTIONS
type FetchSuccessAction = {
  type: 'MODULES/ENTITIES/ATT/LIST/FETCH_SUCCESS';
  payload: State;
};

type ClearAction = {
  type: 'MODULES/ENTITIES/ATT/LIST/CLEAR';
};

type Action = FetchSuccessAction | ClearAction;

export const actions = innerActions;

export const constants = {
  FETCH_SUCCESS,
  CLEAR,
};

// SELECTOR
type RootState = {
  entities: {
    att: {
      list: State;
    };
  };
  ui: any;
};

export const requestListSelector = (
  state: RootState
): innerActions.AttDailyRequest[] => {
  const { allIds, byId } = state.entities.att.list;
  if (!allIds || allIds.length === 0) {
    return [];
  }

  return allIds.map((id) => {
    return byId[id];
  });
};

// REDUCER
const initialState: State = {
  byId: {},
  allIds: [],
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const { payload } = action as FetchSuccessAction;
      return {
        byId: payload.byId,
        allIds: payload.allIds,
      };
    }

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};
