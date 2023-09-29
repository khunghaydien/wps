import cloneDeep from 'lodash/cloneDeep';

import { catchApiError } from '../../../commons/actions/app';

import {
  Activity,
  ActivityList,
  deleteActivity,
  getActivity,
  getActivityList,
  initialStateActivity,
  saveActivity,
} from '../../models/psa/Activity';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PSA/ACTIVITY/LIST_SUCCESS',
  LIST_UPDATE: 'MODULES/ENTITIES/PSA/ACTIVITY/LIST_UPDATE',
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/ACTIVITY/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/PSA/ACTIVITY/SAVE_SUCCESS',
  SET_SUCCESS: 'MODULES/ENTITIES/PSA/ACTIVITY/SET_SUCCESS',
  SAVE: 'MODULES/UI/PSA/ACTIVITY/SAVE',
  DELETE: 'MODULES/UI/PSA/ACTIVITY/DELETE',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/ACTIVITY/INIT_SUCCESS',
  SET_TITLE: 'MODULES/ENTITIES/PSA/ACTIVITY/SET_TITLE',
  SET_STARTDATE: 'MODULES/ENTITIES/PSA/ACTIVITY/SET_STARTDATE',
  SET_ENDDATE: 'MODULES/ENTITIES/PSA/ACTIVITY/SET_ENDDATE',
};

const listSuccess = (body: ActivityList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const getSuccess = (body: Activity) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const saveSuccess = (body: Activity) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const setSuccess = (activityId: string) => ({
  type: ACTIONS.SET_SUCCESS,
  payload: activityId,
});

const setTitle = (title: string) => ({
  type: ACTIONS.SET_TITLE,
  payload: title,
});
const setStartDate = (startDate: string) => ({
  type: ACTIONS.SET_STARTDATE,
  payload: startDate,
});
const setEndDate = (endDate: string) => ({
  type: ACTIONS.SET_ENDDATE,
  payload: endDate,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

export const actions = {
  list:
    (empId: string) =>
    (dispatch: AppDispatch): void | any =>
      getActivityList(empId)
        .then((res: ActivityList) => dispatch(listSuccess(res)))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ActivityList> =>
      dispatch(initialize()),

  set:
    (activityId: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setSuccess(activityId)),

  setTitle:
    (title: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setTitle(title)),
  setStartDate:
    (startDate: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setStartDate(startDate)),
  setEndDate:
    (endDate: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setEndDate(endDate)),

  get:
    (activityId: string) =>
    (dispatch: AppDispatch): void | any =>
      getActivity(activityId)
        .then((res: any) => dispatch(getSuccess(res.activity)))
        .catch((err) => {
          throw err;
        }),

  save:
    (activity: Activity) =>
    (dispatch: AppDispatch): void | any =>
      saveActivity(activity)
        .then((res: Activity) => {
          activity.activityId = res.activityId;
          dispatch(saveSuccess(activity));
          return res;
        })
        .catch((err) => {
          throw err;
        }),

  delete: (activityId: string) => () =>
    deleteActivity(activityId).catch((err) => {
      throw err;
    }),
};

const initialState = {
  activityList: [],
  activity: initialStateActivity,
};

type State = {
  activityList: ActivityList;
  activity: Activity;
};

export default (state: State = initialState, action: any) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        activityList: action.payload,
      };
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
      return {
        ...state,
        activity: action.payload,
      };
    case ACTIONS.SET_SUCCESS:
      newState.activity.activityId = action.payload;
      return newState;
    case ACTIONS.SET_TITLE:
      newState.activity.title = action.payload;
      return newState;
    case ACTIONS.SET_STARTDATE:
      newState.activity.plannedStartDate = action.payload;
      return newState;
    case ACTIONS.SET_ENDDATE:
      newState.activity.plannedEndDate = action.payload;
      return newState;
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        activityList: action.payload,
      };
    default:
      return state;
  }
};
