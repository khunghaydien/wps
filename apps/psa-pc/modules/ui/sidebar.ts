//
// constants
//
export const ACTIONS = {
  PROJECT: 'MODULES/UI/SIDEBAR/PROJECT',
  ACTIVITY: 'MODULES/UI/SIDEBAR/ACTIVITY',
  UPLOAD: 'MODULES/UI/SIDEBAR/UPLOAD',
};

export const SIDEBAR_TYPES = {
  PROJECT: 'PROJECT',
  ACTIVITY: 'ACTIVITY',
  UPLOAD: 'UPLOAD',
};

//
// actions
//
export const actions = {
  showProject: () => ({
    type: ACTIONS.PROJECT,
    payload: SIDEBAR_TYPES.PROJECT,
  }),
  showActivity: () => ({
    type: ACTIONS.ACTIVITY,
    payload: SIDEBAR_TYPES.ACTIVITY,
  }),
  showUpload: () => ({
    type: ACTIONS.UPLOAD,
    payload: SIDEBAR_TYPES.UPLOAD,
  }),
};

//
// Reducer
//
const initialState = SIDEBAR_TYPES.ACTIVITY;

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.PROJECT:
    case ACTIONS.ACTIVITY:
    case ACTIONS.UPLOAD:
      return action.payload;
    default:
      return state;
  }
};
