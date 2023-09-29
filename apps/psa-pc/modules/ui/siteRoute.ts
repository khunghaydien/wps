/**
 * constants
 */
export const ACTIONS = {
  PROJECT_LIST: 'MODULES/UI/SITE_ROUTE/PROJECT_LIST',
  ROLE_DETAILS: 'MODULES/UI/SITE_ROUTE/ROLE_DETAILS',
  SCHEDULE_DETAILS: 'MODULES/UI/SITE_ROUTE/SCHEDULE_DETAILS',
  VIEW_PROJECT: 'MODULES/UI/SITE_ROUTE/VIEW_PROJECT',
  VIEW_ALL_RESOURCES: 'MODULES/UI/SITE_ROUTE/VIEW_ALL_RESOURCES',
  RESOURCE_PLANNER: 'MODULES/UI/SITE_ROUTE/RESOURCE_PLANNER',
  RESCHEDULE: 'MODULES/UI/SITE_ROUTE/RESCHEDULE',
};

/**
 * Define the route action for new screen here
 */
export const SITE_ROUTE_TYPES = {
  PROJECT_LIST: 'PROJECT_LIST',
  ROLE_DETAILS: 'ROLE_DETAILS',
  SCHEDULE_DETAILS: 'SCHEDULE_DETAILS',
  VIEW_PROJECT: 'VIEW_PROJECT',
  VIEW_ALL_RESOURCES: 'VIEW_ALL_RESOURCES',
  RESOURCE_PLANNER: 'RESOURCE_PLANNER',
  RESCHEDULE: 'RESCHEDULE',
};

/**
 * Actions to update the active route
 */
export const actions = {
  showProjectList: () => ({
    type: ACTIONS.PROJECT_LIST,
    payload: SITE_ROUTE_TYPES.PROJECT_LIST,
  }),
  showRoleDetails: () => ({
    type: ACTIONS.ROLE_DETAILS,
    payload: SITE_ROUTE_TYPES.ROLE_DETAILS,
  }),
  showScheduleDetails: () => ({
    type: ACTIONS.SCHEDULE_DETAILS,
    payload: SITE_ROUTE_TYPES.SCHEDULE_DETAILS,
  }),
  showProject: () => ({
    type: ACTIONS.VIEW_PROJECT,
    payload: SITE_ROUTE_TYPES.VIEW_PROJECT,
  }),
  showViewAllResources: () => ({
    type: ACTIONS.VIEW_ALL_RESOURCES,
    payload: SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES,
  }),
  showResourcePlanner: () => ({
    type: ACTIONS.VIEW_ALL_RESOURCES,
    payload: SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES,
  }),
  showReschedule: () => ({
    type: ACTIONS.RESCHEDULE,
    payload: SITE_ROUTE_TYPES.RESCHEDULE,
  }),
};

/**
 * Reducer
 * Default screen - PROJECT_LIST
 */
const initialState = SITE_ROUTE_TYPES.PROJECT_LIST;

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.PROJECT_LIST:
    case ACTIONS.ROLE_DETAILS:
    case ACTIONS.SCHEDULE_DETAILS:
    case ACTIONS.VIEW_PROJECT:
    case ACTIONS.VIEW_ALL_RESOURCES:
    case ACTIONS.RESOURCE_PLANNER:
    case ACTIONS.RESCHEDULE:
      return action.payload;
    default:
      return state;
  }
};
