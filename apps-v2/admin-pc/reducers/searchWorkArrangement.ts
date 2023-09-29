import { SEARCH_WORK_ARRANGEMENT } from '../actions/workArrangement';

const initialState = [];

export default function searchWorkArrangementReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_WORK_ARRANGEMENT:
      return action.payload;
    default:
      return state;
  }
}
