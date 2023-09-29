import { SEARCH_RECORD_ACCESS } from '@apps/admin-pc-v2/actions/recordAccess';

export type RecordAccess = {
  id: string;
  code: string;
  name: string;
  orgHierarchyPtnId: string;
  orgHierarchyPtnName: string;
};

export interface RecordAccessState {
  list: Array<RecordAccess>;
}
const initialState: RecordAccessState = {
  list: [],
};

export default function recordAccessReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_RECORD_ACCESS:
      return { ...state, list: action.payload };
    default:
      return state;
  }
}
