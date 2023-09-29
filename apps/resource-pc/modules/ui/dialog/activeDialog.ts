import { Reducer } from 'redux';

import dropRight from 'lodash/dropRight';

//
// constants
//
export const ACTIONS = {
  ACTIVITY_DETAIL: 'MODULES/UI/DIALOG/ACTIVITY_DETAIL',
  ASSIGNMENT_DETAIL: 'MODULES/UI/DIALOG/ASSIGNMENT_DETAIL',
  EMPLOYEE_CAPABILITY_INFO: 'MODULES/UI/DIALOG/EMPLOYEE_CAPABILITY_INFO',
  HIDE: 'MODULES/UI/DIALOG/HIDE',
  HIDE_ALL: 'MODULES/UI/DIALOG/HIDE_ALL',
  NEW_ACTIVITY: 'MODULES/UI/DIALOG/NEW_ACTIVITY',
  NEW_ASSIGNMENT: 'MODULES/UI/DIALOG/NEW_ASSIGNMENT',
  NEW_PROJECT: 'MODULES/UI/DIALOG/NEW_PROJECT',
  NEW_ROLE: 'MODULES/UI/DIALOG/NEW_ROLE',
  RESOURCE_SELECTION: 'MODULES/UI/DIALOG/RESOURCE_SELECTION',
  ROLE_COMMENT: 'MODULES/UI/DIALOG/ROLE_COMMENT',
  ROLE_MEMO: 'MODULES/UI/DIALOG/ROLE_MEMO',
};

export const dialogTypes = {
  ACTIVITY_DETAIL: 'ACTIVITY_DETAIL',
  ASSIGNMENT_DETAIL: 'ASSIGNMENT_DETAIL',
  EMPLOYEE_CAPABILITY_INFO: 'EMPLOYEE_CAPABILITY_INFO',
  HIDE: 'HIDE',
  NEW_ACTIVITY: 'NEW_ACTIVITY',
  NEW_ASSIGNMENT: 'NEW_ASSIGNMENT',
  NEW_PROJECT: 'NEW_PROJECT',
  NEW_ROLE: 'NEW_ROLE',
  RESOURCE_SELECTION: 'RESOURCE_SELECTION',
  ROLE_COMMENT: 'ROLE_COMMENT',
  ROLE_MEMO: 'ROLE_MEMO',
};

//
// actions
//
export const actions = {
  hide: () => ({
    type: ACTIONS.HIDE,
    payload: dialogTypes.HIDE,
  }),
  hideAll: () => ({
    type: ACTIONS.HIDE_ALL,
  }),
  newRequest: () => ({
    type: ACTIONS.NEW_PROJECT,
    payload: dialogTypes.NEW_PROJECT,
  }),
  newActivity: () => ({
    type: ACTIONS.NEW_ACTIVITY,
    payload: dialogTypes.NEW_ACTIVITY,
  }),
  activityDetail: () => ({
    type: ACTIONS.ACTIVITY_DETAIL,
    payload: dialogTypes.ACTIVITY_DETAIL,
  }),
  newAssignment: () => ({
    type: ACTIONS.NEW_ASSIGNMENT,
    payload: dialogTypes.NEW_ASSIGNMENT,
  }),
  newRole: () => ({
    type: ACTIONS.NEW_ROLE,
    payload: dialogTypes.NEW_ROLE,
  }),
  assignmentDetail: () => ({
    type: ACTIONS.ASSIGNMENT_DETAIL,
    payload: dialogTypes.ASSIGNMENT_DETAIL,
  }),
  resourceSelection: () => ({
    type: ACTIONS.RESOURCE_SELECTION,
    payload: dialogTypes.RESOURCE_SELECTION,
  }),
  employeeCapabilityInfo: () => ({
    type: ACTIONS.EMPLOYEE_CAPABILITY_INFO,
    payload: dialogTypes.EMPLOYEE_CAPABILITY_INFO,
  }),
  openRoleComment: () => ({
    type: ACTIONS.ROLE_COMMENT,
    payload: dialogTypes.ROLE_COMMENT,
  }),
  openRoleMemo: () => ({
    type: ACTIONS.ROLE_MEMO,
    payload: dialogTypes.ROLE_MEMO,
  }),
};

//
// Reducer
//
const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HIDE:
      return dropRight(state);
    case ACTIONS.HIDE_ALL:
      return initialState;
    case ACTIONS.NEW_PROJECT:
    case ACTIONS.NEW_ACTIVITY:
    case ACTIONS.ACTIVITY_DETAIL:
    case ACTIONS.NEW_ASSIGNMENT:
    case ACTIONS.NEW_ROLE:
    case ACTIONS.ASSIGNMENT_DETAIL:
    case ACTIONS.RESOURCE_SELECTION:
    case ACTIONS.EMPLOYEE_CAPABILITY_INFO:
    case ACTIONS.ROLE_COMMENT:
    case ACTIONS.ROLE_MEMO:
      return [...state, action.payload];
    default:
      return state;
  }
}) as Reducer<Array<string>, any>;
