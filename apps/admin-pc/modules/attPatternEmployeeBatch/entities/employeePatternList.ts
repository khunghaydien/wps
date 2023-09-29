import { EmployeePattern } from '../../../../repositories/attendance/AttPatternEmployeeBatchRepository';

// State

export type State = {
  list: EmployeePattern[];
  isValid: boolean;
};

const initialState: State = {
  list: [],
  isValid: true,
};

// Actions

type Add = {
  type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ADD';
  payload: EmployeePattern;
};

type Clear = {
  type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/CLEAR';
};

type Error = {
  type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ERROR';
};

type Action = Add | Clear | Error;

const ADD: Add['type'] =
  'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ADD';
const CELAR: Clear['type'] =
  'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/CLEAR';
const ERROR: Error['type'] =
  'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ERROR';

export const actions = {
  add: (pattern: EmployeePattern): Add => ({
    type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ADD',
    payload: pattern,
  }),
  clear: (): Clear => ({
    type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/CLEAR',
  }),
  error: (): Error => ({
    type: 'ADMIN-PC/MODULES/ATTPATTERNEMPLOYEEBATCH/ENTITIES/ATTPATTERNEMPLOYEEBATCH/ERROR',
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
