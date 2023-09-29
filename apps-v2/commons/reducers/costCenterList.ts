import { FETCH_COST_CENTER_LIST } from '../actions/costCenterList';

export default function costCenterListReducer(state = [], action) {
  switch (action.type) {
    case FETCH_COST_CENTER_LIST:
      return action.payload;
    default:
      return state;
  }
}
