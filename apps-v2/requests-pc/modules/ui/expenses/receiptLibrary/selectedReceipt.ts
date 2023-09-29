import { Reducer } from 'redux';

import { SelectedReceipt } from '../../../../../domain/models/exp/Receipt';

export const ACTIONS = {
  SET: 'MODULES/UI/EXP/RECEIPT_LIBRARY/SELECTED_RECEIPT/SET',
  DELETE: 'MODULES/UI/EXP/RECEIPT_LIBRARY/SELECTED_RECEIPT/DELETE',
  CLEAR: 'MODULES/UI/EXP/RECEIPT_LIBRARY/SELECTED_RECEIPT/CLEAR',
};

export const actions = {
  set: (
    targetedReceipt: SelectedReceipt,
    isSingleSelection: boolean,
    isSelected: boolean
  ) => ({
    type: ACTIONS.SET,
    payload: { targetedReceipt, isSingleSelection, isSelected },
  }),
  delete: (receiptId: string) => ({
    type: ACTIONS.DELETE,
    payload: receiptId,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

const initialState = [];

type State = Array<SelectedReceipt>;

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const { targetedReceipt, isSingleSelection, isSelected } = action.payload;
      let updateState = [];

      if (isSingleSelection) {
        updateState = [targetedReceipt];
      } else if (isSelected) {
        updateState = state.filter(
          ({ receiptFileId }) => receiptFileId !== targetedReceipt.receiptFileId
        );
      } else {
        updateState = [...state, targetedReceipt];
      }

      return updateState;
    case ACTIONS.DELETE:
      const filteredState = state.filter(
        ({ receiptId }) => receiptId !== action.payload
      );
      return filteredState;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
