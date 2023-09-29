import isNil from 'lodash/isNil';

import {
  defaultValue as defaultBaseRecord,
  MasterDepartmentBase,
} from '../../../../domain/models/organization/MasterDepartmentBase';
import {
  defaultValue as defaultHistoryRecord,
  MasterDepartmentHistory,
} from '../../../../domain/models/organization/MasterDepartmentHistory';

export type State = {
  selectedHistoryId: string;
  baseRecord: MasterDepartmentBase;
  historyRecord: MasterDepartmentHistory;
};

export const initialState: State = {
  selectedHistoryId: '',
  baseRecord: defaultBaseRecord,
  historyRecord: defaultHistoryRecord,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/INITIALIZE';
};

type SetSelectedHistoryId = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_SELECTED_HISTORY_ID';
  payload: string;
};

type SetBaseRecord = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_BASE_RECORD';
  payload: MasterDepartmentBase;
};

type SetHistoryRecord = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_HISTORY_RECORD';
  payload: MasterDepartmentHistory;
};

type SetBaseRecordByKeyValue = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: MasterDepartmentBase[keyof MasterDepartmentBase];
  };
};

type SetHistoryRecordByKeyValue = {
  type: 'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: MasterDepartmentHistory[keyof MasterDepartmentHistory];
  };
};

type Action =
  | Initialize
  | SetSelectedHistoryId
  | SetBaseRecord
  | SetHistoryRecord
  | SetBaseRecordByKeyValue
  | SetHistoryRecordByKeyValue;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/INITIALIZE';

export const SET_SELECTED_HISTORY_ID: SetSelectedHistoryId['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_SELECTED_HISTORY_ID';

export const SET_BASE_RECORD: SetBaseRecord['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_BASE_RECORD';

export const SET_HISTORY_RECORD: SetHistoryRecord['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_HISTORY_RECORD';

export const SET_BASE_RECORD_BY_KEY_VALUE: SetBaseRecordByKeyValue['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';

export const SET_HISTORY_RECORD_BY_KEY_VALUE: SetHistoryRecordByKeyValue['type'] =
  'ADMIN-PC-V2/MODULES/DEPARTMENT/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setSelectedHistoryId: (value: string): SetSelectedHistoryId => ({
    type: SET_SELECTED_HISTORY_ID,
    payload: value,
  }),
  setBaseRecord: (baseRecord: MasterDepartmentBase): SetBaseRecord => ({
    type: SET_BASE_RECORD,
    payload: baseRecord,
  }),
  setHistoryRecord: (
    historyRecord: MasterDepartmentHistory
  ): SetHistoryRecord => ({
    type: SET_HISTORY_RECORD,
    payload: historyRecord,
  }),
  setBaseRecordByKeyValue: (
    key: keyof MasterDepartmentBase,
    value: MasterDepartmentBase[keyof MasterDepartmentBase]
  ): SetBaseRecordByKeyValue => ({
    type: SET_BASE_RECORD_BY_KEY_VALUE,
    payload: {
      // @ts-ignore
      key,
      value,
    },
  }),
  setHistoryRecordByKeyValue: (
    key: keyof MasterDepartmentHistory,
    value: MasterDepartmentHistory[keyof MasterDepartmentHistory]
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

    case SET_BASE_RECORD: {
      return {
        ...state,
        baseRecord: convertForView(action.payload, defaultBaseRecord),
      };
    }

    case SET_HISTORY_RECORD: {
      return {
        ...state,
        historyRecord: {
          hierarchyPatternId: state.historyRecord.hierarchyPatternId,
          ...convertForView(action.payload, defaultHistoryRecord),
        },
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
