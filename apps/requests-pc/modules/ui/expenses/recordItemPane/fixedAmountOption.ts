import { Reducer } from 'redux';

import { get } from 'lodash';

import { getExpenseTypeById } from '../../../../../domain/models/exp/ExpenseType';

import { AppDispatch } from '../../../AppThunk';

/* eslint-disable camelcase */
export type AmountOption = {
  id: string;
  allowanceAmount: number;
  label?: string;
  label_L0: string;
  label_L1: string;
  label_L2?: string;
};

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/RECORD_ITEM_PANE/FIXED_AMOUNT_OPTION/SET',
  SEARCH_SUCCESS:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/FIXED_AMOUNT_OPTION/SEARCH_SUCCESS',
  CLEAR: 'MODULES/EXPENSES/RECORD_ITEM_PANE/FIXED_AMOUNT_OPTION/CLEAR',
};

const set = (expTypeId: string, body: Array<AmountOption>) => ({
  type: ACTIONS.SET,
  payload: { [expTypeId]: body },
});

const searchSuccess = (expTypeId: string, body: Array<AmountOption>) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: { [expTypeId]: body },
});

export const actions = {
  set:
    (expTypeId: string, optionList: Array<AmountOption>) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(set(expTypeId, optionList));
    },
  search:
    (expTypeId: string) =>
    (dispatch: AppDispatch): void | any => {
      return getExpenseTypeById(expTypeId)
        .then((res: any) => {
          const amountOption = get(res, '0.fixedAllowanceOptionList');
          dispatch(searchSuccess(expTypeId, amountOption));
        })
        .catch((err) => {
          throw err;
        });
    },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = {};

type Props = {
  [key: string]: Array<AmountOption>;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
    case ACTIONS.SEARCH_SUCCESS:
      return { ...state, ...action.payload };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Props, any>;
