import { Reducer } from 'redux';

import { OcrInfo } from '@apps/domain/models/exp/Receipt';

export const ACTIONS = {
  SET: 'MODULES/UI/EXP/RECEIPT_LIBRARY/OCR_DETAIL/SET',
  SET_ONE: 'MODULES/UI/EXP/RECEIPT_LIBRARY/OCR_DETAIL/SET_ONE',
  RESET: 'MODULES/UI/EXP/RECEIPT_LIBRARY/OCR_DETAIL/RESET',
};

export const actions = {
  set: (detail: OcrInfoArr) => ({
    type: ACTIONS.SET,
    payload: detail,
  }),
  setOne: (detail: OcrInfo, idx: number) => ({
    type: ACTIONS.SET_ONE,
    payload: { detail, idx },
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

const initialState = [];

type OcrInfoArr = OcrInfo[];

export default ((state: OcrInfoArr = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.SET_ONE:
      const { detail, idx } = action.payload;
      const stateCopy = [...state];
      stateCopy[idx] = detail;
      return stateCopy;
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}) as Reducer<OcrInfoArr, any>;
