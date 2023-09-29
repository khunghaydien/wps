import { LIST_CATEGORY, SEARCH_CATEGORY } from '../actions/category';

const initialState = [];

export default function searchCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_CATEGORY:
    case LIST_CATEGORY:
      return action.payload;
    default:
      return state;
  }
}
