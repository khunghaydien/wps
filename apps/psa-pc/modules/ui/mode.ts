//
// constants
//
export const ACTIONS = {
  INITIALIZE: 'MODULES/UI/MODE/INITIALIZE',
  PROJECT_SELECT: 'MODULES/UI/MODE/PROJECT_SELECT',
  PROJECT_EDIT: 'MODULES/UI/MODE/PROJECT_EDIT',
  PROJECT_SAVE: 'MODULES/UI/MODE/PROJECT_SAVE',
  DIRECT_ASSIGNMENT: 'MODULES/UI/MODE/DIRECT_ASSIGNMENT',
  ROLE_DETAILS_FROM_ALL_RESOURCES:
    'MODULES/UI/MODE/ROLE_DETAILS_FROM_ALL_RESOURCES',
};

export const modes = {
  INITIALIZE: 'INITIALIZE',
  PROJECT_SELECT: 'PROJECT_SELECT',
  PROJECT_EDIT: 'PROJECT_EDIT',
  PROJECT_SAVE: 'PROJECT_SAVE',
  DIRECT_ASSIGNMENT: 'DIRECT_ASSIGNMENT',
  ROLE_DETAILS_FROM_ALL_RESOURCES: 'ROLE_DETAILS_FROM_ALL_RESOURCES',
};

//
// actions
//
export const actions = {
  initialize: () => ({
    type: ACTIONS.INITIALIZE,
    payload: modes.INITIALIZE,
  }),
  selectProject: () => ({
    type: ACTIONS.PROJECT_SELECT,
    payload: modes.PROJECT_SELECT,
  }),
  editProject: () => ({
    type: ACTIONS.PROJECT_EDIT,
    payload: modes.PROJECT_EDIT,
  }),
  saveProject: () => ({
    type: ACTIONS.PROJECT_SAVE,
    payload: modes.PROJECT_SAVE,
  }),
  directAssignment: () => ({
    type: ACTIONS.DIRECT_ASSIGNMENT,
    payload: modes.DIRECT_ASSIGNMENT,
  }),
  selectRoleFromAllResources: () => ({
    type: ACTIONS.ROLE_DETAILS_FROM_ALL_RESOURCES,
    payload: modes.ROLE_DETAILS_FROM_ALL_RESOURCES,
  }),
};

//
// Reducer
//
const initialState = modes.INITIALIZE;

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.INITIALIZE:
    case ACTIONS.PROJECT_SELECT:
    case ACTIONS.PROJECT_EDIT:
    case ACTIONS.PROJECT_SAVE:
    case ACTIONS.DIRECT_ASSIGNMENT:
    case ACTIONS.ROLE_DETAILS_FROM_ALL_RESOURCES:
      return action.payload;
    default:
      return state;
  }
};
