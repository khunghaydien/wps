import DropzoneFile from 'react-dropzone';

// State

export type State = {
  id: string;
  files: DropzoneFile[];
  actedAt: string;
  actor: string;
  status: string;
  count: number;
  successCount: number;
  failureCount: number;
  isNew: boolean;
};

const initialState: State = {
  id: '',
  files: [],
  actedAt: '',
  actor: '',
  status: '',
  count: 0,
  successCount: 0,
  failureCount: 0,
  isNew: false,
};

// Actions

type DropFiles = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/DROP_FILES';
  payload: DropzoneFile[];
};

type Update = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/UPDATE';
  payload: {
    key: keyof State;
    value: any;
  };
};

type Clear = {
  type: 'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/CLEAR';
};

type Action = DropFiles | Update | Clear;

const DROP_FILES: DropFiles['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/DROP_FILES';
const UPDATE: Update['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/UPDATE';
const CLEAR: Clear['type'] =
  'ADMIN-PC/MODULES/TIME_RECORD_ITEM_IMPORT/UI/DETAIL_PANE/CLEAR';

export const actions = {
  dropFiles: (files: DropzoneFile[]): DropFiles => ({
    type: DROP_FILES,
    payload: files,
  }),

  update: (key: keyof State, value: any): Update => ({
    type: UPDATE,
    payload: {
      key,
      value,
    },
  }),

  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case DROP_FILES: {
      return {
        ...state,
        files: [...action.payload],
      };
    }
    case UPDATE: {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    }
    case CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};
