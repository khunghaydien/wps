import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/TRANSACTION_ADV_SEARCH/CARD_NAME_HISTORY_IDS/SET',
  CLEAR:
    'MODULES/EXPENSE/UI/TRANSACTION_ADV_SEARCH/CARD_NAME_HISTORY_IDS/CLEAR',
};

export type CardNameHistoryIds = Array<string>;

type SetAction = {
  type: string;
  payload: CardNameHistoryIds;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (cardNameHistoryIds: CardNameHistoryIds): SetAction => ({
    type: ACTIONS.SET,
    payload: cardNameHistoryIds,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

export const initialState = [];

export default ((state: CardNameHistoryIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<CardNameHistoryIds, any>;
