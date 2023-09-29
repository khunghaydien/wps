import { Reducer } from 'redux';

import {
  initialStateRoute,
  Route,
  searchRoute,
  SearchRouteParam,
} from '../../../models/exp/jorudan/Route';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/UI/EXP/JORUDAN/STATION/SEARCH',
  CLEAR: 'MODULES/UI/EXP/JORUDAN/STATION/CLEAR',
};

export const searchSuccess = (body: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

const clear = () => ({
  type: ACTIONS.CLEAR,
});

export const actions = {
  search:
    (param: SearchRouteParam) =>
    (dispatch: AppDispatch): Promise<any> => {
      return searchRoute(param)
        .then((res: any) => dispatch(searchSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  clear:
    () =>
    (dispatch: AppDispatch): void | any => {
      dispatch(clear());
    },
};

const initialState = initialStateRoute;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Route, any>;
