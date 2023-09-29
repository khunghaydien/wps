/**
 * constants
 */
export const ACTIONS = {
  SCHEDULE_DETAILS: 'MODULES/UI/SITE_ROUTE/SCHEDULE_DETAILS',
  SELF_RESCHEDULE: 'MODULES/UI/SITE_ROUTE/SELF_RESCHEDULE',
  HOME: 'MODULES/UI/SITE_ROUTE/HOME',
};

/**
 * Define the route action for new screen here
 */
export const SITE_ROUTE_TYPES = {
  SCHEDULE_DETAILS: 'SCHEDULE_DETAILS',
  SELF_RESCHEDULE: 'SELF_RESCHEDULE',
  HOME: 'HOME',
};

/**
 * Actions to update the active route
 */
export const actions = {
  showScheduleDetails: () => ({
    type: ACTIONS.SCHEDULE_DETAILS,
    payload: SITE_ROUTE_TYPES.SCHEDULE_DETAILS,
  }),
  showSelfReschedule: () => ({
    type: ACTIONS.SELF_RESCHEDULE,
    payload: SITE_ROUTE_TYPES.SELF_RESCHEDULE,
  }),
  showHome: () => ({
    type: ACTIONS.HOME,
    payload: SITE_ROUTE_TYPES.HOME,
  }),
};

/**
 * Reducer
 * Default screen - SCHEDULE_DETAILS
 */
const initialState = '';

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SCHEDULE_DETAILS:
    case ACTIONS.SELF_RESCHEDULE:
    case ACTIONS.HOME:
      return action.payload;
    default:
      return state;
  }
};
