import { BatchResult } from '@attendance/repositories/AttPatternEmployeeBatchRepository';

// State

export type State = BatchResult[];

const initialState: State = [];

// Actions

type SearchSuccess = {
  type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/BATCHRESULTLIST/SEARCH_SUCCESS';
  payload: BatchResult[];
};

type Action = SearchSuccess;

const SEARCH_SUCCESS: SearchSuccess['type'] =
  'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/BATCHRESULTLIST/SEARCH_SUCCESS';

export const actions = {
  searchSuccess: (results: BatchResult[]) => ({
    type: SEARCH_SUCCESS,
    payload: results,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SEARCH_SUCCESS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};
