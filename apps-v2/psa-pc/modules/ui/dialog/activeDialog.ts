import dropRight from 'lodash/dropRight';

//
// constants
//
export const ACTIONS = {
  ACTIVITY_DETAIL: 'MODULES/UI/DIALOG/ACTIVITY_DETAIL',
  ASSIGNMENT_DETAIL: 'MODULES/UI/DIALOG/ASSIGNMENT_DETAIL',
  DELETE_PROJECT: 'MODULES/UI/DIALOG/DELETE_PROJECT',
  EDIT_ROLE_END_DATE: 'MODULES/UI/DIALOG/EDIT_ROLE_END_DATE',
  EMPLOYEE_CAPABILITY_INFO: 'MODULES/UI/DIALOG/EMPLOYEE_CAPABILITY_INFO',
  HIDE: 'MODULES/UI/DIALOG/HIDE',
  HIDE_ALL: 'MODULES/UI/DIALOG/HIDE_ALL',
  MARK_AS_COMPLETED_ROLE: 'MODULES/UI/DIALOG/MARK_AS_COMPLETED_ROLE',
  NEW_ACTIVITY: 'MODULES/UI/DIALOG/NEW_ACTIVITY',
  NEW_ASSIGNMENT: 'MODULES/UI/DIALOG/NEW_ASSIGNMENT',
  NEW_PROJECT: 'MODULES/UI/DIALOG/NEW_PROJECT',
  NEW_ROLE: 'MODULES/UI/DIALOG/NEW_ROLE',
  RESOURCE_SELECTION: 'MODULES/UI/DIALOG/RESOURCE_SELECTION',
  ROLE_COMMENT: 'MODULES/UI/DIALOG/ROLE_COMMENT',
  ROLE_DETAIL: 'MODULES/UI/DIALOG/ROLE_DETAIL',
  ROLE_MEMO: 'MODULES/UI/DIALOG/ROLE_MEMO',
  RESOURCE_PLANNER_COMMENT: 'MODULES/UI/DIALOG/RESOURCE_PLANNER_COMMENT',
  FINANCE_DETAIL_NEW: 'MODULES/UI/DIALOG/FINANCE_DETAIL_NEW',
  FINANCE_DETAIL_MODIFY: 'MODULES/UI/DIALOG/FINANCE_DETAIL_MODIFY',
  GENERATE_PROJECT_LINK: 'MODULES/UI/DIALOG/GENERATE_PROJECT_LINK',
};

export const dialogTypes = {
  ACTIVITY_DETAIL: 'ACTIVITY_DETAIL',
  ASSIGNMENT_DETAIL: 'ASSIGNMENT_DETAIL',
  DELETE_PROJECT: 'DELETE_PROJECT',
  GENERATE_PROJECT_LINK: 'GENERATE_PROJECT_LINK',
  EDIT_ROLE_END_DATE: 'EDIT_ROLE_END_DATE',
  EMPLOYEE_CAPABILITY_INFO: 'EMPLOYEE_CAPABILITY_INFO',
  HIDE: 'HIDE',
  MARK_AS_COMPLETED_ROLE: 'MARK_AS_COMPLETED_ROLE',
  NEW_ACTIVITY: 'NEW_ACTIVITY',
  NEW_ASSIGNMENT: 'NEW_ASSIGNMENT',
  NEW_PROJECT: 'NEW_PROJECT',
  NEW_ROLE: 'NEW_ROLE',
  RESOURCE_SELECTION: 'RESOURCE_SELECTION',
  ROLE_COMMENT: 'ROLE_COMMENT',
  ROLE_DETAIL: 'ROLE_DETAIL',
  ROLE_MEMO: 'ROLE_MEMO',
  RESOURCE_PLANNER_COMMENT: 'RESOURCE_PLANNER_COMMENT',
  FINANCE_DETAIL_NEW: 'FINANCE_DETAIL_NEW',
  FINANCE_DETAIL_MODIFY: 'FINANCE_DETAIL_MODIFY',
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
  newProject: () => ({
    type: ACTIONS.NEW_PROJECT,
    payload: dialogTypes.NEW_PROJECT,
  }),
  deleteProject: () => ({
    type: ACTIONS.DELETE_PROJECT,
    payload: dialogTypes.DELETE_PROJECT,
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
  editRoleEndDate: () => ({
    type: ACTIONS.EDIT_ROLE_END_DATE,
    payload: dialogTypes.EDIT_ROLE_END_DATE,
  }),
  markAsCompletedRole: () => ({
    type: ACTIONS.MARK_AS_COMPLETED_ROLE,
    payload: dialogTypes.MARK_AS_COMPLETED_ROLE,
  }),
  assignmentDetail: () => ({
    type: ACTIONS.ASSIGNMENT_DETAIL,
    payload: dialogTypes.ASSIGNMENT_DETAIL,
  }),
  roleDetail: () => ({
    type: ACTIONS.ROLE_DETAIL,
    payload: dialogTypes.ROLE_DETAIL,
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
  openResourcePlannerComment: () => ({
    type: ACTIONS.RESOURCE_PLANNER_COMMENT,
    payload: dialogTypes.RESOURCE_PLANNER_COMMENT,
  }),
  openNewFinanceDetailDialog: () => ({
    type: ACTIONS.FINANCE_DETAIL_NEW,
    payload: dialogTypes.FINANCE_DETAIL_NEW,
  }),
  openModifyFinanceDetailDialog: () => ({
    type: ACTIONS.FINANCE_DETAIL_MODIFY,
    payload: dialogTypes.FINANCE_DETAIL_MODIFY,
  }),
  generateProjectLink: () => ({
    type: ACTIONS.GENERATE_PROJECT_LINK,
    payload: dialogTypes.GENERATE_PROJECT_LINK,
  }),
  
};

//
// Reducer
//
const initialState = [];

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.HIDE:
      return dropRight(state);
    case ACTIONS.HIDE_ALL:
      return initialState;
    case ACTIONS.NEW_PROJECT:
    case ACTIONS.DELETE_PROJECT:
    case ACTIONS.NEW_ACTIVITY:
    case ACTIONS.ACTIVITY_DETAIL:
    case ACTIONS.NEW_ASSIGNMENT:
    case ACTIONS.ASSIGNMENT_DETAIL:
    case ACTIONS.NEW_ROLE:
    case ACTIONS.EDIT_ROLE_END_DATE:
    case ACTIONS.MARK_AS_COMPLETED_ROLE:
    case ACTIONS.ROLE_DETAIL:
    case ACTIONS.RESOURCE_SELECTION:
    case ACTIONS.EMPLOYEE_CAPABILITY_INFO:
    case ACTIONS.ROLE_COMMENT:
    case ACTIONS.RESOURCE_PLANNER_COMMENT:
    case ACTIONS.ROLE_MEMO:
    case ACTIONS.FINANCE_DETAIL_NEW:
    case ACTIONS.GENERATE_PROJECT_LINK:
    case ACTIONS.FINANCE_DETAIL_MODIFY:
      return [...state, action.payload];
    default:
      return state;
  }
};
