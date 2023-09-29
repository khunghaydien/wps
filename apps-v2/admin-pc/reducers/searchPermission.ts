import { Permission } from '../models/permission/Permission';

import { SEARCH_PERMISSION } from '../actions/permission';

const initialState = [];

export default function searchPermissionReducer(
  state: Permission[] = initialState,
  action: { type: string; payload: Permission[] }
) {
  switch (action.type) {
    case SEARCH_PERMISSION:
      return action.payload;
    default:
      return state;
  }
}
