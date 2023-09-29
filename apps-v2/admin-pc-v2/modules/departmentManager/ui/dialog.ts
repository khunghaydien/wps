import { $Values } from 'utility-types';

export const DIALOG_STATE = Object.freeze({
  NONE: '',
  DEPT_MANAGER: 'deptManager',
  EMPLOYEE: 'employee',
  POSITION: 'position',
});

export type TYPE = $Values<typeof DIALOG_STATE>;

const initialState = DIALOG_STATE.NONE;

// Actions
type Set = {
  type: 'ADMIN-PC-V2/MODULES/DEPT_MANAGER/UI/DIALOG/SET';
  payload: string;
};
type Unset = { type: 'ADMIN-PC-V2/MODULES/DEPT_MANAGER/UI/DIALOG/UNSET' };

type Action = Set | Unset;

export const SET: Set['type'] =
  'ADMIN-PC-V2/MODULES/DEPT_MANAGER/UI/DIALOG/SET';

export const UNSET: Unset['type'] =
  'ADMIN-PC-V2/MODULES/DEPT_MANAGER/UI/DIALOG/UNSET';

export const actions = {
  set: (payload) => ({ type: SET, payload }),
  hide: () => ({ type: UNSET }),
};

// Reducer
export default (state: string = initialState, action: Action): string => {
  switch (action.type) {
    case SET:
      return action.payload;
    case UNSET:
    default:
      return state;
  }
};
