import { TimeRecordItemImportResult } from '@apps/repositories/time-tracking/TimeRecordItemImportRepository';

// State

export type State = TimeRecordItemImportResult[];

const initialState: State = [];

// Actions

type ListSuccess = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/ENTITIES/IMPORT_RESULT_LIST/LIST_SUCCESS';
  payload: TimeRecordItemImportResult[];
};

type Action = ListSuccess;

const LIST_SUCCESS: ListSuccess['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/ENTITIES/IMPORT_RESULT_LIST/LIST_SUCCESS';

export const actions = {
  listSuccess: (results: TimeRecordItemImportResult[]) => ({
    type: LIST_SUCCESS,
    payload: results,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LIST_SUCCESS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};
