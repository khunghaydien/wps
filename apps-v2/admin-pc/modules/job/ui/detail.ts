import isNil from 'lodash/isNil';

import {
  defaultValue as defaultBaseRecord,
  Job,
} from '../../../../domain/models/organization/Job';
import {
  defaultValue as defaultHistoryRecord,
  JobHistory,
} from '../../../../domain/models/organization/JobHistory';

export type State = {
  baseRecord: Job;
  historyRecord: JobHistory;
  selectedHistoryId: string;
};

export const initialState: State = {
  baseRecord: defaultBaseRecord,
  historyRecord: defaultHistoryRecord,
  selectedHistoryId: '',
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/INITIALIZE';
};

type SetBaseRecord = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_BASE_RECORD';
  payload: Job;
};

type SetBaseRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: Job[keyof Job];
  };
};

type SetHistoryRecord = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_HISTORY_RECORD';
  payload: JobHistory;
};

type SetHistoryRecordByKeyValue = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';
  payload: {
    key: string;
    value: JobHistory[keyof JobHistory];
  };
};

type SelectHistory = {
  type: 'ADMIN-PC/MODULES/JOB/UI/DETAIL/SELECT_HISTORY';
  payload: string;
};

type Action =
  | Initialize
  | SetBaseRecord
  | SetBaseRecordByKeyValue
  | SetHistoryRecord
  | SetHistoryRecordByKeyValue
  | SelectHistory;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/INITIALIZE';

export const SET_BASE_RECORD: SetBaseRecord['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_BASE_RECORD';

export const SET_BASE_RECORD_BY_KEY_VALUE: SetBaseRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_BASE_RECORD_BY_KEY_VALUE';

export const SET_HISTORY_RECORD: SetHistoryRecord['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_HISTORY_RECORD';

export const SET_HISTORY_RECORD_BY_KEY_VALUE: SetHistoryRecordByKeyValue['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/SET_HISTORY_RECORD_BY_KEY_VALUE';

export const SELECT_HISTORY: SelectHistory['type'] =
  'ADMIN-PC/MODULES/JOB/UI/DETAIL/SELECT_HISTORY';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setBaseRecord: (baseRecord: Job): SetBaseRecord => ({
    type: SET_BASE_RECORD,
    payload: baseRecord,
  }),
  setBaseRecordByKeyValue: (
    key: keyof Job,
    value: Job[keyof Job]
  ): SetBaseRecordByKeyValue => ({
    type: SET_BASE_RECORD_BY_KEY_VALUE,
    payload: {
      key,
      value,
    },
  }),
  setHistoryRecord: (historyRecord: JobHistory): SetHistoryRecord => ({
    type: SET_HISTORY_RECORD,
    payload: historyRecord,
  }),
  setHistoryRecordByKeyValue: (
    key: keyof JobHistory,
    value: JobHistory[keyof JobHistory]
  ): SetHistoryRecordByKeyValue => ({
    type: SET_HISTORY_RECORD_BY_KEY_VALUE,
    payload: {
      key,
      value,
    },
  }),
  selectHistory: (id: string): SelectHistory => ({
    type: SELECT_HISTORY,
    payload: id,
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

    case SET_BASE_RECORD: {
      return {
        ...state,
        baseRecord: convertForView(action.payload, defaultBaseRecord),
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

    case SET_HISTORY_RECORD: {
      return {
        ...state,
        historyRecord: convertForView(action.payload, defaultHistoryRecord),
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

    case SELECT_HISTORY: {
      return {
        ...state,
        selectedHistoryId: action.payload,
      };
    }

    default:
      return state;
  }
};
