import { Reducer } from 'redux';

import { initialStateConpany } from '../../../models/common/Company';
import searchRouteOption, {
  DEFAULT_ROUTE_OPTIONS,
} from '../../../models/exp/jorudan/JorudanOption';

import { actions as highwayBusActions } from '../../../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/highwayBus';
import { actions as routeSortActions } from '../../../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/routeSort';
import { actions as seatPreferenceActions } from '../../../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/seatPreference';
import { actions as useChargedExpressActions } from '../../../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/useChargedExpress';
import { actions as useExReservationActions } from '../../../../expenses-pc/modules/ui/expenses/recordItemPane/routeForm/option/useExReservation';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXP/JORUDAN/ROUTEOPTION/GET',
};

const searchSuccess = (body: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

export const actions = {
  search:
    (companyId: string) =>
    (dispatch: AppDispatch): void | any => {
      return searchRouteOption(companyId)
        .then((res: any) => {
          dispatch(searchSuccess(res));
          dispatch(
            highwayBusActions.set(
              res.jorudanHighwayBus || DEFAULT_ROUTE_OPTIONS.highwayBus
            )
          );
          dispatch(
            routeSortActions.set(
              res.jorudanRouteSort || DEFAULT_ROUTE_OPTIONS.routeSort
            )
          );
          dispatch(
            seatPreferenceActions.set(
              res.jorudanSeatPreference || DEFAULT_ROUTE_OPTIONS.seatPreference
            )
          );
          dispatch(
            useChargedExpressActions.set(
              res.jorudanUseChargedExpress ||
                DEFAULT_ROUTE_OPTIONS.useChargedExpress
            )
          );
          dispatch(
            useExReservationActions.set(
              res.jorudanUseExReservation ||
                DEFAULT_ROUTE_OPTIONS.useExReservation
            )
          );
        })
        .catch((err) => {
          throw err;
        });
    },
};

export default ((state = initialStateConpany, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any, any>;
