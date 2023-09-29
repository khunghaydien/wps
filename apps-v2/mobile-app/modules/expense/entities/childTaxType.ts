import { Reducer } from 'redux';

import merge from 'lodash/merge';

import {
  ExpTaxTypeList,
  searchTaxTypeList,
} from '@apps/domain/models/exp/TaxType';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CHILD_TAX_TYPE/SEARCH_SUCCESS',
};

export type TaxTypeByExpTypeId = {
  [expTypeId: string]: { [date: string]: ExpTaxTypeList };
};
export type SearchSuccess = {
  type: typeof ACTIONS.SEARCH_SUCCESS;
  payload: TaxTypeByExpTypeId;
};

const searchSuccess = (taxTypeByExpTypeId: TaxTypeByExpTypeId) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: taxTypeByExpTypeId,
});

export const actions = {
  search:
    (expTypeId: string, targetDate: string) =>
    (dispatch: AppDispatch): Promise<{ taxTypes: ExpTaxTypeList }> => {
      // @ts-ignore
      return searchTaxTypeList(expTypeId, targetDate).then(
        (res: { taxTypes: ExpTaxTypeList }) => {
          const taxTypeByExpTypeId = {
            [expTypeId]: { [targetDate]: res.taxTypes || [] },
          };
          dispatch(searchSuccess(taxTypeByExpTypeId));
          return taxTypeByExpTypeId;
        }
      );
    },
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return merge(state, action.payload);
    default:
      return state;
  }
}) as Reducer<TaxTypeByExpTypeId, SearchSuccess>;
