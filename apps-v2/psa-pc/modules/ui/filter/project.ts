import { initialProjectListFilterState } from '@apps/domain/models/psa/Project';

//
// constants
//
export const ACTIONS = {
  UPDATE_FILTER: 'MODULES/UI/FILTER/PROJECT_LIST',
};

//
// actions
//
export const actions = {
  update: (nextState: any) => ({
    type: ACTIONS.UPDATE_FILTER,
    payload: nextState,
  }),
};

//
// Reducer
//
const initialState = initialProjectListFilterState('');

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.UPDATE_FILTER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
