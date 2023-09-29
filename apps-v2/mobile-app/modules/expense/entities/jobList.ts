import { Reducer } from 'redux';

import {
  getJobList,
  JobList,
  searchJob,
} from '../../../../domain/models/exp/Job';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/JOB/GET_SUCESS',
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/JOB/SEARCH_SUCESS',
  SEARCH_WITH_TYPE_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/JOB/SEARCH_WITH_TYPE_SUCCESS',
};

type Action = { payload: JobList; type: string };

const getSuccess = (body: JobList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const searchSuccess = (body: JobList) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (
      empId: string,
      parentId?: string,
      targetDate?: string,
      limitNumber?: number
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return getJobList(empId, parentId, targetDate, limitNumber + 1)
        .then((res) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  search:
    (
      companyId: string,
      empId: string,
      parentId: string,
      targetDate: string,
      query: string,
      limitNumber?: number,
      usedIn?: string
    ) =>
    (dispatch: AppDispatch): Promise<Action> => {
      return searchJob(
        companyId,
        empId,
        parentId,
        targetDate,
        query,
        limitNumber,
        usedIn
      )
        .then((res: JobList) => dispatch(searchSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    case ACTIONS.SEARCH_WITH_TYPE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<JobList, any>;
