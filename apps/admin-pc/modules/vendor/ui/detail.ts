import isNil from 'lodash/isNil';

import {
  defaultValue as defaultBaseRecord,
  Vendor,
} from '../../../../domain/models/exp/Vendor';

export type State = {
  baseRecord: Vendor;
};

export const initialState: State = {
  baseRecord: defaultBaseRecord,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/INITIALIZE';
};

type SetBaseRecord = {
  type: 'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/SET_BASE_RECORD';
  payload: Vendor;
};

type SetBaseRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: Vendor[keyof Vendor];
  };
};

type Action = Initialize | SetBaseRecord | SetBaseRecordByKeyValue;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/INITIALIZE';

export const SET_BASE_RECORD: SetBaseRecord['type'] =
  'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/SET_BASE_RECORD';

export const SET_BASE_RECORD_BY_KEY_VALUE: SetBaseRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/VENDOR/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setBaseRecord: (baseRecord: Vendor): SetBaseRecord => ({
    type: SET_BASE_RECORD,
    payload: baseRecord,
  }),
  setBaseRecordByKeyValue: (
    key: keyof Vendor,
    value: Vendor[keyof Vendor]
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
