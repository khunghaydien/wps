import { Reducer } from 'redux';

import { SelectedReceipt } from '../../../../domain/models/exp/Receipt';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/SELECTED_OCR_RECEIPT/SET',
  CLEAR: 'MODULES/EXPENSE/UI/SELECTED_OCR_RECEIPT/CLEAR',
};

export const actions = {
  set: (selectedReceipt: SelectedReceiptArr) => ({
    type: ACTIONS.SET,
    payload: selectedReceipt,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

type SelectedReceiptArr = SelectedReceipt[];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<SelectedReceiptArr | any>;
