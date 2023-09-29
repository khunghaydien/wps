import { Reducer } from 'redux';

import { ExpenseTaxTypeList, searchTaxType } from '../../models/exp/TaxType';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/ENTITIES/EXP/TAX_TYPE/SEARCH_SUCCESS',
};

const searchSuccess = (body: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body.records,
});

export const actions = {
  search:
    (targetDate: string) =>
    (dispatch: AppDispatch): void | any => {
      return searchTaxType(targetDate)
        .then((res: any) => {
          dispatch(searchSuccess(res));
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpenseTaxTypeList, any>;
