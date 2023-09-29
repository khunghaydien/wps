import { Reducer } from 'redux';

import { RecordItem } from '../../../../../domain/models/exp/Record';

import { AppDispatch } from '../../AppThunk';

/*
 * Handle item values for hotel fee record
 * e.g. when open EI page from item page, tmp item values should be kept
 */

export const ACTIONS = {
  SAVE_ITEM: 'MODULES/EXPENSE/UI/GENERAL/ITEM_VALUES/SAVE_ITEM',
  CLEAR_ITEM: 'MODULES/EXPENSE/UI/GENERAL/ITEM_VALUES/CLEAR_ITEM',
};

const itemValues = (body: RecordItem) => ({
  type: ACTIONS.SAVE_ITEM,
  payload: body,
});

const clearItem = () => ({
  type: ACTIONS.CLEAR_ITEM,
  payload: {},
});

export const actions = {
  save: (values: RecordItem) => (dispatch: AppDispatch) =>
    dispatch(itemValues(values)),
  clear: () => (dispatch: AppDispatch) => dispatch(clearItem()),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_ITEM:
      return action.payload;
    case ACTIONS.CLEAR_ITEM:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RecordItem | { [key: string]: never }, any>;
