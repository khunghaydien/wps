import * as innerActions from './actions';

// CONSTANTS
const FETCH_SUCCESS = 'MODULES/ENTITIES/TIME_TRACK/LIST/FETCH_SUCCESS';

// ACTIONS
export const actions = innerActions;

export const constants = {
  FETCH_SUCCESS,
};

// SELECTOR
export const requestListSelector = (state) => {
  const { allIds, byId } = state.entities.timeTrack.list;
  if (!allIds || allIds.length === 0) {
    return [];
  }

  return allIds.map((id) => {
    return byId[id];
  });
};

// REDUCER
const initialState = {
  byId: {},
  allIds: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    default:
      return state;
  }
};
