import { Reducer } from 'redux';

import searchRouteOption from '../../../../domain/models/exp/jorudan/JorudanOption';

import { AppDispatch } from '../AppThunk';

type DefaultRouteOption = {
  jorudanAreaPreference: string | null;
  jorudanChargedExpressDistance: string | null;
  jorudanCommuterPass?: string | null;
  jorudanFareType: string;
  jorudanHighwayBus: string;
  jorudanRouteSort: string;
  jorudanSeatPreference: string;
  jorudanUseChargedExpress: string;
  jorudanUseExReservation: string;
};

export const defaultRouteOptionSetting = {
  jorudanAreaPreference: null,
  jorudanChargedExpressDistance: null,
  jorudanCommuterPass: null,
  jorudanFareType: '0',
  jorudanHighwayBus: '0',
  jorudanRouteSort: '0',
  jorudanSeatPreference: '0',
  jorudanUseChargedExpress: '0',
  jorudanUseExReservation: '1',
};

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXP/JORUDAN/ROUTEOPTION/GET',
};

const searchSuccess = (body: any) => {
  return {
    type: ACTIONS.SEARCH_SUCCESS,
    payload: body,
  };
};

export const actions = {
  search:
    (companyId: string) =>
    (dispatch: AppDispatch): Promise<boolean> => {
      return searchRouteOption(companyId)
        .then((res: any) => {
          const {
            jorudanAreaPreference,
            jorudanChargedExpressDistance,
            jorudanCommuterPass,
            jorudanFareType,
            jorudanHighwayBus,
            jorudanRouteSort,
            jorudanSeatPreference,
            jorudanUseChargedExpress,
            jorudanUseExReservation,
          } = res;
          dispatch(
            searchSuccess({
              jorudanAreaPreference,
              jorudanChargedExpressDistance,
              jorudanCommuterPass,
              jorudanFareType: jorudanFareType || '0',
              jorudanHighwayBus: jorudanHighwayBus || '0',
              jorudanRouteSort: jorudanRouteSort || '0',
              jorudanSeatPreference: jorudanSeatPreference || '0',
              jorudanUseChargedExpress: jorudanUseChargedExpress || '0',
              jorudanUseExReservation: jorudanUseExReservation || '1',
            })
          );
          return true;
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}) as Reducer<DefaultRouteOption | null, any>;
