import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

// State
type State = OrganizationHierarchyHistory[];

const initialState: State = [];

// Actions
const ACTION_ROOT = 'ADMIN-PC-V2/ORGANIZATION_HIERARCHY/ENTITIES/HISTORIES';
const ActionType = {
  SET: `${ACTION_ROOT}/SET`,
  CLEAR: `${ACTION_ROOT}/CLEAR`,
};

type SetAction = {
  type: typeof ActionType.SET;
  payload: OrganizationHierarchyHistory[];
};

type ClearAction = {
  type: typeof ActionType.CLEAR;
};

export const actions = {
  set: (histories: OrganizationHierarchyHistory[]): SetAction => ({
    type: ActionType.SET,
    payload: histories,
  }),
  clear: (): ClearAction => ({ type: ActionType.CLEAR }),
};

type Action = SetAction | ClearAction;

// Reducer
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET: {
      return (action as SetAction).payload;
    }
    case ActionType.CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
