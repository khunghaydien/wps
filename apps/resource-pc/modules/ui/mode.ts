import { Reducer } from 'redux';

//
// constants
//
export const ACTIONS = {
  INITIALIZE: 'MODULES/UI/MODE/INITIALIZE',
  REQUEST_SELECT: 'MODULES/UI/MODE/REQUEST_SELECT',
  REQUEST_EDIT: 'MODULES/UI/MODE/REQUEST_EDIT',
  REQUEST_SAVE: 'MODULES/UI/MODE/REQUEST_SAVE',
  RESOURCE_ASSIGNMENT: 'MODULES/UI/MODE/RESOURCE_ASSIGNMENT',
  ROLE_DETAILS_FROM_ALL_RESOURCES:
    'MODULES/UI/MODE/ROLE_DETAILS_FROM_ALL_RESOURCES',
};

export const modes = {
  INITIALIZE: 'INITIALIZE',
  REQUEST_SELECT: 'REQUEST_SELECT',
  REQUEST_EDIT: 'REQUEST_EDIT',
  REQUEST_SAVE: 'REQUEST_SAVE',
  RESOURCE_ASSIGNMENT: 'RESOURCE_ASSIGNMENT',
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
  selectRequest: () => ({
    type: ACTIONS.REQUEST_SELECT,
    payload: modes.REQUEST_SELECT,
  }),
  editRequest: () => ({
    type: ACTIONS.REQUEST_EDIT,
    payload: modes.REQUEST_EDIT,
  }),
  saveRequest: () => ({
    type: ACTIONS.REQUEST_SAVE,
    payload: modes.REQUEST_SAVE,
  }),
  resourceAssignment: () => ({
    type: ACTIONS.RESOURCE_ASSIGNMENT,
    payload: modes.RESOURCE_ASSIGNMENT,
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

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.INITIALIZE:
    case ACTIONS.REQUEST_SELECT:
    case ACTIONS.REQUEST_EDIT:
    case ACTIONS.REQUEST_SAVE:
    case ACTIONS.RESOURCE_ASSIGNMENT:
    case ACTIONS.ROLE_DETAILS_FROM_ALL_RESOURCES:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<string, any>;
