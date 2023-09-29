import { Reducer } from 'redux';

/**
 * constants
 */
export const ACTIONS = {
  REQUEST_LIST: 'MODULES/UI/SITE_ROUTE/REQUEST_LIST',
  ROLE_DETAILS: 'MODULES/UI/SITE_ROUTE/ROLE_DETAILS',
  RESOURCE_PLANNER: 'MODULES/UI/SITE_ROUTE/RESOURCE_PLANNER',
  SCHEDULE_DETAILS: 'MODULES/UI/SITE_ROUTE/SCHEDULE_DETAILS',
  VIEW_ALL_RESOURCES: 'MODULES/UI/SITE_ROUTE/VIEW_ALL_RESOURCES',
  RESCHEDULE: 'MODULES/UI/SITE_ROUTE/RESCHEDULE',
};

/**
 * Define the route action for new screen here
 */
export const SITE_ROUTE_TYPES = {
  REQUEST_LIST: 'REQUEST_LIST',
  ROLE_DETAILS: 'ROLE_DETAILS',
  RESOURCE_PLANNER: 'RESOURCE_PLANNER',
  SCHEDULE_DETAILS: 'SCHEDULE_DETAILS',
  VIEW_ALL_RESOURCES: 'VIEW_ALL_RESOURCES',
  RESCHEDULE: 'RESCHEDULE',
};

/**
 * Actions to update the active route
 */
export const actions = {
  showResourceList: () => ({
    type: ACTIONS.REQUEST_LIST,
    payload: SITE_ROUTE_TYPES.REQUEST_LIST,
  }),
  showRoleDetails: () => ({
    type: ACTIONS.ROLE_DETAILS,
    payload: SITE_ROUTE_TYPES.ROLE_DETAILS,
  }),
  showResourcePlanner: () => ({
    type: ACTIONS.RESOURCE_PLANNER,
    payload: SITE_ROUTE_TYPES.RESOURCE_PLANNER,
  }),
  showScheduleDetails: () => ({
    type: ACTIONS.SCHEDULE_DETAILS,
    payload: SITE_ROUTE_TYPES.SCHEDULE_DETAILS,
  }),
  showViewAllResources: () => ({
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
 * Default screen - RESOURCE_LIST
 */
const initialState = SITE_ROUTE_TYPES.REQUEST_LIST;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_LIST:
    case ACTIONS.ROLE_DETAILS:
    case ACTIONS.RESOURCE_PLANNER:
    case ACTIONS.SCHEDULE_DETAILS:
    case ACTIONS.VIEW_ALL_RESOURCES:
    case ACTIONS.RESCHEDULE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<string, any>;
