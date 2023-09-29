import { TimeRecordItemImportRecord } from '@apps/repositories/time-tracking/TimeRecordItemImportRepository';

// State

export type State = {
  list: TimeRecordItemImportRecord[];
  isValid: boolean;
};

const initialState: State = {
  list: [],
  isValid: true,
};

// Actions

type Add = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ADD';
  payload: TimeRecordItemImportRecord;
};

type Clear = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/CLEAR';
};

type Error = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ERROR';
};

type Action = Add | Clear | Error;

const ADD: Add['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ADD';
const CELAR: Clear['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/CLEAR';
const ERROR: Error['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ERROR';

export const actions = {
  add: (pattern: TimeRecordItemImportRecord): Add => ({
    type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ADD',
    payload: pattern,
  }),
  clear: (): Clear => ({
    type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/CLEAR',
  }),
  error: (): Error => ({
    type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/TIME_RECORD_ITEM_IMPORT_LIST/ERROR',
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ADD: {
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    }
    case CELAR: {
      return initialState;
    }
    case ERROR: {
      return {
        ...state,
        isValid: false,
      };
    }
    default:
      return state;
  }
};
