import { SEARCH_PROJECT_MANAGER_GROUP } from '../actions/projectManagerGroup';

const initialState = [];

export default function searchProjectManagerGroupReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_PROJECT_MANAGER_GROUP:
      return action.payload;
    default:
      return state;
  }
}
