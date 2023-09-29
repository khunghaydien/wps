import {
  Assignment,
  getAssignment,
  initialStateAssignment,
  saveAssignment,
} from '../../models/psa/Assignment';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/ASSIGNMENT/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/PSA/ASSIGNMENT/SAVE_SUCCESS',
  SAVE_LOCAL_SUCCESS: 'MODULES/ENTITIES/PSA/ASSIGNMENT/SAVE_LOCAL_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/ASSIGNMENT/INIT_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/ENTITIES/PSA/ASSIGNMENT/CLEAR_SUCCESS',
};

const getSuccess = (body: Assignment) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const saveSuccess = (body: Assignment) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const saveLocalSuccess = (body: Assignment) => ({
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
    (dispatch: AppDispatch): Promise<Assignment> =>
      dispatch(initialize()),

  clear:
    () =>
    (dispatch: AppDispatch): Promise<Assignment> =>
      dispatch(clear()),

  get:
    (assignmentId: string) =>
    (dispatch: AppDispatch): void | any =>
      getAssignment(assignmentId)
        .then((res: any) => dispatch(getSuccess(res.assignment)))
        .catch((err) => {
          throw err;
        }),

  save:
    (assignment: Assignment) =>
    (dispatch: AppDispatch): void | any =>
      saveAssignment(assignment)
        .then((res) => {
          dispatch(saveSuccess(assignment));
          return res;
        })
        .catch((err) => {
          throw err;
        }),

  saveLocal:
    (assignment: Assignment) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(saveLocalSuccess(assignment)),
};

const initialState = {
  assignment: initialStateAssignment,
};

type State = {
  assignment: Assignment;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
    case ACTIONS.SAVE_LOCAL_SUCCESS:
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        assignment: action.payload,
      };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
