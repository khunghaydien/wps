import { Reducer } from 'redux';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';

import {
  MileageRate,
  searchMileageRate,
  SearchMileageRateRequest,
} from '@apps/domain/models/exp/Mileage';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/UI/EXP/MILEAGE_RATE/SEARCH',
  CLEAR: 'MODULES/UI/EXP/MILEAGE_RATE/CLEAR',
};

export const searchSuccess = (rates: Array<MileageRate>) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: rates,
});

const clear = () => ({ type: ACTIONS.CLEAR });

export const actions = {
  search:
    (
      param: SearchMileageRateRequest,
      withLoader?: boolean,
      loadingArea?: string
    ) =>
    (dispatch: AppDispatch) => {
      if (withLoader) {
        const payload = loadingArea ? { areas: loadingArea } : null;
        dispatch(loadingStart(payload));
      }
      return searchMileageRate(param).then((response) => {
        dispatch(searchSuccess(response.records));
        if (withLoader) dispatch(loadingEnd(loadingArea));
        return response.records;
      });
    },
  clear,
};

const initialState: Array<MileageRate> = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<MileageRate>, any>;

export const mileageRateSelect = 'MileageRateSelect';
