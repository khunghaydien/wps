export type State = {
  code: string;
  name: string;
  parentExpenseTypeGroupName: string;
  recordType: string;
  foreignCurrencyUsage: string;
  receiptSetting: string;
};

export const initialState: State = {
  code: '',
  name: '',
  parentExpenseTypeGroupName: '',
  recordType: '',
  foreignCurrencyUsage: '',
  receiptSetting: '',
};

// Actions
type Initialize = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/SEARCH_CONDITION/INITIALIZE';
  payload?: State;
};

type Set = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/SEARCH_CONDITION/SET';
  payload: {
    key: string;
    value: string;
  };
};

type Action = Initialize | Set;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/SEARCH_CONDITION/INITIALIZE';

export const SET: Set['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/SEARCH_CONDITION/SET';

export const actions = {
  initialize: (values?: State) => ({
    type: INITIALIZE,
    payload: values,
  }),
  set: (key: string, value: string): Set => ({
    type: SET,
    payload: {
      key,
      value,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE:
      return action.payload || initialState;
    case SET: {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };
    }

    default:
      return state;
  }
};
