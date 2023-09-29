import { SEARCH_COST_CENTER } from '../actions/costCenter';

const initialState = [];

export default function searchCostCenterReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_COST_CENTER:
      return action.payload;
    default:
      return state;
  }
}
