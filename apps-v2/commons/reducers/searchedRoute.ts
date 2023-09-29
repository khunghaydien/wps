import _ from 'lodash';

import { SEARCH_ROUTE, SEARCH_ROUTE_START } from '../actions/route';

const initialState = {};

export default function searchedRouteReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_ROUTE_START:
      return initialState;
    case SEARCH_ROUTE:
      const searchedRoute = _.cloneDeep(action.payload.searchedRoute);

      searchedRoute.param = action.payload.param;
      return searchedRoute;
    default:
      return state;
  }
}
