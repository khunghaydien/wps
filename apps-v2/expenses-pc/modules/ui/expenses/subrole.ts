import { Reducer } from 'redux';

//
// constants
//
const ACTIONS = {
  SET_ACTIVE_SUBROLES: 'MODULES/UI/SUBROLE/SET_ACTIVE_SUBROLES',
  SET_SUB_ROLE_KEY: 'COMMONS/EXP/ENTITIES/EMPLOYEE_DETAILS/SET_SUB_ROLE_KEY',
  CLEAR: 'MODULES/UI/SUBROLE/CLEAR',
};

//
// actions
//
export const actions = {
  setSubroleIds: (ids: Array<string>) => ({
    type: ACTIONS.SET_ACTIVE_SUBROLES,
    data: ids,
  }),
  setSelectedSubRole: (subRoleKey: string): any => ({
    type: ACTIONS.SET_SUB_ROLE_KEY,
    payload: subRoleKey,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = { ids: undefined, companyId: undefined };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ACTIVE_SUBROLES:
      return { ...state, ids: action.data };
    case ACTIONS.SET_SUB_ROLE_KEY:
      return { ...state, selectedRole: action.payload };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<{ ids?: Array<string>; selectedRole?: string }, any>;
