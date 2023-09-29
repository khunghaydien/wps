import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

// State
type State = OrganizationHierarchyHistory;

const initialState: State = null;

// Actions
const ACTION_ROOT = 'ADMIN-PC-V2/ORGANIZATION_HIERARCHY/UI/SELECTED_HISTORY';
const ActionType = {
  SET: `${ACTION_ROOT}/SET`,
  CLEAR: `${ACTION_ROOT}/CLEAR`,
};

type SetCurrentHistoryAction = {
  type: typeof ActionType.SET;
  payload: OrganizationHierarchyHistory;
};

type ClearAction = {
  type: typeof ActionType.CLEAR;
};

export const actions = {
  set: (history: OrganizationHierarchyHistory): SetCurrentHistoryAction => ({
    type: ActionType.SET,
    payload: history,
  }),
  clear: (): ClearAction => ({ type: ActionType.CLEAR }),
};

type Action = SetCurrentHistoryAction | ClearAction;

// Reducer
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET: {
      return (action as SetCurrentHistoryAction).payload;
    }
    case ActionType.CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
