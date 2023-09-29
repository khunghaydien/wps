import { Reducer } from 'redux';

import {
  ExpTaxTypeList,
  searchTaxTypeList,
} from '../../../../domain/models/exp/TaxType';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_TAX_TYPE_SUCCESS:
    'MODULES/ENTITIES/EXP/TAX_TYPE/SEARCH_TAX_TYPE_SUCCESS',
};

const searchTaxTypeSuccess = (body: ExpTaxTypeList) => ({
  type: ACTIONS.SEARCH_TAX_TYPE_SUCCESS,
  payload: body,
});

export const actions = {
  list:
    (expTypeId: string, targetDate: string) =>
    (dispatch: AppDispatch): Promise<{ taxTypes: ExpTaxTypeList }> => {
      // @ts-ignore
      return searchTaxTypeList(expTypeId, targetDate).then(
        (res: { taxTypes: ExpTaxTypeList }) =>
          dispatch(searchTaxTypeSuccess(res.taxTypes || []))
      );
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_TAX_TYPE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpTaxTypeList, any>;
