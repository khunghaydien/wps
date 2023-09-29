import { Reducer } from 'redux';

import _ from 'lodash';

import {
  ExpTaxTypeList,
  searchTaxTypeList,
} from '@apps/domain/models/exp/TaxType';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXPENSE/UI/TAX/TAX_TYPES/SEARCH_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/EXPENSE/UI/TAX/TAX_TYPES/CLEAR_SUCCESS',
};

const searchSuccess = (
  expTypeId: string,
  targetDate: string,
  body: { taxTypes: ExpTaxTypeList }
) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: { [expTypeId]: { [targetDate]: body.taxTypes } },
});

export const actions = {
  search:
    (expTypeId: string, targetDate: string) =>
    (dispatch: AppDispatch): Promise<ExpTaxTypeList> => {
      return searchTaxTypeList(expTypeId, targetDate)
        .then((res: { taxTypes: ExpTaxTypeList }) => {
          dispatch(searchSuccess(expTypeId, targetDate, res));
          return res.taxTypes;
        })
        .catch((err) => {
          throw err;
        });
    },
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

//
// Reducer
//
const initialState = {};

type Props = {
  [key: string]: {
    [key: string]: ExpTaxTypeList;
  };
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return _.merge(state, action.payload);
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Props, any>;
