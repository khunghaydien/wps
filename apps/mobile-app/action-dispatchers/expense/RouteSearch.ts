import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import {
  searchRoute,
  SearchRouteParam,
} from '../../../domain/models/exp/jorudan/Route';

import {
  actions as routeActions,
  searchSuccess,
} from '../../../domain/modules/exp/jorudan/route';
import { AppDispatch } from '../../modules/expense/AppThunk';

export const searchRouteWithParam =
  (param: SearchRouteParam) =>
  (dispatch: AppDispatch): Promise<any> =>
    dispatch(
      withLoading(() =>
        searchRoute(param).then((res: any) => {
          dispatch(searchSuccess(res));
          return true;
        })
      )
    ).catch((err) => {
      dispatch(catchApiError(err));
      return false;
    });

export const clearRouteResults = () => (dispatch: AppDispatch) => {
  dispatch(routeActions.clear());
};
