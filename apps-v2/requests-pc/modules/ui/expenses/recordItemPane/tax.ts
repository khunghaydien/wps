import { Reducer } from 'redux';

import _ from 'lodash';

// import {searchTaxType} from '../../../../../domain/models/exp/TaxType'
import {
  ExpTaxTypeList,
  searchTaxTypeList,
} from '../../../../../domain/models/exp/TaxType';

import { AppDispatch } from '../../../AppThunk';

export const ACTIONS = {
  SEARCH_SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/TAX/SET',
  SEARCH_SUCCESS: 'MODULES/EXPENSES/RECORD_ITEM_PANE/TAX/SEARCH_SUCCESS',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/TAX/CLEAR',
};

export type SearchSuccess = {
  payload: {
    [key: string]: {
      [key: string]: ExpTaxTypeList;
    };
  };
  type: typeof ACTIONS['SEARCH_SUCCESS'];
};

const set = (
  expTypeId: string,
  targetDate: string,
  expTaxTypeList: ExpTaxTypeList
) => ({
  type: ACTIONS.SEARCH_SET,
  payload: { [expTypeId]: { [targetDate]: expTaxTypeList } },
});

const searchSuccess = (expTypeId: string, targetDate: string, body: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: { [expTypeId]: { [targetDate]: body.taxTypes } },
});

export const actions = {
  set:
    (expTypeId: string, targetDate: string, expTaxTypeList: ExpTaxTypeList) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(set(expTypeId, targetDate, expTaxTypeList));
    },
  list:
    (expTypeId: string, targetDate: string) =>
    (dispatch: AppDispatch): void | any => {
      return searchTaxTypeList(expTypeId, targetDate)
        .then((res: any) => dispatch(searchSuccess(expTypeId, targetDate, res)))
        .catch((err) => {
          throw err;
        });
    },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {};

export type Props = {
  [key: string]: {
    [key: string]: ExpTaxTypeList;
  };
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SET:
    case ACTIONS.SEARCH_SUCCESS:
      return _.merge(state, action.payload);
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Props, any>;
