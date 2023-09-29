import { SEARCH_WORKING_TYPE } from '../actions/workingType';

const initialState = [];

export default function searchWorkingTypeReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_WORKING_TYPE:
      return action.payload;
    default:
      return state;
  }
}
