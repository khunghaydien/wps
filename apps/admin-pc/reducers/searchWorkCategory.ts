import { SEARCH_WORK_CATEGORY } from '../actions/workCategory';

const initialState = [];

export default function searchWorkCategoryReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_WORK_CATEGORY:
      return action.payload;
    default:
      return state;
  }
}
