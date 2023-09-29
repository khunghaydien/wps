import {
  GET_RESOURCE_GROUP,
  SEARCH_RESOURCE_GROUP,
  SEARCH_RM_RESOURCE_GROUP,
} from '../actions/resourceGroup';

const initialState = [];

export default function searchResourceGroupReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SEARCH_RESOURCE_GROUP:
    case SEARCH_RM_RESOURCE_GROUP:
      return action.payload;
    default:
      return state;
  }
}

export function getResourceGroupReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RESOURCE_GROUP:
      return action.payload;
    default:
      return state;
  }
}
