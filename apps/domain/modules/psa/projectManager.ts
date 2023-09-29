import {
  initialStateProjectManager,
  ProjectManager,
} from '../../models/psa/ProjectManager';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  SAVE_LOCAL_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT_MANAGER/SAVE_LOCAL_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT_MANAGER/INIT_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT_MANAGER/CLEAR_SUCCESS',
};

const saveLocalSuccess = (body: string) => ({
  type: ACTIONS.SAVE_LOCAL_SUCCESS,
  payload: body,
});
const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const clear: any = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
  payload: [],
});

export const actions = {
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ProjectManager> =>
      dispatch(initialize()),

  saveLocal:
    (projectManager: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(saveLocalSuccess(projectManager)),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<ProjectManager> =>
      dispatch(clear()),
};

const initialState = {
  projectManagerId: initialStateProjectManager,
};

type State = {
  projectManagerId: string;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SAVE_LOCAL_SUCCESS:
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        projectManagerId: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
