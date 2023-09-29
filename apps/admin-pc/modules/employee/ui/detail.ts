import isNil from 'lodash/isNil';

import {
  defaultValue as defaultBaseRecord,
  MasterEmployeeBase,
} from '../../../../domain/models/organization/MasterEmployeeBase';
import {
  defaultValue as defaultHistoryRecord,
  MasterEmployeeHistory,
} from '../../../../domain/models/organization/MasterEmployeeHistory';

export type State = {
  selectedSubRoleKey: string; // For V2
  selectedHistoryId: string;
  baseRecord: MasterEmployeeBase;
  historyRecord: MasterEmployeeHistory;
};

export const initialState: State = {
  selectedSubRoleKey: '',
  selectedHistoryId: '',
  baseRecord: defaultBaseRecord,
  historyRecord: defaultHistoryRecord,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/INITIALIZE';
};

type SetSelectedHistoryId = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_SELECTED_HISTORY_ID';
  payload: string;
};

type SetSelectedSubRoleKey = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_SELECTED_SUB_ROLE_KEY';
  payload: string;
};

type SetBaseRecord = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_BASE_RECORD';
  payload: MasterEmployeeBase;
};

type SetHistoryRecord = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_HISTORY_RECORD';
  payload: MasterEmployeeHistory;
};

type SetBaseRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: MasterEmployeeBase[keyof MasterEmployeeBase];
  };
};

type SetHistoryRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: MasterEmployeeHistory[keyof MasterEmployeeHistory];
  };
};

type Action =
  | Initialize
  | SetSelectedHistoryId
  | SetSelectedSubRoleKey
  | SetBaseRecord
  | SetHistoryRecord
  | SetBaseRecordByKeyValue
  | SetHistoryRecordByKeyValue;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/INITIALIZE';

export const SET_SELECTED_HISTORY_ID: SetSelectedHistoryId['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_SELECTED_HISTORY_ID';

export const SET_SELECTED_SUB_ROLE_KEY: SetSelectedSubRoleKey['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_SELECTED_SUB_ROLE_KEY';

export const SET_BASE_RECORD: SetBaseRecord['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_BASE_RECORD';

export const SET_HISTORY_RECORD: SetHistoryRecord['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_HISTORY_RECORD';

export const SET_BASE_RECORD_BY_KEY_VALUE: SetBaseRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';

export const SET_HISTORY_RECORD_BY_KEY_VALUE: SetHistoryRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setSelectedHistoryId: (value: string): SetSelectedHistoryId => ({
    type: SET_SELECTED_HISTORY_ID,
    payload: value,
  }),
  setSelectedSubRoleKey: (value: string): SetSelectedSubRoleKey => ({
    type: SET_SELECTED_SUB_ROLE_KEY,
    payload: value,
  }),
  setBaseRecord: (baseRecord: MasterEmployeeBase): SetBaseRecord => ({
    type: SET_BASE_RECORD,
    payload: baseRecord,
  }),
  setHistoryRecord: (
    historyRecord: MasterEmployeeHistory
  ): SetHistoryRecord => ({
    type: SET_HISTORY_RECORD,
    payload: historyRecord,
  }),
  setBaseRecordByKeyValue: (
    key: keyof MasterEmployeeBase,
    value: MasterEmployeeBase[keyof MasterEmployeeBase]
  ): SetBaseRecordByKeyValue => ({
    type: SET_BASE_RECORD_BY_KEY_VALUE,
    payload: {
      // @ts-ignore
      key,
      value,
    },
  }),
  setHistoryRecordByKeyValue: (
    key: keyof MasterEmployeeHistory,
    value: MasterEmployeeHistory[keyof MasterEmployeeHistory]
  ): SetHistoryRecordByKeyValue => ({
    type: SET_HISTORY_RECORD_BY_KEY_VALUE,
    // @ts-ignore
    payload: { key, value },
  }),
};

const convertForView = <T extends Record<string, any>>(
  record: T,
  defaultValue: T
): T =>
  Object.keys(record).reduce(
    (result: T, key: string) => {
      if (isNil(result[key])) {
        // @ts-ignore
        result[key] = defaultValue[key];
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

    case SET_SELECTED_HISTORY_ID: {
      return {
        ...state,
        selectedHistoryId: action.payload,
      };
    }

    case SET_SELECTED_SUB_ROLE_KEY: {
      return {
        ...state,
        selectedSubRoleKey: action.payload,
      };
    }

    case SET_BASE_RECORD: {
      return {
        ...state,
        baseRecord: convertForView(action.payload, defaultBaseRecord),
      };
    }

    case SET_HISTORY_RECORD: {
      return {
        ...state,
        historyRecord: convertForView(action.payload, defaultHistoryRecord),
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

    case SET_HISTORY_RECORD_BY_KEY_VALUE: {
      const { key, value } = action.payload;
      return {
        ...state,
        historyRecord: {
          ...state.historyRecord,
          [key]: value,
        },
      };
    }

    default:
      return state;
  }
};
