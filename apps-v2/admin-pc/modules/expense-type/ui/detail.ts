import isNil from 'lodash/isNil';

import {
  defaultValue as defaultBaseRecord,
  ExpenseType,
} from '../../../../domain/models/exp/ExpenseType';

export type State = {
  baseRecord: ExpenseType;
};

export const initialState: State = {
  baseRecord: defaultBaseRecord,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/INITIALIZE';
};

type SetBaseRecord = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/SET_BASE_RECORD';
  payload: ExpenseType;
};

type SetBaseRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: ExpenseType[keyof ExpenseType];
  };
};

type Action = Initialize | SetBaseRecord | SetBaseRecordByKeyValue;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/INITIALIZE';

export const SET_BASE_RECORD: SetBaseRecord['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/SET_BASE_RECORD';

export const SET_BASE_RECORD_BY_KEY_VALUE: SetBaseRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/EXPENSE_TYPE/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setBaseRecord: (baseRecord: ExpenseType): SetBaseRecord => ({
    type: SET_BASE_RECORD,
    payload: baseRecord,
  }),
  setBaseRecordByKeyValue: (
    key: keyof ExpenseType,
    value: ExpenseType[keyof ExpenseType]
  ): SetBaseRecordByKeyValue => ({
    type: SET_BASE_RECORD_BY_KEY_VALUE,
    payload: {
      key,
      value,
    },
  }),
};

const convertForView = <T extends Record<string, any>>(record: T): T =>
  Object.keys(record).reduce(
    (result: T, key: string) => {
      if (isNil(result[key])) {
        // @ts-ignore
        result[key] = defaultBaseRecord[key];
      }
      return result;
    },
    { ...record }
  );

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }

    case SET_BASE_RECORD: {
      return {
        ...state,
        baseRecord: convertForView(action.payload),
      };
    }

    case SET_BASE_RECORD_BY_KEY_VALUE: {
      const { key, value } = action.payload;
      return {
        ...state,
        baseRecord: {
          ...state.baseRecord,
          [key]: value,
        },
      };
    }

    default:
      return state;
  }
};
