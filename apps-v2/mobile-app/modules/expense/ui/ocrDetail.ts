import { Reducer } from 'redux';

import { OcrInfo } from '@apps/domain/models/exp/Receipt';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/OCR_DETAIL/SET',
  RESET: 'MODULES/EXPENSE/UI/OCR_DETAIL/RESET',
};

export const actions = {
  set: (detail: OcrInfoArr) => ({
    type: ACTIONS.SET,
    payload: detail,
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
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}) as Reducer<OcrInfoArr, any>;
