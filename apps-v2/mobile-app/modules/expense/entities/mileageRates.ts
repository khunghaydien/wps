import { Reducer } from 'redux';

import {
  MileageRate,
  searchMileageRate,
} from '@apps/domain/models/exp/Mileage';

import { AppDispatch } from '../AppThunk';

export enum Actions {
  SEARCH_MILEAGE_RATE_SUCCESS = 'MODULES/ENTITIES/EXP/TAX_TYPE/SEARCH_MILEAGE_RATE_SUCCESS',
}

const searchMileageRatesSuccess = (mileageRates: Array<MileageRate>) => ({
  type: Actions.SEARCH_MILEAGE_RATE_SUCCESS,
  payload: mileageRates,
});

export const actions = {
  search:
    (companyId: string, targetDate?: string) =>
    (dispatch: AppDispatch): Promise<Array<MileageRate>> => {
      return searchMileageRate({ companyId, targetDate }).then(
        ({ records }) => {
          dispatch(searchMileageRatesSuccess(records));
          return records;
        }
      );
    },
};

type Action = {
  type: Actions.SEARCH_MILEAGE_RATE_SUCCESS;
  payload: Array<MileageRate>;
};

const initialState: Array<MileageRate> = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case Actions.SEARCH_MILEAGE_RATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<MileageRate>, Action>;
